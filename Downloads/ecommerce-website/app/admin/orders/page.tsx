import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { isStripeConfigured, getStripeClient } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import { formatCurrency } from "@/utils";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Orders",
  path: "/admin/orders",
  noIndex: true,
});

interface OrderRow {
  id: string;
  date: string;
  email: string;
  amount: string;
  status: string;
}

async function getOrders(): Promise<OrderRow[]> {
  if (!isStripeConfigured) return [];
  const stripe = getStripeClient();
  const sessions = await stripe.checkout.sessions.list({ limit: 25 });

  return sessions.data.map((session) => ({
    id: session.id.slice(-10).toUpperCase(),
    date: new Date(session.created * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    email: session.customer_details?.email ?? "—",
    amount:
      typeof session.amount_total === "number"
        ? formatCurrency(session.amount_total / 100, session.currency?.toUpperCase() ?? "USD")
        : "—",
    status: session.payment_status,
  }));
}

const columns: Column<OrderRow>[] = [
  { header: "Order", render: (o) => o.id },
  { header: "Date", render: (o) => o.date },
  { header: "Customer", render: (o) => o.email },
  { header: "Amount", render: (o) => o.amount, align: "right" },
  {
    header: "Status",
    render: (o) => (
      <span
        className={
          o.status === "paid"
            ? "rounded-full bg-sage-100 px-2.5 py-1 text-[11px] uppercase tracking-wide text-ink/70"
            : "rounded-full bg-stone-100 px-2.5 py-1 text-[11px] uppercase tracking-wide text-ink/50"
        }
      >
        {o.status}
      </span>
    ),
  },
];

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Orders</h2>
        <p className="font-sans text-[12px] text-ink/40">
          {isStripeConfigured
            ? `Live from Stripe — most recent 25 checkout sessions${
                isDatabaseConfigured ? " (also persisted to the database)" : ""
              }`
            : "Stripe isn't configured"}
        </p>
      </div>

      {!isStripeConfigured ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
          <ShoppingCart className="h-7 w-7 text-ink/30" strokeWidth={1.25} />
          <p className="max-w-xs font-sans text-[14px] text-ink/55">
            Connect Stripe (see <code className="text-[13px]">.env.local.example</code>)
            to see real orders here — nothing is faked in the meantime.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={orders}
          getRowKey={(o) => o.id}
          emptyMessage="No orders yet."
        />
      )}
    </div>
  );
}

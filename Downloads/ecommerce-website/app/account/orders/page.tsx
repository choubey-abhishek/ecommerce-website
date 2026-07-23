import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { getOrdersForUser } from "@/services/orders";
import { formatCurrency, cn } from "@/utils";

export const metadata: Metadata = buildMetadata({
  title: "Order History",
  path: "/account/orders",
  noIndex: true,
});

const STATUS_STYLES: Record<string, string> = {
  PAID: "bg-clay-100 text-clay-600",
  FULFILLED: "bg-olive-100 text-ink/70",
  PENDING: "bg-stone-100 text-ink/60",
  CANCELLED: "bg-terracotta-100 text-terracotta-600",
  REFUNDED: "bg-terracotta-100 text-terracotta-600",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function OrdersPage() {
  const { userId } = auth();
  const orders = userId ? await getOrdersForUser(userId) : [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-ink/15 bg-sand-50 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink/40 shadow-card">
          <PackageSearch className="h-6 w-6" strokeWidth={1.25} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-serif text-xl text-ink">No orders yet</h2>
          <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/60">
            When you place an order it will appear here, with its status and a
            full receipt.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/shop">Browse the Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="sr-only">Your orders</h2>
      <ul className="space-y-6">
        {orders.map((order) => {
          const currency = order.currency?.toUpperCase() || "USD";
          return (
            <li
              key={order.id}
              className="overflow-hidden rounded-3xl border border-ink/10 bg-paper"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 bg-sand-50 px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                      Order
                    </p>
                    <p className="font-sans text-[13px] text-ink">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                      Placed
                    </p>
                    <p className="font-sans text-[13px] text-ink">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                      Total
                    </p>
                    <p className="font-sans text-[13px] text-ink">
                      {formatCurrency(order.totalCents / 100, currency)}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 font-sans text-[11px] uppercase tracking-widest",
                    STATUS_STYLES[order.status] ?? "bg-stone-100 text-ink/60"
                  )}
                >
                  {order.status.toLowerCase()}
                </span>
              </div>

              <ul className="divide-y divide-ink/5 px-6">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-4 font-sans text-[14px]"
                  >
                    <span className="text-ink">
                      <span className="text-ink/50">{item.quantity} ×</span>{" "}
                      {item.title}
                    </span>
                    <span className="whitespace-nowrap text-ink/70">
                      {formatCurrency((item.unitPriceCents * item.quantity) / 100, currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

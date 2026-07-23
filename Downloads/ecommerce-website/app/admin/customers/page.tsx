import type { Metadata } from "next";
import { Users } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { isClerkConfigured } from "@/lib/auth-config";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Customers",
  path: "/admin/customers",
  noIndex: true,
});

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  joined: string;
}

async function getCustomers(): Promise<CustomerRow[]> {
  if (!isClerkConfigured) return [];
  try {
    const { clerkClient } = await import("@clerk/nextjs/server");
    const client = await clerkClient();
    const { data } = await client.users.getUserList({ limit: 25 });

    return data.map((user) => ({
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || "—",
      email: user.primaryEmailAddress?.emailAddress ?? "—",
      joined: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));
  } catch {
    return [];
  }
}

const columns: Column<CustomerRow>[] = [
  { header: "Name", render: (c) => c.name },
  { header: "Email", render: (c) => c.email },
  { header: "Joined", render: (c) => c.joined },
];

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Customers</h2>
        <p className="font-sans text-[12px] text-ink/40">
          {isClerkConfigured ? "Live from Clerk — most recent 25 accounts" : "Clerk isn't configured"}
        </p>
      </div>

      {!isClerkConfigured ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
          <Users className="h-7 w-7 text-ink/30" strokeWidth={1.25} />
          <p className="max-w-xs font-sans text-[14px] text-ink/55">
            Connect Clerk (see <code className="text-[13px]">.env.local.example</code>)
            to see real signed-up customers here.
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={customers}
          getRowKey={(c) => c.id}
          emptyMessage="No customers have signed up yet."
        />
      )}
    </div>
  );
}

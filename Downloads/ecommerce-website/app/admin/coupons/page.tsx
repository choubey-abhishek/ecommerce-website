import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { COUPONS, type Coupon } from "@/lib/coupons";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Coupons",
  path: "/admin/coupons",
  noIndex: true,
});

const columns: Column<Coupon>[] = [
  { header: "Code", render: (c) => <span className="font-medium text-ink">{c.code}</span> },
  { header: "Type", render: (c) => (c.type === "percent" ? "Percentage" : "Fixed Amount") },
  { header: "Value", render: (c) => (c.type === "percent" ? `${c.value}%` : `$${c.value}`) },
  { header: "Description", render: (c) => c.description },
];

export default function AdminCouponsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Coupons ({COUPONS.length})</h2>
        <p className="font-sans text-[12px] text-ink/40">
          Hard-coded in lib/coupons.ts — no usage tracking or expiry yet
        </p>
      </div>
      <DataTable columns={columns} rows={COUPONS} getRowKey={(c) => c.code} />
    </div>
  );
}

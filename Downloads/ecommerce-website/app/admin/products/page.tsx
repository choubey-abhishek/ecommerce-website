import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/products";
import { formatCurrency } from "@/utils";
import { DataTable, type Column } from "@/components/admin/data-table";
import type { Product } from "@/lib/products";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Products",
  path: "/admin/products",
  noIndex: true,
});

const columns: Column<Product>[] = [
  { header: "Title", render: (p) => p.title },
  { header: "Category", render: (p) => p.category },
  { header: "Dimensions", render: (p) => p.dimensions },
  { header: "Price", render: (p) => formatCurrency(p.price, p.currency), align: "right" },
  {
    header: "Status",
    render: (p) => (
      <span
        className={
          p.sold
            ? "rounded-full bg-terracotta-100 px-2.5 py-1 text-[11px] uppercase tracking-wide text-terracotta-600"
            : "rounded-full bg-sage-100 px-2.5 py-1 text-[11px] uppercase tracking-wide text-ink/70"
        }
      >
        {p.sold ? "Sold" : "Available"}
      </span>
    ),
  },
  {
    header: "Flags",
    render: (p) =>
      [p.featured && "Featured", p.bestSeller && "Best Seller"].filter(Boolean).join(", ") || "—",
  },
];

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">Products ({products.length})</h2>
        <p className="font-sans text-[12px] text-ink/40">
          Read-only — editing arrives with the CMS in Phase 9
        </p>
      </div>
      <DataTable columns={columns} rows={products} getRowKey={(p) => p.id} />
    </div>
  );
}

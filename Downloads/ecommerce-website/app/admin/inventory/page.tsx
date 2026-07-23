import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { products, PRODUCT_CATEGORIES, getProductsByCategory } from "@/lib/products";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Inventory",
  path: "/admin/inventory",
  noIndex: true,
});

interface InventoryRow {
  category: string;
  available: number;
  sold: number;
}

const columns: Column<InventoryRow>[] = [
  { header: "Category", render: (r) => r.category },
  { header: "Available", render: (r) => r.available, align: "right" },
  { header: "Sold", render: (r) => r.sold, align: "right" },
];

export default function AdminInventoryPage() {
  const available = products.filter((p) => !p.sold).length;
  const sold = products.filter((p) => p.sold).length;

  const rows: InventoryRow[] = PRODUCT_CATEGORIES.map((category) => {
    const items = getProductsByCategory(category);
    return {
      category,
      available: items.filter((p) => !p.sold).length,
      sold: items.filter((p) => p.sold).length,
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-lg text-ink">Inventory</h2>
        <p className="mt-1 font-sans text-[12px] text-ink/40">
          Every piece is one of a kind, so &quot;inventory&quot; here means
          availability, not stock counts per SKU.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Available" value={available} />
        <StatCard label="Sold" value={sold} />
        <StatCard label="Total Catalog" value={products.length} />
      </div>

      <DataTable columns={columns} rows={rows} getRowKey={(r) => r.category} />
    </div>
  );
}

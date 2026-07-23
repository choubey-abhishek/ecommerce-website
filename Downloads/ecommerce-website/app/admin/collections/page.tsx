import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { PRODUCT_CATEGORIES, getProductsByCategory } from "@/lib/products";
import { DataTable, type Column } from "@/components/admin/data-table";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Collections",
  path: "/admin/collections",
  noIndex: true,
});

interface CollectionRow {
  category: string;
  count: number;
  available: number;
}

const columns: Column<CollectionRow>[] = [
  { header: "Collection", render: (r) => r.category },
  { header: "Total Pieces", render: (r) => r.count, align: "right" },
  { header: "Available", render: (r) => r.available, align: "right" },
];

export default function AdminCollectionsPage() {
  const rows: CollectionRow[] = PRODUCT_CATEGORIES.map((category) => {
    const items = getProductsByCategory(category);
    return {
      category,
      count: items.length,
      available: items.filter((p) => !p.sold).length,
    };
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-lg text-ink">
          Collections ({PRODUCT_CATEGORIES.length})
        </h2>
        <p className="font-sans text-[12px] text-ink/40">
          Derived from product categories — a dedicated Collections model
          arrives with the CMS in Phase 9
        </p>
      </div>
      <DataTable columns={columns} rows={rows} getRowKey={(r) => r.category} />
    </div>
  );
}

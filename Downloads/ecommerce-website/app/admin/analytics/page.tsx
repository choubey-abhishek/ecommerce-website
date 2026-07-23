import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { products } from "@/lib/products";
import { StatCard } from "@/components/admin/stat-card";

export const metadata: Metadata = buildMetadata({
  title: "Admin — Analytics",
  path: "/admin/analytics",
  noIndex: true,
});

export default function AdminAnalyticsPage() {
  const totalCatalogValue = products.reduce((sum, p) => sum + (p.sold ? 0 : p.price), 0);
  const soldValue = products.reduce((sum, p) => sum + (p.sold ? p.price : 0), 0);

  return (
    <div>
      <h2 className="font-serif text-lg text-ink">Analytics</h2>
      <p className="mt-1 max-w-lg font-sans text-[13px] text-ink/50">
        No traffic analytics are wired up yet — that&apos;s Google Analytics 4,
        Google Tag Manager, and Microsoft Clarity in Phase 11. Rather than
        show fabricated visitor numbers, here&apos;s what we can honestly
        report from the catalog itself today.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Available Inventory Value"
          value={`$${totalCatalogValue.toLocaleString()}`}
          hint="Sum of listed prices, unsold pieces"
        />
        <StatCard
          label="Realized Sales Value"
          value={`$${soldValue.toLocaleString()}`}
          hint="Sum of listed prices, sold pieces"
        />
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 py-16 text-center">
        <BarChart3 className="h-7 w-7 text-ink/30" strokeWidth={1.25} />
        <p className="max-w-sm font-sans text-[14px] text-ink/55">
          Traffic, conversion, and channel reports will appear here once
          GA4 is connected. No placeholder charts — this stays empty
          until there&apos;s real data behind it.
        </p>
      </div>
    </div>
  );
}

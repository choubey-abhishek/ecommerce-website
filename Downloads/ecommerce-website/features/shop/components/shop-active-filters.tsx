"use client";

import { X } from "lucide-react";
import { PRICE_BOUNDS } from "@/lib/products";
import { formatCurrency } from "@/utils";
import type { ShopFiltersState } from "@/features/shop/use-shop-filters";

/**
 * Removable chips summarizing the active filters, shown above the results.
 * Gives desktop users at-a-glance feedback and one-tap removal without
 * reopening the sidebar (the sidebar itself had no summary before).
 */
export function ShopActiveFilters({
  filters,
  onClearCategory,
  onClearSearch,
  onClearPrice,
  onClearAvailability,
  onResetAll,
}: {
  filters: ShopFiltersState;
  onClearCategory: () => void;
  onClearSearch: () => void;
  onClearPrice: () => void;
  onClearAvailability: () => void;
  onResetAll: () => void;
}) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.category !== "All") {
    chips.push({ key: "category", label: filters.category, onRemove: onClearCategory });
  }
  if (filters.search.length > 0) {
    chips.push({ key: "search", label: `“${filters.search}”`, onRemove: onClearSearch });
  }
  if (filters.minPrice > PRICE_BOUNDS.min || filters.maxPrice < PRICE_BOUNDS.max) {
    chips.push({
      key: "price",
      label: `${formatCurrency(filters.minPrice)} – ${formatCurrency(filters.maxPrice)}`,
      onRemove: onClearPrice,
    });
  }
  if (filters.availability !== "all") {
    chips.push({ key: "availability", label: "Available only", onRemove: onClearAvailability });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="group inline-flex items-center gap-1.5 rounded-full bg-sand-100 py-1.5 pl-3.5 pr-2.5 font-sans text-[12px] text-ink/80 transition-colors hover:bg-sand-200"
        >
          {chip.label}
          <X
            className="h-3.5 w-3.5 text-ink/40 transition-colors group-hover:text-ink"
            strokeWidth={2}
          />
        </button>
      ))}
      <button
        type="button"
        onClick={onResetAll}
        className="link-underline ml-1 font-sans text-[12px] uppercase tracking-widest text-ink/50 hover:text-ink"
      >
        Clear all
      </button>
    </div>
  );
}

"use client";

import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { PRICE_BOUNDS, PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/products";
import { formatCurrency, cn } from "@/utils";
import type { ShopFiltersState } from "@/features/shop/use-shop-filters";

const CATEGORY_OPTIONS: (ProductCategory | "All")[] = ["All", ...PRODUCT_CATEGORIES];

export interface FiltersContentProps {
  filters: ShopFiltersState;
  onCategoryChange: (category: ProductCategory | "All") => void;
  onPriceChange: (min: number, max: number) => void;
  onAvailabilityChange: (availability: "all" | "available") => void;
  onReset: () => void;
}

/**
 * Shared, Dialog-free filter controls used by both the always-visible
 * desktop sidebar and the mobile slide-in sheet. Exported (not just used
 * internally) so the mobile sheet can live in its own file — see
 * shop-filters-mobile-sheet.tsx — and be code-split away from
 * @radix-ui/react-dialog, which every /shop visitor would otherwise
 * download just because the sidebar is statically imported here.
 */
export function FiltersContent({
  filters,
  onCategoryChange,
  onPriceChange,
  onAvailabilityChange,
  onReset,
}: FiltersContentProps) {
  return (
    <div className="space-y-10">
      <div role="radiogroup" aria-label="Filter by category">
        <h3 className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Category
        </h3>
        <ul className="mt-4 space-y-1">
          {CATEGORY_OPTIONS.map((category) => {
            const selected = filters.category === category;
            return (
              <li key={category}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-xl px-2 py-2 font-sans text-[14px] transition-colors",
                    selected ? "bg-sand-100 text-ink" : "text-ink/70 hover:bg-sand-50 hover:text-ink"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 flex-none items-center justify-center rounded-full border transition-colors",
                      selected ? "border-ink bg-ink text-white" : "border-ink/25"
                    )}
                  >
                    {selected && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  {category === "All" ? "All Pieces" : category}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Price
        </h3>
        <div className="mt-6 px-1">
          <Slider
            min={PRICE_BOUNDS.min}
            max={PRICE_BOUNDS.max}
            step={10}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => onPriceChange(min, max)}
            minStepsBetweenThumbs={1}
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-sans text-[13px] text-ink/60">
          <span>{formatCurrency(filters.minPrice)}</span>
          <span>{formatCurrency(filters.maxPrice)}</span>
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Availability
        </h3>
        <label className="mt-4 flex cursor-pointer items-center gap-3 font-sans text-[14px] text-ink/80">
          <Checkbox
            checked={filters.availability === "available"}
            onCheckedChange={(checked) =>
              onAvailabilityChange(checked ? "available" : "all")
            }
          />
          Available pieces only
        </label>
      </div>

      <button
        onClick={onReset}
        className="font-sans text-[12px] uppercase tracking-widest text-ink/50 underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Reset All Filters
      </button>
    </div>
  );
}

/** Always-visible sidebar on large viewports. */
export function ShopFiltersSidebar(props: FiltersContentProps) {
  return (
    <aside className="hidden w-64 flex-shrink-0 lg:block">
      <div className="sticky top-28">
        <FiltersContent {...props} />
      </div>
    </aside>
  );
}

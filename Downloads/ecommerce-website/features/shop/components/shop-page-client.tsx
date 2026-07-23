"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PRICE_BOUNDS } from "@/lib/products";
import { useShopFilters } from "@/features/shop/use-shop-filters";
import { ShopToolbar, type ShopView } from "@/features/shop/components/shop-toolbar";
import { ShopFiltersSidebar } from "@/features/shop/components/shop-filters-panel";
import { ShopActiveFilters } from "@/features/shop/components/shop-active-filters";
import { ShopResults } from "@/features/shop/components/shop-results";

// Deferred so @radix-ui/react-dialog only loads once a (typically mobile)
// visitor actually taps "Filters" — see shop-filters-mobile-sheet.tsx.
// `ssr: false` is safe here since its content just duplicates the
// always-rendered desktop sidebar, so nothing is lost for crawlers/no-JS.
const ShopFiltersMobileSheet = dynamic(
  () =>
    import("@/features/shop/components/shop-filters-mobile-sheet").then(
      (mod) => mod.ShopFiltersMobileSheet
    ),
  { ssr: false }
);

const VIEW_STORAGE_KEY = "kopal-seth-studio:shop-view";

export function ShopPageClient() {
  const {
    filters,
    searchInput,
    setSearchInput,
    setCategory,
    setSort,
    setPriceRange,
    setAvailability,
    resetFilters,
    results,
    activeFilterCount,
  } = useShopFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<ShopView>("grid");

  // Remember the visitor's grid/list preference across visits.
  useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "grid" || stored === "list") setView(stored);
  }, []);

  const changeView = (next: ShopView) => {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  };

  const filterProps = {
    filters,
    onCategoryChange: setCategory,
    onPriceChange: setPriceRange,
    onAvailabilityChange: setAvailability,
    onReset: resetFilters,
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <ShopFiltersSidebar {...filterProps} />
      <ShopFiltersMobileSheet
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        {...filterProps}
      />

      <div className="min-w-0 flex-1">
        <ShopToolbar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          sort={filters.sort}
          onSortChange={setSort}
          resultCount={results.length}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          view={view}
          onViewChange={changeView}
        />

        <ShopActiveFilters
          filters={filters}
          onClearCategory={() => setCategory("All")}
          onClearSearch={() => setSearchInput("")}
          onClearPrice={() => setPriceRange(PRICE_BOUNDS.min, PRICE_BOUNDS.max)}
          onClearAvailability={() => setAvailability("all")}
          onResetAll={resetFilters}
        />

        <div className="mt-10">
          <ShopResults products={results} onResetFilters={resetFilters} view={view} />
        </div>
      </div>
    </div>
  );
}

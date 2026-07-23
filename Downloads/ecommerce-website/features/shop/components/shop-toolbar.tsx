"use client";

import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import { SORT_OPTIONS, type ProductSort } from "@/lib/products";
import { cn } from "@/utils";

export type ShopView = "grid" | "list";

export function ShopToolbar({
  searchInput,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
  activeFilterCount,
  onOpenFilters,
  view,
  onViewChange,
}: {
  searchInput: string;
  onSearchChange: (value: string) => void;
  sort: ProductSort;
  onSortChange: (value: ProductSort) => void;
  resultCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
  view: ShopView;
  onViewChange: (view: ShopView) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenFilters}
          className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-ink transition-colors hover:border-ink lg:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[10px] text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        <p className="font-sans text-[13px] text-ink/60">
          {resultCount} {resultCount === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 sm:w-64">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40"
            strokeWidth={1.5}
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search pieces…"
            aria-label="Search the shop"
            className={cn(
              "w-full rounded-full border border-ink/15 bg-transparent py-2.5 pl-9 pr-4",
              "font-sans text-[13px] text-ink placeholder:text-ink/40 focus-visible:border-ink focus-visible:outline-none"
            )}
          />
        </div>

        <label className="sr-only" htmlFor="shop-sort">
          Sort
        </label>
        <select
          id="shop-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as ProductSort)}
          className="rounded-full border border-ink/15 bg-transparent py-2.5 pl-4 pr-8 font-sans text-[12px] uppercase tracking-widest text-ink focus-visible:border-ink focus-visible:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Grid / list view toggle */}
        <div
          role="group"
          aria-label="View mode"
          className="hidden items-center rounded-full border border-ink/15 p-0.5 sm:flex"
        >
          {(
            [
              { id: "grid" as const, Icon: LayoutGrid, label: "Grid view" },
              { id: "list" as const, Icon: List, label: "List view" },
            ]
          ).map(({ id, Icon, label }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={view === id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                view === id ? "bg-ink text-white" : "text-ink/50 hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

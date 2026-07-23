"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PRICE_BOUNDS,
  PRODUCT_CATEGORIES,
  queryProducts,
  type Product,
  type ProductCategory,
  type ProductSort,
} from "@/lib/products";

export interface ShopFiltersState {
  category: ProductCategory | "All";
  search: string;
  sort: ProductSort;
  minPrice: number;
  maxPrice: number;
  availability: "all" | "available";
}

const SORT_VALUES: ProductSort[] = ["featured", "newest", "price-asc", "price-desc"];
const SEARCH_DEBOUNCE_MS = 350;

function readCategory(value: string | null): ProductCategory | "All" {
  const match = PRODUCT_CATEGORIES.find((c) => c.toLowerCase() === value?.toLowerCase());
  return match ?? "All";
}

function readSort(value: string | null): ProductSort {
  return (SORT_VALUES as string[]).includes(value ?? "") ? (value as ProductSort) : "featured";
}

/**
 * Owns every piece of /shop filter state and keeps it mirrored in the URL
 * (?category=&q=&sort=&min=&max=&availability=) so filtered views are
 * shareable and survive a page refresh — a genuine UX/SEO requirement
 * for a shop, not just a nice-to-have. `queryProducts` (lib/products.ts)
 * does the actual filtering/sorting so this hook stays focused on state
 * and URL sync.
 */
export function useShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const filters: ShopFiltersState = useMemo(
    () => ({
      category: readCategory(searchParams.get("category")),
      search: searchParams.get("q") ?? "",
      sort: readSort(searchParams.get("sort")),
      minPrice: Number(searchParams.get("min") ?? PRICE_BOUNDS.min),
      maxPrice: Number(searchParams.get("max") ?? PRICE_BOUNDS.max),
      availability: searchParams.get("availability") === "available" ? "available" : "all",
    }),
    [searchParams]
  );

  const updateParams = useCallback(
    (updates: Record<string, string | number | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Debounce free-text search so we don't rewrite the URL on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateParams({ q: searchInput || null });
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const setCategory = useCallback(
    (category: ProductCategory | "All") =>
      updateParams({ category: category === "All" ? null : category.toLowerCase() }),
    [updateParams]
  );

  const setSort = useCallback(
    (sort: ProductSort) => updateParams({ sort: sort === "featured" ? null : sort }),
    [updateParams]
  );

  const setPriceRange = useCallback(
    (min: number, max: number) =>
      updateParams({
        min: min <= PRICE_BOUNDS.min ? null : min,
        max: max >= PRICE_BOUNDS.max ? null : max,
      }),
    [updateParams]
  );

  const setAvailability = useCallback(
    (availability: "all" | "available") =>
      updateParams({ availability: availability === "all" ? null : availability }),
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const results: Product[] = useMemo(() => queryProducts(filters), [filters]);

  const activeFilterCount = [
    filters.category !== "All",
    filters.search.length > 0,
    filters.minPrice > PRICE_BOUNDS.min,
    filters.maxPrice < PRICE_BOUNDS.max,
    filters.availability !== "all",
  ].filter(Boolean).length;

  return {
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
  };
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SearchX } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import type { Product } from "@/lib/products";
import { QuickViewModal } from "@/features/shop/components/quick-view-modal";
import type { ShopView } from "@/features/shop/components/shop-toolbar";

const PAGE_SIZE = 8;

/**
 * Reveals results a page at a time. The "Load More" button is both the
 * accessible fallback control and the IntersectionObserver target, so
 * scrolling near it auto-loads the next page (infinite scroll) while
 * keyboard/screen-reader users get a real, focusable control instead of
 * relying on scroll position alone — the two "pagination" and "infinite
 * scroll" requirements collapse into one control instead of two
 * competing UIs.
 */
export function ShopResults({
  products,
  onResetFilters,
  view = "grid",
}: {
  products: Product[];
  onResetFilters: () => void;
  view?: ShopView;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const loadMoreRef = useRef<HTMLButtonElement>(null);

  // Collapse back to page one whenever the filtered set changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [products]);

  const hasMore = visibleCount < products.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length));
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, products.length]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-ink/15 bg-sand-50 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink/40 shadow-card">
          <SearchX className="h-6 w-6" strokeWidth={1.25} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-serif text-xl text-ink">No pieces match those filters</h2>
          <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/60">
            Try widening your price range or clearing a filter to see more of
            the collection.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onResetFilters}>
          Reset Filters
        </Button>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div>
      <div
        className={cn(
          view === "list"
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index % PAGE_SIZE}
            layout={view}
            onQuickView={setQuickView}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-16 flex justify-center">
          <Button
            ref={loadMoreRef}
            variant="outline"
            size="lg"
            onClick={() =>
              setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length))
            }
          >
            Load More ({products.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      <QuickViewModal
        product={quickView}
        onOpenChange={(open) => {
          if (!open) setQuickView(null);
        }}
      />
    </div>
  );
}

"use client";

/**
 * NOTE: not currently rendered by any route. The main /shop page was
 * upgraded in Phase 3 to `features/shop/*` (search, sort, price range,
 * availability, URL-synced filters, infinite scroll). This simpler
 * "category pills + grid" component is kept because it's a
 * self-contained, dependency-light pattern that's still useful for a
 * lighter embedded context later (e.g. a single-category landing block
 * or a "related pieces" rail) — but if nothing ends up using it by the
 * end of the build, delete it rather than let it rot.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import {
  getProductsByCategory,
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/lib/products";

const CATEGORIES: Array<ProductCategory | "All"> = ["All", ...PRODUCT_CATEGORIES];

export default function ProductGrid({
  initialCategory = "All",
}: {
  initialCategory?: ProductCategory | "All";
}) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>(
    CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );

  const filtered = useMemo(() => getProductsByCategory(active), [active]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center gap-2 sm:mb-14">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            aria-pressed={active === category}
            className={`rounded-full px-4 py-2 font-sans text-[12px] uppercase tracking-widest transition-colors duration-300 ${
              active === category
                ? "bg-ink text-white"
                : "bg-sand-100 text-ink/60 hover:bg-clay-100 hover:text-ink"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-24 text-center font-sans text-ink/50">
          No pieces in this collection yet — check back soon.
        </p>
      )}
    </div>
  );
}

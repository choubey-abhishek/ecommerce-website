"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { Container } from "@/components/ui/container";
import { EASE_STUDIO } from "@/animations/variants";
import type { Product } from "@/lib/products";

/**
 * Generic "row of products" section used by both the Featured Collection
 * and Best Sellers home page blocks. The two sections are visually
 * identical (kicker, heading, view-all link, 4-up grid) and differ only
 * in copy and which products they receive — so the grid/animation logic
 * lives here once instead of being duplicated per section.
 */
export function ProductRail({
  kicker,
  title,
  viewAllHref,
  viewAllLabel = "View All →",
  products,
  tone = "paper",
  cardBadge,
}: {
  kicker: string;
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  products: Product[];
  tone?: "paper" | "sand";
  /** Optional corner label applied to every card in the rail. */
  cardBadge?: string;
}) {
  return (
    <section className={tone === "sand" ? "bg-sand-50" : "bg-paper"}>
      <Container className="py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_STUDIO }}
          className="mb-14 flex flex-col items-start justify-between gap-4 sm:mb-20 sm:flex-row sm:items-end"
        >
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
              {kicker}
            </p>
            <h2 className="mt-3 font-serif text-display-md font-light text-ink">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="font-sans text-[13px] uppercase tracking-widest text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            {viewAllLabel}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              badge={cardBadge}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, Heart, Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency, cn } from "@/utils";
import { EASE_STUDIO, fadeUp } from "@/animations/variants";

export default function ProductCard({
  product,
  index,
  badge,
  layout = "grid",
  onQuickView,
}: {
  product: Product;
  index: number;
  /** Optional corner label, e.g. "Trending" — differentiates rails. */
  badge?: string;
  /** "grid" (default) or "list" for the shop list view. */
  layout?: "grid" | "list";
  /** When provided, the quick-view control opens this instead of navigating. */
  onQuickView?: (product: Product) => void;
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();
  const href = `/shop/${product.slug}`;
  const wishlisted = isWishlisted(product.id);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  const wishlistButton = (
    <button
      type="button"
      onClick={() => toggleWishlist(product.id)}
      aria-pressed={wishlisted}
      aria-label={
        wishlisted
          ? `Remove ${product.title} from wishlist`
          : `Save ${product.title} to wishlist`
      }
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur-sm transition-transform duration-300 hover:scale-110"
    >
      <Heart
        className={cn("h-4 w-4", wishlisted && "fill-terracotta-500 text-terracotta-500")}
        strokeWidth={1.5}
      />
    </button>
  );

  const addButton = (extra?: string) => (
    <button
      type="button"
      onClick={handleAdd}
      aria-label={`Add ${product.title} to cart`}
      className={cn(
        "flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-sans text-[11px] uppercase tracking-widest backdrop-blur-sm transition-colors duration-300",
        added ? "bg-clay-500 text-white" : "bg-ink text-white hover:bg-charcoal",
        extra
      )}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" strokeWidth={2} /> Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" strokeWidth={1.5} /> Add to Cart
        </>
      )}
    </button>
  );

  const quickViewControl = onQuickView ? (
    <button
      type="button"
      onClick={() => onQuickView(product)}
      aria-label={`Quick view ${product.title}`}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-transform duration-300 hover:scale-110"
    >
      <Eye className="h-4 w-4" strokeWidth={1.5} />
    </button>
  ) : (
    <Link
      href={href}
      aria-label={`Quick view ${product.title}`}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-transform duration-300 hover:scale-110"
    >
      <Eye className="h-4 w-4" strokeWidth={1.5} />
    </Link>
  );

  // ---- List layout (shop list view) ----
  if (layout === "list") {
    return (
      <motion.div
        custom={index}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="group flex gap-5 rounded-3xl border border-ink/5 bg-paper p-4 transition-shadow duration-500 hover:shadow-card sm:gap-6 sm:p-5"
      >
        <Link
          href={href}
          aria-label={`View details for ${product.title}`}
          className="relative aspect-[4/5] w-28 flex-none overflow-hidden rounded-2xl bg-sand-100 sm:w-40"
        >
          <Image
            src={product.image}
            alt={`${product.title}, ${product.dimensions}`}
            fill
            sizes="(min-width: 640px) 160px, 112px"
            className={cn(
              "object-cover transition-transform duration-700 ease-studio group-hover:scale-105",
              product.sold && "grayscale"
            )}
          />
          {product.sold && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 font-sans text-[9px] uppercase tracking-widest text-ink/70 backdrop-blur-sm">
              Sold
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-serif text-[19px] text-ink">
                <Link href={href} className="transition-colors hover:text-ink/70">
                  {product.title}
                </Link>
              </h3>
              <p className="mt-1 font-sans text-[13px] text-ink/60">{product.dimensions}</p>
            </div>
            <p className="whitespace-nowrap font-sans text-[16px] text-ink">
              {formatCurrency(product.price, product.currency)}
            </p>
          </div>

          <p className="mt-2 line-clamp-2 max-w-prose font-sans text-[13px] leading-relaxed text-ink/60">
            {product.description}
          </p>

          <div className="mt-auto flex items-center gap-2 pt-4">
            {product.sold ? (
              <Link
                href={href}
                className="rounded-full bg-ink px-4 py-2.5 font-sans text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-charcoal"
              >
                View Details
              </Link>
            ) : (
              addButton()
            )}
            {quickViewControl}
            {wishlistButton}
          </div>
        </div>
      </motion.div>
    );
  }

  // ---- Grid layout (default) ----
  const revealClasses =
    "translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-500 sm:ease-studio " +
    "sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100";

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 shadow-card transition-shadow duration-500 group-hover:shadow-soft">
        <Link href={href} aria-label={`View details for ${product.title}`}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: EASE_STUDIO }}
            className="relative h-full w-full"
          >
            <Image
              src={product.image}
              alt={`${product.title}, ${product.dimensions}`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className={cn("object-cover", product.sold && "grayscale")}
            />
          </motion.div>
        </Link>

        {product.sold ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-ink/70 backdrop-blur-sm">
            Sold
          </span>
        ) : (
          badge && (
            <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
              {badge}
            </span>
          )
        )}

        <div className="absolute right-3 top-3">{wishlistButton}</div>

        <div className={cn("absolute inset-x-0 bottom-0 flex items-center gap-2 p-3", revealClasses)}>
          {product.sold ? (
            <Link
              href={href}
              className="flex-1 rounded-full bg-white/90 px-4 py-2.5 text-center font-sans text-[11px] uppercase tracking-widest text-ink backdrop-blur-sm"
            >
              View Details
            </Link>
          ) : (
            <>
              {addButton("flex-1")}
              {quickViewControl}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-[17px] text-ink">
            <Link href={href} className="transition-colors hover:text-ink/70">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 font-sans text-[13px] text-ink/60">{product.dimensions}</p>
        </div>
        <p className="whitespace-nowrap font-sans text-[15px] text-ink/80">
          {formatCurrency(product.price, product.currency)}
        </p>
      </div>
    </motion.div>
  );
}

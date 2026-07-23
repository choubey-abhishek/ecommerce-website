"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Heart, Plus, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency, cn } from "@/utils";
import { EASE_STUDIO } from "@/animations/variants";

/**
 * Lightweight quick-view for the shop grid/list. Reuses the real cart and
 * wishlist contexts so it behaves identically to the product page — no
 * duplicated business logic, just a faster path to add or save a piece
 * without a full navigation. Built on Radix Dialog for focus trap,
 * Escape, and scroll-lock.
 */
export function QuickViewModal({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(addedTimer.current), []);
  // Reset the transient "Added" state whenever a different piece opens.
  useEffect(() => setAdded(false), [product?.id]);

  const open = product !== null;
  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && product && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[2px]"
              />
            </Dialog.Overlay>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE_STUDIO }}
                className="fixed left-1/2 top-1/2 z-[85] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-paper shadow-lift focus:outline-none"
              >
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="relative aspect-square bg-sand-100 sm:aspect-auto">
                    <Image
                      src={product.image}
                      alt={`${product.title}, ${product.dimensions}`}
                      fill
                      sizes="(min-width: 640px) 384px, 100vw"
                      className={cn("object-cover", product.sold && "grayscale")}
                    />
                    {product.sold && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-ink/70 backdrop-blur-sm">
                        Sold
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col p-6 sm:p-8">
                    <p className="font-sans text-[11px] uppercase tracking-widest text-ink/50">
                      {product.category}
                    </p>
                    <Dialog.Title className="mt-2 font-serif text-2xl font-light text-ink">
                      {product.title}
                    </Dialog.Title>
                    <p className="mt-1 font-sans text-[13px] text-ink/60">
                      {product.dimensions}
                    </p>
                    <p className="mt-4 font-serif text-xl text-ink">
                      {formatCurrency(product.price, product.currency)}
                    </p>
                    <p className="mt-4 font-sans text-[14px] leading-relaxed text-ink/70">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-8">
                      <div className="flex items-center gap-2">
                        {product.sold ? (
                          <span className="flex-1 rounded-full bg-sand-100 px-5 py-3 text-center font-sans text-[12px] uppercase tracking-widest text-ink/60">
                            Sold
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleAdd}
                            aria-label={`Add ${product.title} to cart`}
                            className={cn(
                              "flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 font-sans text-[12px] uppercase tracking-widest transition-colors duration-300",
                              added ? "bg-clay-500 text-white" : "bg-ink text-white hover:bg-charcoal"
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
                        )}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-pressed={wishlisted}
                          aria-label={
                            wishlisted
                              ? `Remove ${product.title} from wishlist`
                              : `Save ${product.title} to wishlist`
                          }
                          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink"
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4",
                              wishlisted && "fill-terracotta-500 text-terracotta-500"
                            )}
                            strokeWidth={1.5}
                          />
                        </button>
                      </div>

                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="link-underline mt-5 inline-flex items-center gap-1.5 font-sans text-[12px] uppercase tracking-widest text-ink/70 hover:text-ink"
                      >
                        View Full Details
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>

                <Dialog.Close asChild>
                  <button
                    aria-label="Close quick view"
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

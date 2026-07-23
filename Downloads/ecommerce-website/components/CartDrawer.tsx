"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils";
import { EASE_STUDIO } from "@/animations/variants";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    appliedCoupon,
    discount,
    shippingEstimate,
    total,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-sm"
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: EASE_STUDIO }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-soft"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-6">
              <h2 className="font-sans text-sm uppercase tracking-widest text-ink">
                Your Bag ({itemCount})
              </h2>
              <button
                aria-label="Close cart"
                onClick={closeCart}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sand-100"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="font-sans text-ink/50">Your bag is empty.</p>
                  <button
                    onClick={closeCart}
                    className="mt-6 rounded-full bg-ink px-6 py-3 font-sans text-[12px] uppercase tracking-widest text-white"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map(({ product, quantity }) => (
                    <motion.li
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.4, ease: EASE_STUDIO }}
                      className="flex gap-4"
                    >
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sand-100">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-sans text-[14px] text-ink">
                              {product.title}
                            </p>
                            <p className="mt-0.5 font-sans text-[12px] text-ink/50">
                              {product.dimensions}
                            </p>
                          </div>
                          <button
                            aria-label={`Remove ${product.title}`}
                            onClick={() => removeItem(product.id)}
                            className="text-ink/40 transition-colors hover:text-ink"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full bg-sand-50 px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(product.id, quantity - 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-sand-200"
                            >
                              <Minus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                            <span className="w-4 text-center font-sans text-[12px]">
                              {quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(product.id, quantity + 1)
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-sand-200"
                            >
                              <Plus className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="font-sans text-[13px] text-ink/80">
                            {formatCurrency(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-6">
                <div className="mb-4 space-y-2 font-sans text-[13px]">
                  <div className="flex items-center justify-between text-ink/70">
                    <span className="uppercase tracking-widest text-[11px] text-ink/50">
                      Subtotal
                    </span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-clay-500">
                      <span className="uppercase tracking-widest text-[11px]">
                        {appliedCoupon.code}
                      </span>
                      <span>−{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-ink/70">
                    <span className="uppercase tracking-widest text-[11px] text-ink/50">
                      Shipping
                    </span>
                    <span>{shippingEstimate === 0 ? "Free" : formatCurrency(shippingEstimate)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 font-sans text-sm text-ink">
                    <span className="uppercase tracking-widest text-[12px] text-ink/60">
                      Total
                    </span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full rounded-full bg-ink py-4 text-center font-sans text-[12px] uppercase tracking-widest text-white transition-colors duration-300 hover:bg-charcoal"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-3 block text-center font-sans text-[12px] uppercase tracking-widest text-ink/50 underline-offset-4 hover:text-ink hover:underline"
                >
                  View Full Bag
                </Link>
                <p className="mt-3 text-center font-sans text-[11px] text-ink/40">
                  Taxes calculated at checkout.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

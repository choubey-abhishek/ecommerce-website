"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils";
import { EASE_STUDIO } from "@/animations/variants";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/features/cart/components/order-summary";

export function CartPageView() {
  const { items, removeItem, updateQuantity, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-8 w-8 text-ink/30" strokeWidth={1.25} />
        <div>
          <h2 className="font-serif text-xl text-ink">Your Bag Is Empty</h2>
          <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/55">
            Browse the collection and add a piece you love.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/shop">Browse the Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
      <div>
        <p className="mb-6 font-sans text-[13px] text-ink/50">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
        <ul className="divide-y divide-ink/10">
          <AnimatePresence initial={false}>
            {items.map(({ product, quantity }) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: EASE_STUDIO }}
                className="flex gap-5 py-6 first:pt-0"
              >
                <div className="relative h-32 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-sand-100">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg text-ink">{product.title}</h3>
                      <p className="mt-1 font-sans text-[13px] text-ink/50">
                        {product.dimensions}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-sans text-[15px] text-ink/80">
                      {formatCurrency(product.price * quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full bg-sand-50 px-2 py-1.5">
                      <button
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-sand-200"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="w-5 text-center font-sans text-[13px]">
                        {quantity}
                      </span>
                      <button
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-sand-200"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remove ${product.title}`}
                      className="flex items-center gap-1.5 font-sans text-[12px] uppercase tracking-widest text-ink/40 transition-colors hover:text-ink"
                    >
                      <X className="h-3 w-3" strokeWidth={1.5} />
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div>
        <OrderSummary />
      </div>
    </div>
  );
}

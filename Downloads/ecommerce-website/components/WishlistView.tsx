"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

/**
 * Reads straight from `WishlistContext` (localStorage-backed — see the
 * context file for why it's device-local rather than account-synced for
 * now). Deliberately not gated behind sign-in: a wishlist that only
 * worked while logged in would lose every guest's picks the moment
 * accounts shipped, so it stays independent until there's a real sync
 * story between the two.
 */
export default function WishlistView() {
  const { productIds } = useWishlist();
  const items = products.filter((p) => productIds.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink/15 py-20 text-center">
        <Heart className="h-8 w-8 text-ink/30" strokeWidth={1.25} />
        <div>
          <h2 className="font-serif text-xl text-ink">Your Wishlist Is Empty</h2>
          <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/55">
            Tap the heart icon on any piece to save it here for later.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/shop">Browse the Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}

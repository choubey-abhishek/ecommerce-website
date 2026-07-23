"use client";

import { Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency, cn } from "@/utils";
import type { Product } from "@/lib/products";
import { SocialShare } from "@/features/product/components/social-share";
import { siteConfig } from "@/config/site";

export function ProductInfo({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = () => {
    // No checkout flow yet (Phase 7) — for now this adds to cart and
    // opens the drawer, which is the closest real equivalent. Once
    // Stripe Checkout exists, this should redirect straight there.
    addItem(product);
    openCart();
  };

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
        {product.category}
      </p>
      <h1 className="mt-3 font-serif text-display-md font-light text-ink">
        {product.title}
      </h1>
      <p className="mt-4 font-sans text-2xl text-ink/80">
        {formatCurrency(product.price, product.currency)}
      </p>

      <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
        {product.description}
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-y-4 border-y border-ink/10 py-6 font-sans text-[13px] sm:grid-cols-4">
        <div>
          <dt className="uppercase tracking-widest text-ink/40">Dimensions</dt>
          <dd className="mt-1 text-ink/75">{product.dimensions}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-widest text-ink/40">Material</dt>
          <dd className="mt-1 text-ink/75">{product.material}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-widest text-ink/40">Weight</dt>
          <dd className="mt-1 text-ink/75">{product.weight}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-widest text-ink/40">Availability</dt>
          <dd className={cn("mt-1", product.sold ? "text-terracotta-500" : "text-ink/75")}>
            {product.sold ? "Sold" : "In Stock"}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={product.sold}
          onClick={() => addItem(product)}
        >
          {product.sold ? "Sold Out" : "Add to Cart"}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={product.sold}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center self-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink sm:self-auto"
        >
          <Heart
            className={cn("h-5 w-5", wishlisted && "fill-ink")}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="mt-6">
        <SocialShare
          title={product.title}
          url={`${siteConfig.url}/shop/${product.slug}`}
        />
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-sand-50 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-clay-500" strokeWidth={1.5} />
        <p className="font-sans text-[13px] leading-relaxed text-ink/60">
          Ships with a signed Certificate of Authenticity confirming this is
          an original, one-of-a-kind piece by Kopal Seth.
        </p>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        <AccordionItem value="story">
          <AccordionTrigger>The Story</AccordionTrigger>
          <AccordionContent>{product.story}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="shipping">
          <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
          <AccordionContent>
            Ships within 3–7 business days, individually packed and
            insured. International orders may incur customs duties on
            arrival. See the full{" "}
            <a href="/shipping-policy" className="underline underline-offset-4">
              Shipping Policy
            </a>{" "}
            and{" "}
            <a href="/return-policy" className="underline underline-offset-4">
              Return Policy
            </a>{" "}
            for details.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="care">
          <AccordionTrigger>Care Instructions</AccordionTrigger>
          <AccordionContent>
            Hand wash with a soft cloth. Avoid sudden temperature changes
            and prolonged direct sunlight, which can affect glaze tone over
            time. Food-safe tableware pieces are dishwasher-safe unless
            noted otherwise above.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { createCheckoutSession } from "@/services/checkout";

/**
 * Two real ways to buy, not one fake one:
 *  - When Stripe is configured, "Pay with Card" creates a real hosted
 *    Checkout Session and redirects there.
 *  - Either way, "Email This Order" sends a prefilled order straight to
 *    the studio — useful as a fallback, for buyers who prefer it, or
 *    for wire-transfer/international orders card checkout doesn't suit.
 * `stripeEnabled` is computed server-side (`isStripeConfigured` reads a
 * server-only env var) and passed down, since a client component can't
 * safely check for a secret key's presence itself.
 */
export function CheckoutView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    appliedCoupon,
    shippingEstimate,
    shippingRegion,
    total,
  } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <ShoppingBag className="h-8 w-8 text-ink/30" strokeWidth={1.25} />
        <div>
          <h1 className="font-serif text-2xl text-ink">Your Bag Is Empty</h1>
          <p className="mx-auto mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink/55">
            Add a piece to your bag before heading to checkout.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/shop">Browse the Shop</Link>
        </Button>
      </div>
    );
  }

  const handleStripeCheckout = () => {
    setError(null);
    startTransition(async () => {
      // Send only what a client is trusted to choose — the product and
      // the quantity. Prices, discount, and shipping are re-derived
      // server-side (services/pricing.ts); anything sent here would be
      // ignored anyway.
      const result = await createCheckoutSession({
        items: items.map(({ product, quantity }) => ({
          slug: product.slug,
          quantity,
        })),
        couponCode: appliedCoupon?.code,
        region: shippingRegion,
      });

      if (result.url) {
        window.location.href = result.url;
      } else {
        setError(result.error ?? "Couldn't start checkout — please try again.");
      }
    });
  };

  const orderLines = items
    .map(
      (item) =>
        `${item.quantity} × ${item.product.title} (${formatCurrency(item.product.price)} each)`
    )
    .join("\n");

  const subject = encodeURIComponent(
    `Order inquiry — ${itemCount} piece${itemCount === 1 ? "" : "s"}`
  );
  const body = encodeURIComponent(
    `Hi Kopal,\n\nI'd like to purchase the following:\n\n${orderLines}\n\nEstimated total: ${formatCurrency(total)} (before final shipping/taxes)\n\nShipping address:\n[Your name and address]\n\nThanks!`
  );

  return (
    <div className="text-center">
      <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
        Checkout
      </p>
      <h1 className="mt-3 font-serif text-display-md font-light text-ink">
        {stripeEnabled ? "Complete Your Order" : "Online Checkout Is Coming Soon"}
      </h1>
      <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-ink/60">
        {stripeEnabled
          ? "You'll be taken to Stripe's secure checkout to enter payment and shipping details."
          : "Secure card checkout isn't live on the site yet. In the meantime, send your order directly to the studio and you'll get a reply with payment and shipping details."}
      </p>

      <div className="mx-auto mt-10 max-w-sm rounded-2xl bg-sand-50 p-6 text-left">
        <h2 className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Your Bag
        </h2>
        <ul className="mt-4 space-y-2 font-sans text-[14px] text-ink/75">
          {items.map((item) => (
            <li key={item.product.id} className="flex justify-between gap-3">
              <span>
                {item.quantity} × {item.product.title}
              </span>
              <span className="whitespace-nowrap">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 font-sans text-[13px] text-ink/60">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-clay-500">
              <span>Discount ({appliedCoupon.code})</span>
              <span>−{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingEstimate === 0 ? "Free" : formatCurrency(shippingEstimate)}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-sans text-[15px] text-ink">
          <span>Estimated Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {error && (
        <p className="mx-auto mt-6 max-w-sm font-sans text-[13px] text-terracotta-500">
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {stripeEnabled && (
          <Button size="lg" onClick={handleStripeCheckout} disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <CreditCard className="h-4 w-4" strokeWidth={1.5} />
            )}
            {isPending ? "Redirecting…" : "Pay with Card"}
          </Button>
        )}
        <Button asChild size="lg" variant={stripeEnabled ? "outline" : "primary"}>
          <a href={`mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`}>
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Email This Order to the Studio
          </a>
        </Button>
      </div>
      <Link
        href="/cart"
        className="mt-6 inline-block font-sans text-[12px] uppercase tracking-widest text-ink/40 underline-offset-4 hover:text-ink hover:underline"
      >
        Back to Bag
      </Link>
    </div>
  );
}

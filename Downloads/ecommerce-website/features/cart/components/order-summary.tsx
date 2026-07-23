"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils";
import { CouponForm } from "@/features/cart/components/coupon-form";

export function OrderSummary() {
  const {
    subtotal,
    appliedCoupon,
    discount,
    shippingRegion,
    setShippingRegion,
    shippingEstimate,
    total,
  } = useCart();

  return (
    <div className="rounded-2xl bg-sand-50 p-6 sm:p-8">
      <h2 className="font-serif text-lg text-ink">Order Summary</h2>

      <div className="mt-6">
        <CouponForm />
      </div>

      <div className="mt-6">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/50">
          Shipping To
        </p>
        <div className="mt-3 flex gap-2">
          {(["domestic", "international"] as const).map((region) => (
            <button
              key={region}
              onClick={() => setShippingRegion(region)}
              aria-pressed={shippingRegion === region}
              className={`flex-1 rounded-full px-4 py-2 font-sans text-[12px] capitalize transition-colors ${
                shippingRegion === region
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 hover:text-ink"
              }`}
            >
              {region === "domestic" ? "India" : "International"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-ink/10 pt-6 font-sans text-[14px]">
        <div className="flex items-center justify-between text-ink/70">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex items-center justify-between text-clay-500">
            <span>Discount ({appliedCoupon.code})</span>
            <span>−{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-ink/70">
          <span>Shipping</span>
          <span>{shippingEstimate === 0 ? "Free" : formatCurrency(shippingEstimate)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-ink/10 pt-3 text-base text-ink">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <p className="font-sans text-[12px] text-ink/40">
          Taxes calculated at checkout.
        </p>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-full bg-ink py-4 text-center font-sans text-[12px] uppercase tracking-widest text-white transition-colors duration-300 hover:bg-charcoal"
      >
        Proceed to Checkout
      </Link>
      <Link
        href="/shop"
        className="mt-3 block text-center font-sans text-[12px] uppercase tracking-widest text-ink/50 underline-offset-4 hover:text-ink hover:underline"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CouponForm() {
  const { appliedCoupon, couponError, applyCouponCode, removeCoupon } = useCart();
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    applyCouponCode(input);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-full bg-sage-100 px-4 py-2.5 font-sans text-[13px] text-ink">
        <span className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
          {appliedCoupon.code} applied
        </span>
        <button
          onClick={removeCoupon}
          aria-label="Remove coupon"
          className="text-ink/50 transition-colors hover:text-ink"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <label htmlFor="coupon-code" className="sr-only">
          Discount code
        </label>
        <input
          id="coupon-code"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Discount code"
          className="flex-1 rounded-full border border-ink/15 bg-transparent px-4 py-2.5 font-sans text-[13px] text-ink placeholder:text-ink/40 focus-visible:border-ink focus-visible:outline-none"
        />
        <button
          type="submit"
          className="rounded-full border border-ink/15 px-4 py-2.5 font-sans text-[12px] uppercase tracking-widest text-ink transition-colors hover:border-ink"
        >
          Apply
        </button>
      </div>
      {couponError && (
        <p className="mt-2 font-sans text-[12px] text-terracotta-500">{couponError}</p>
      )}
    </form>
  );
}

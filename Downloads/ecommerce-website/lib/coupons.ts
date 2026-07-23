/**
 * A small, hard-coded coupon table. This genuinely validates and applies
 * a discount client-side — it's not a fake input — but it's not backed
 * by a real promo-code system (usage limits, expiry enforcement,
 * per-customer restrictions). That belongs in the database layer once
 * Phase 6+/9 introduces one; swapping this out is a one-file change
 * since every caller goes through `applyCoupon()`.
 */
export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, description: "10% off your first order" },
  { code: "STUDIO25", type: "fixed", value: 25, description: "$25 off orders over $150" },
];

export interface CouponResult {
  valid: boolean;
  coupon?: Coupon;
  discount: number;
  message: string;
}

export function applyCoupon(code: string, subtotal: number): CouponResult {
  const normalized = code.trim().toUpperCase();
  const coupon = COUPONS.find((c) => c.code === normalized);

  if (!coupon) {
    return { valid: false, discount: 0, message: "That code isn't valid." };
  }

  if (coupon.code === "STUDIO25" && subtotal < 150) {
    return {
      valid: false,
      discount: 0,
      message: "STUDIO25 requires a subtotal of at least $150.",
    };
  }

  const discount =
    coupon.type === "percent" ? Math.round(subtotal * (coupon.value / 100)) : coupon.value;

  return {
    valid: true,
    coupon,
    discount: Math.min(discount, subtotal),
    message: coupon.description,
  };
}

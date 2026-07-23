import { describe, expect, it } from "vitest";
import { applyCoupon } from "@/lib/coupons";

describe("applyCoupon()", () => {
  it("rejects an unknown code", () => {
    const result = applyCoupon("NOTREAL", 200);
    expect(result.valid).toBe(false);
    expect(result.discount).toBe(0);
  });

  it("applies a percentage discount", () => {
    const result = applyCoupon("WELCOME10", 200);
    expect(result.valid).toBe(true);
    expect(result.discount).toBe(20); // 10% of 200
  });

  it("is case-insensitive and trims whitespace", () => {
    const result = applyCoupon("  welcome10  ", 200);
    expect(result.valid).toBe(true);
    expect(result.coupon?.code).toBe("WELCOME10");
  });

  it("applies a fixed discount when the subtotal meets the threshold", () => {
    const result = applyCoupon("STUDIO25", 150);
    expect(result.valid).toBe(true);
    expect(result.discount).toBe(25);
  });

  it("rejects the fixed-discount code below its subtotal threshold", () => {
    const result = applyCoupon("STUDIO25", 100);
    expect(result.valid).toBe(false);
    expect(result.discount).toBe(0);
  });

  it("never discounts more than the subtotal itself", () => {
    const result = applyCoupon("STUDIO25", 160);
    expect(result.discount).toBeLessThanOrEqual(160);
  });
});

import { describe, expect, it } from "vitest";
import { SHIPPING, getShippingEstimate } from "@/lib/shipping";

describe("getShippingEstimate()", () => {
  it("returns 0 for an empty or negative subtotal", () => {
    expect(getShippingEstimate(0)).toBe(0);
    expect(getShippingEstimate(-10)).toBe(0);
  });

  it("charges the domestic rate below the free-shipping threshold", () => {
    expect(getShippingEstimate(100, "domestic")).toBe(SHIPPING.domesticRate);
  });

  it("charges the international rate below the free-shipping threshold", () => {
    expect(getShippingEstimate(100, "international")).toBe(SHIPPING.internationalRate);
  });

  it("is free at or above the threshold, regardless of region", () => {
    expect(getShippingEstimate(SHIPPING.freeThreshold, "domestic")).toBe(0);
    expect(getShippingEstimate(SHIPPING.freeThreshold + 50, "international")).toBe(0);
  });

  it("defaults to the domestic region when none is given", () => {
    expect(getShippingEstimate(50)).toBe(SHIPPING.domesticRate);
  });
});

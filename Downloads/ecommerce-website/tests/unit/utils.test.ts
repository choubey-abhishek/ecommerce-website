import { describe, expect, it } from "vitest";
import { cn, formatCurrency, slugify, truncate } from "@/utils";

describe("cn()", () => {
  it("joins simple class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting Tailwind utilities in favor of the later one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
});

describe("formatCurrency()", () => {
  it("formats a whole-number USD amount with no decimals", () => {
    expect(formatCurrency(480)).toBe("$480");
  });

  it("respects a different currency code", () => {
    expect(formatCurrency(100, "EUR")).toBe("€100");
  });

  it("allows overriding Intl.NumberFormat options", () => {
    expect(formatCurrency(19.99, "USD", { maximumFractionDigits: 2 })).toBe("$19.99");
  });
});

describe("truncate()", () => {
  it("returns the original string when shorter than the limit", () => {
    expect(truncate("Amber Horizon", 50)).toBe("Amber Horizon");
  });

  it("trims to a word boundary and appends an ellipsis when too long", () => {
    const result = truncate("A hand-built stoneware vessel finished in amber glaze", 20);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBeLessThanOrEqual(21);
    expect(result).not.toMatch(/\s…$/); // no trailing space before the ellipsis
  });
});

describe("slugify()", () => {
  it("lowercases and hyphenates a title", () => {
    expect(slugify("Amber Horizon Vessel")).toBe("amber-horizon-vessel");
  });

  it("strips punctuation", () => {
    expect(slugify("Kopal's Studio: Notes No. 3")).toBe("kopals-studio-notes-no-3");
  });

  it("collapses repeated separators and trims leading/trailing hyphens", () => {
    expect(slugify("  --Sage   Bloom--  ")).toBe("sage-bloom");
  });
});

import { describe, expect, it } from "vitest";
import {
  PRICE_BOUNDS,
  getBestSellers,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
  getRecommendedProducts,
  products,
  queryProducts,
} from "@/lib/products";

describe("queryProducts()", () => {
  it("returns every product with no query", () => {
    expect(queryProducts()).toHaveLength(products.length);
  });

  it("filters by category", () => {
    const result = queryProducts({ category: "Vases" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "Vases")).toBe(true);
  });

  it("is a no-op filter when category is 'All'", () => {
    expect(queryProducts({ category: "All" })).toHaveLength(products.length);
  });

  it("matches search against title, description, and category (case-insensitive)", () => {
    const byTitle = queryProducts({ search: "amber horizon" });
    expect(byTitle.map((p) => p.slug)).toContain("amber-horizon-vessel");

    const byCategory = queryProducts({ search: "TABLEWARE" });
    expect(byCategory.every((p) => p.category === "Tableware")).toBe(true);
  });

  it("returns an empty array for a search term matching nothing", () => {
    expect(queryProducts({ search: "nonexistent-piece-xyz" })).toHaveLength(0);
  });

  it("filters by price range inclusively", () => {
    const result = queryProducts({ minPrice: 300, maxPrice: 500 });
    expect(result.every((p) => p.price >= 300 && p.price <= 500)).toBe(true);
  });

  it("excludes sold pieces when availability is 'available'", () => {
    const result = queryProducts({ availability: "available" });
    expect(result.some((p) => p.sold)).toBe(false);
  });

  it("includes sold pieces by default", () => {
    const result = queryProducts();
    expect(result.some((p) => p.sold)).toBe(true);
  });

  it("sorts by price ascending", () => {
    const result = queryProducts({ sort: "price-asc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price);
    }
  });

  it("sorts by price descending", () => {
    const result = queryProducts({ sort: "price-desc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price);
    }
  });

  it("sorts by newest first", () => {
    const result = queryProducts({ sort: "newest" });
    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i].createdAt).getTime()).toBeLessThanOrEqual(
        new Date(result[i - 1].createdAt).getTime()
      );
    }
  });

  it("combines category, search, price, and availability filters together", () => {
    const result = queryProducts({
      category: "Vases",
      minPrice: 0,
      maxPrice: 1000,
      availability: "available",
    });
    expect(result.every((p) => p.category === "Vases" && !p.sold)).toBe(true);
  });
});

describe("getProductsByCategory()", () => {
  it("returns all products for 'All' or undefined", () => {
    expect(getProductsByCategory()).toHaveLength(products.length);
    expect(getProductsByCategory("All")).toHaveLength(products.length);
  });

  it("filters to a single category", () => {
    const result = getProductsByCategory("Sculptural");
    expect(result.every((p) => p.category === "Sculptural")).toBe(true);
  });
});

describe("getProductBySlug()", () => {
  it("finds an existing product", () => {
    expect(getProductBySlug("amber-horizon-vessel")?.title).toBe("Amber Horizon Vessel");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("getFeaturedProducts() / getBestSellers()", () => {
  it("only returns products flagged featured/bestSeller", () => {
    expect(getFeaturedProducts(10).every((p) => p.featured)).toBe(true);
    expect(getBestSellers(10).every((p) => p.bestSeller)).toBe(true);
  });

  it("respects the limit argument", () => {
    expect(getFeaturedProducts(2)).toHaveLength(2);
  });
});

describe("getRecommendedProducts()", () => {
  it("excludes the product itself", () => {
    const product = products[0];
    const result = getRecommendedProducts(product);
    expect(result.some((p) => p.id === product.id)).toBe(false);
  });

  it("prefers same-category pieces first", () => {
    const product = getProductBySlug("amber-horizon-vessel")!; // Vessels
    const result = getRecommendedProducts(product, 1);
    expect(result[0].category).toBe("Vessels");
  });

  it("tops up with featured/best-seller pieces when the category is thin", () => {
    const product = getProductBySlug("quiet-fold-sculpture")!; // Sculptural, only 1 other Sculptural item
    const result = getRecommendedProducts(product, 4);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.id !== product.id)).toBe(true);
  });
});

describe("PRICE_BOUNDS", () => {
  it("reflects the actual min/max price across the catalog", () => {
    const prices = products.map((p) => p.price);
    expect(PRICE_BOUNDS.min).toBe(Math.min(...prices));
    expect(PRICE_BOUNDS.max).toBe(Math.max(...prices));
  });
});

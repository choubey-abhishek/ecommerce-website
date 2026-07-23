import { test, expect } from "@playwright/test";

test.describe("Cart to checkout", () => {
  test("moves from product to cart drawer to the full checkout page", async ({ page }) => {
    await page.goto("/shop/sage-bloom-vase");
    await page.getByRole("button", { name: "Add to Cart" }).click();

    await expect(page.getByText("Your Bag (1)")).toBeVisible();

    await page.getByRole("link", { name: "Checkout" }).click();
    await expect(page).toHaveURL(/\/checkout$/);

    // Order summary should reflect the item added, regardless of whether
    // Stripe is configured in this environment.
    await expect(page.getByText("Sage Bloom Vase")).toBeVisible();
  });

  test("the dedicated cart page reflects quantity changes", async ({ page }) => {
    await page.goto("/shop/sage-bloom-vase");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await page.getByRole("link", { name: "View Full Bag" }).click();

    await expect(page).toHaveURL(/\/cart$/);
    await page.getByRole("button", { name: "Increase quantity" }).click();
    // 2 x $260 — appears both on the line item and in the order summary total,
    // so match the first occurrence rather than requiring exactly one.
    await expect(page.getByText("$520").first()).toBeVisible();
  });

  test("an empty cart shows a friendly empty state instead of a broken checkout", async ({
    page,
  }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your Bag Is Empty" })).toBeVisible();
  });

  test("an empty checkout page redirects the buyer back to shopping, not a broken order form", async ({
    page,
  }) => {
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: "Your Bag Is Empty" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse the Shop" })).toBeVisible();
  });
});

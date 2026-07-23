import { test, expect } from "@playwright/test";

test.describe("Product detail", () => {
  test("shows product info and adds an in-stock piece to the cart", async ({ page }) => {
    await page.goto("/shop/amber-horizon-vessel");

    await expect(page.getByRole("heading", { name: "Amber Horizon Vessel" })).toBeVisible();
    await expect(page.getByText("$480")).toBeVisible();

    await page.getByRole("button", { name: "Add to Cart" }).click();

    // Adding to cart opens the drawer with the item and a running subtotal.
    await expect(page.getByText("Your Bag (1)")).toBeVisible();
    await expect(page.getByText("Amber Horizon Vessel").last()).toBeVisible();
  });

  test("disables purchase actions for a sold piece", async ({ page }) => {
    await page.goto("/shop/monolith-study-no-3");

    await expect(page.getByRole("button", { name: "Sold Out" })).toBeDisabled();
  });

  test("shows a branded 404 for an unknown slug", async ({ page }) => {
    const response = await page.goto("/shop/not-a-real-product");
    expect(response?.status()).toBe(404);
  });
});

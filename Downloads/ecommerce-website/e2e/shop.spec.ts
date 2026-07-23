import { test, expect } from "@playwright/test";

test.describe("Shop", () => {
  test("lists products and supports search filtering", async ({ page }) => {
    await page.goto("/shop");

    await expect(page.getByRole("link", { name: /Amber Horizon Vessel/i })).toBeVisible();

    await page.getByLabel("Search the shop").fill("vase");
    await expect(page.getByRole("link", { name: /Sage Bloom Vase/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Terra Plate Set/i })).toHaveCount(0);
  });

  test("filters by category via a direct link", async ({ page }) => {
    await page.goto("/shop?category=Tableware");
    await expect(page.getByRole("link", { name: /Terra Plate Set/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Quiet Fold/i })).toHaveCount(0);
  });

  test("sorting by price changes the result order", async ({ page }) => {
    await page.goto("/shop");
    await page.getByLabel("Sort").selectOption("price-asc");
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test("navigating to a product from the grid opens its detail page", async ({ page }) => {
    await page.goto("/shop");
    await page.getByRole("link", { name: /Amber Horizon Vessel/i }).first().click();
    await expect(page).toHaveURL(/\/shop\/amber-horizon-vessel/);
    await expect(page.getByRole("heading", { name: "Amber Horizon Vessel" })).toBeVisible();
  });
});

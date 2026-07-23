import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero and navigates to the shop via the primary CTA", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kopal Seth Studio");
    await expect(page.getByText("Contemporary Ceramics & Clay Art")).toBeVisible();

    await page.getByRole("link", { name: /Explore the Collection/i }).click();
    await expect(page).toHaveURL(/\/shop$/);
  });

  test("has no uncaught client-side exceptions on load", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(pageErrors).toEqual([]);
  });

  test("primary nav links are reachable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Shop", exact: true }).first().click();
    await expect(page).toHaveURL(/\/shop$/);
  });
});

import { test, expect } from "@playwright/test";

async function registerAndLoginViaUI(page: import("@playwright/test").Page) {
  const email = `e2e-dash-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  await page.goto("/signup");
  await page.fill("#firstName", "Dash");
  await page.fill("#lastName", "Tester");
  await page.fill("#email", email);
  await page.fill("#password", "Password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/login\?registered=true/);

  await page.fill("#email", email);
  await page.fill("#password", "Password123");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe("Dashboard - Villa data", () => {
  test("loads and displays real popular villas from the backend by default", async ({ page }) => {
    await registerAndLoginViaUI(page);

    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await expect(page.getByText("4 villas")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Methlang Villa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Archid Villa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bella Vista Thecho" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Farmhouse In Dhulikhel" })).toBeVisible();
  });

  test("filters villas by search query", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.fill('input[placeholder="Search villas, locations..."]', "Archid");

    await expect(page.getByRole("heading", { name: "Archid Villa" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Methlang Villa" })).not.toBeVisible();
  });

  test("switching to the New category shows different villas", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.click('button:has-text("New")');

    await expect(page.getByRole("heading", { name: "Villa Karma Pokhara" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Methlang Villa" })).not.toBeVisible();
  });

  test("clicking View on a villa navigates to its detail page", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.getByRole("button", { name: "View" }).first().click();

    await expect(page).toHaveURL(/\/dashboard\/villas\/[a-f0-9]{24}/);
  });
});
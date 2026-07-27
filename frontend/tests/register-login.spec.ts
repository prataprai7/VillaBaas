import { test, expect } from "@playwright/test";

function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

test.describe("Register and Login flow", () => {
  test("registers a new user and redirects to login", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto("/signup");

    await page.fill("#firstName", "Pratap");
    await page.fill("#lastName", "Rai");
    await page.fill("#email", email);
    await page.fill("#password", "Password123");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/login\?registered=true/);
  });

  test("logs in with the newly registered account and reaches the dashboard", async ({ page }) => {
    const email = uniqueEmail();

    // Register first
    await page.goto("/signup");
    await page.fill("#firstName", "Pratap");
    await page.fill("#lastName", "Rai");
    await page.fill("#email", email);
    await page.fill("#password", "Password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/login\?registered=true/);

    // Now log in
    await page.fill("#email", email);
    await page.fill("#password", "Password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows an error for invalid login credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "doesnotexist@example.com");
    await page.fill("#password", "WrongPassword123");
    await page.click('button[type="submit"]');

    await expect(page.locator(".form-error-banner")).toBeVisible();
  });

  test("shows field validation errors on blur for invalid email", async ({ page }) => {
    await page.goto("/signup");

    await page.fill("#email", "not-an-email");
    await page.locator("#email").blur();

    await expect(page.locator(".field-error")).toBeVisible();
  });
});
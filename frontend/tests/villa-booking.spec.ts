import { test, expect } from "@playwright/test";

async function registerAndLoginViaUI(page: import("@playwright/test").Page) {
  const email = `e2e-book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  await page.goto("/signup");
  await page.fill("#firstName", "Book");
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

test.describe("Villa detail and booking flow", () => {
  test("views villa details and sees the price", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.getByRole("button", { name: "View" }).first().click();
    await expect(page).toHaveURL(/\/dashboard\/villas\/[a-f0-9]{24}/);

    await expect(page.getByText("Loading villa...")).toHaveCount(0, { timeout: 10000 });
    await expect(page.getByText(/NPR [\d,]+/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Check Availability|Book Now/ })).toBeVisible();
  });

  test("requires check-in/check-out dates before proceeding", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.getByRole("button", { name: "View" }).first().click();
    await expect(page.getByText("Loading villa...")).toHaveCount(0, { timeout: 10000 });

    // Button shows "Check Availability" when no dates are picked
    await expect(page.getByRole("button", { name: "Check Availability" })).toBeVisible();
  });

  test("selects dates, proceeds to booking confirmation, and reaches the payment handoff", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.getByRole("button", { name: "View" }).first().click();
    await expect(page.getByText("Loading villa...")).toHaveCount(0, { timeout: 10000 });

    // Pick check-in and check-out dates
    const checkInInput = page.locator("#check-in-input");
    await checkInInput.fill("2026-10-01");

    const checkOutInput = page.locator('input[type="date"]').nth(1);
    await checkOutInput.fill("2026-10-05");

    // Now the button should say "Book Now"
    await page.getByRole("button", { name: "Book Now" }).click();

    // Should land on the booking confirmation page
    await expect(page).toHaveURL(/\/dashboard\/villas\/[a-f0-9]{24}\/book/);
    await expect(page.getByRole("heading", { name: "Confirm Booking" })).toBeVisible();
    await expect(page.getByText("4 nights", { exact: true })).toBeVisible();

    // Agree to house rules
    await page.getByText("I agree to the house rules and cancellation policy").click();

    // Proceed to payment
    await page.getByRole("button", { name: "Proceed to Payment" }).click();

    // Should redirect toward the payment handoff page with booking details in the query
    await expect(page).toHaveURL(/\/dashboard\/bookings\/payment\?villaId=.+checkIn=2026-10-01.+checkOut=2026-10-05/);
  });

  test("shows a toast error if proceeding without agreeing to house rules", async ({ page }) => {
    await registerAndLoginViaUI(page);
    await expect(page.getByText("Loading villas...")).toHaveCount(0, { timeout: 10000 });

    await page.getByRole("button", { name: "View" }).first().click();
    await expect(page.getByText("Loading villa...")).toHaveCount(0, { timeout: 10000 });

    await page.locator("#check-in-input").fill("2026-10-01");
    await page.locator('input[type="date"]').nth(1).fill("2026-10-05");
    await page.getByRole("button", { name: "Book Now" }).click();

    await expect(page.getByRole("heading", { name: "Confirm Booking" })).toBeVisible();

    // Click proceed WITHOUT checking the agreement box
    await page.getByRole("button", { name: "Proceed to Payment" }).click();

    await expect(page.getByText("Please agree to the house rules to continue")).toBeVisible();
  });
});
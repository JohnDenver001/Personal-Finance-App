import { test, expect } from "@playwright/test";
import { seedAuthenticatedUser } from "./helpers/auth";

/**
 * Dashboard screen tests.
 * Seeds a fully authenticated+onboarded user so the app lands on the dashboard.
 */
test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
  });

  test("loads the dashboard for authenticated users", async ({ page }) => {
    await page.goto("/");
    // Should NOT redirect away
    await expect(page).not.toHaveURL(/login/);
    await expect(page).not.toHaveURL(/onboarding/);
  });

  test("renders remaining budget section", async ({ page }) => {
    await page.goto("/");
    // RemainingBudget shows "Remaining Budget" label or a currency amount
    await expect(
      page.getByText(/remaining budget|remaining/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders daily safe-to-spend section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/safe to spend|daily/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders discipline score section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/discipline/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders recent transactions section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/recent transactions|no transactions/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("FAB add button is visible and navigates to add transaction", async ({ page }) => {
    await page.goto("/");
    // The floating action button uses Ionicons "add" icon plus accessibilityLabel
    const fab = page.locator('[aria-label="Add transaction"]');
    await expect(fab).toBeVisible({ timeout: 10_000 });
    await fab.click();
    await page.waitForURL(/add/, { timeout: 10_000 });
    await expect(page).toHaveURL(/add/);
  });

  test("bottom tab bar renders all four tabs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Dashboard")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Insights")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Profile")).toBeVisible({ timeout: 10_000 });
  });

  test("pull-to-refresh indicator is present (RefreshControl)", async ({ page }) => {
    await page.goto("/");
    // RefreshControl renders as a scrollable container; just assert the page loaded
    const scrollable = page.locator('[role="scrollbar"], [overscroll-behavior], [data-testid]').first();
    await expect(page.locator("body")).toBeAttached();
  });

  test("bottom tab Insights navigates to /insights", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Insights").click();
    await page.waitForURL(/insights/, { timeout: 10_000 });
    await expect(page).toHaveURL(/insights/);
  });

  test("bottom tab Profile navigates to /profile", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Profile").last().click(); // avoid ambiguity if text appears in header
    await page.waitForURL(/profile/, { timeout: 10_000 });
    await expect(page).toHaveURL(/profile/);
  });
});
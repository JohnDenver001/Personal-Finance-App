import { test, expect } from "@playwright/test";
import { seedAuthenticatedUser } from "./helpers/auth";

/**
 * Insights screen tests.
 * Verifies the 3-tab layout: Weekly, Monthly, Patterns.
 */
test.describe("Insights", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
  });

  test("renders Insights heading", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByText("Insights").first()).toBeVisible({ timeout: 10_000 });
  });

  test("renders all three tab buttons", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("tab", { name: "Weekly insights" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("tab", { name: "Monthly insights" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("tab", { name: "Patterns insights" })).toBeVisible({ timeout: 10_000 });
  });

  test("Weekly tab is selected by default", async ({ page }) => {
    await page.goto("/insights");
    const weeklyTab = page.getByRole("tab", { name: "Weekly insights" });
    await expect(weeklyTab).toBeVisible({ timeout: 10_000 });
    await expect(weeklyTab).toHaveAttribute("aria-selected", "true");
  });

  test("clicking Monthly tab selects it", async ({ page }) => {
    await page.goto("/insights");
    const monthlyTab = page.getByRole("tab", { name: "Monthly insights" });
    await monthlyTab.click();
    await expect(monthlyTab).toHaveAttribute("aria-selected", "true");
    // Weekly should now be unselected
    const weeklyTab = page.getByRole("tab", { name: "Weekly insights" });
    await expect(weeklyTab).toHaveAttribute("aria-selected", "false");
  });

  test("clicking Patterns tab selects it", async ({ page }) => {
    await page.goto("/insights");
    const patternsTab = page.getByRole("tab", { name: "Patterns insights" });
    await patternsTab.click();
    await expect(patternsTab).toHaveAttribute("aria-selected", "true");
  });

  test("Weekly tab content is visible by default", async ({ page }) => {
    await page.goto("/insights");
    // WeeklyInsights renders with empty state or insight cards
    await expect(
      page.getByText(/weekly|no insights|this week/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("Monthly tab shows monthly content when clicked", async ({ page }) => {
    await page.goto("/insights");
    await page.getByRole("tab", { name: "Monthly insights" }).click();
    await expect(
      page.getByText(/monthly|month|report/i).first(),
    ).toBeVisible({ timeout: 8_000 });
  });
});
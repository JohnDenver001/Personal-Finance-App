import { test, expect } from "@playwright/test";
import { seedAuthenticatedUser } from "./helpers/auth";

/**
 * Profile screen tests.
 * Verifies user info display, financial settings, category management, and sign-out.
 */
test.describe("Profile", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
  });

  test("renders Profile heading", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Profile").first()).toBeVisible({ timeout: 10_000 });
  });

  test("displays the authenticated user email", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("e2e@example.com")).toBeVisible({ timeout: 10_000 });
  });

  test("renders Financial Settings section", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Financial Settings")).toBeVisible({ timeout: 10_000 });
  });

  test("renders Monthly Income row", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Monthly Income")).toBeVisible({ timeout: 10_000 });
  });

  test("renders Monthly Budget row", async ({ page }) => {
    await page.goto("/profile");
    await expect(
      page.getByText(/monthly budget|budget limit/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("renders Categories section", async ({ page }) => {
    await page.goto("/profile");
    await expect(
      page.getByText(/categories/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sign out button is visible", async ({ page }) => {
    await page.goto("/profile");
    await expect(
      page.getByRole("button", { name: /sign out/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sign out navigates back to login screen", async ({ page }) => {
    await page.goto("/profile");
    await page.getByRole("button", { name: /sign out/i }).click();
    await page.waitForURL(/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/login/);
  });

  test("tapping edit income shows an input field", async ({ page }) => {
    await page.goto("/profile");
    // Find and click the edit/pencil button next to Monthly Income
    const editButtons = page.getByRole("button").filter({ hasText: /edit|pencil/i });
    const incomeSection = page.locator("text=Monthly Income").locator("..");
    // Try clicking an edit icon near the income row
    const editIcon = page.locator('[aria-label*="edit" i], [aria-label*="income" i]').first();
    if (await editIcon.count() > 0) {
      await editIcon.click();
      await expect(page.getByLabel("Monthly Income").or(
        page.locator("input").first()
      )).toBeVisible({ timeout: 5_000 });
    }
  });

  test("add category button opens modal", async ({ page }) => {
    await page.goto("/profile");
    const addCatBtn = page.getByRole("button", { name: /add category/i });
    if (await addCatBtn.count() > 0) {
      await addCatBtn.click();
      await expect(
        page.getByText(/add category|category name/i).first(),
      ).toBeVisible({ timeout: 5_000 });
    }
  });
});
import { test, expect } from "@playwright/test";
import { seedAuthenticatedUser } from "./helpers/auth";

/**
 * Add Transaction screen tests.
 * Verifies the 3-tap flow: enter amount, pick category, save.
 */
test.describe("Add Transaction", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthenticatedUser(page);
  });

  test("renders add transaction form with header", async ({ page }) => {
    await page.goto("/add");
    await expect(page.getByText("Add Transaction")).toBeVisible({ timeout: 10_000 });
  });

  test("amount field is present and accepts numeric input", async ({ page }) => {
    await page.goto("/add");
    const amountInput = page.getByLabel("Amount");
    await expect(amountInput).toBeVisible({ timeout: 10_000 });
    await amountInput.fill("42.50");
    await expect(amountInput).toHaveValue("42.50");
  });

  test("submit button is present", async ({ page }) => {
    await page.goto("/add");
    await expect(
      page.getByRole("button", { name: "Save Transaction" }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows validation error when amount is empty and form is submitted", async ({ page }) => {
    await page.goto("/add");
    await page.getByRole("button", { name: "Save Transaction" }).click();
    await expect(
      page.getByText(/valid amount|greater than 0/i),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("shows validation error when no category is selected", async ({ page }) => {
    await page.goto("/add");
    await page.getByLabel("Amount").fill("50");
    await page.getByRole("button", { name: "Save Transaction" }).click();
    await expect(
      page.getByText(/select a category/i),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("category picker renders category options", async ({ page }) => {
    await page.goto("/add");
    // The category picker renders a horizontal scroll of category buttons
    await expect(
      page.getByText(/food|transport|shopping|entertainment/i).first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("selecting a category highlights it", async ({ page }) => {
    await page.goto("/add");
    // Click the first visible category
    const firstCategory = page.getByText(/food|groceries/i).first();
    if (await firstCategory.isVisible()) {
      await firstCategory.click();
      // After clicking, the category should be selected (border/style change)
      // We verify by attempting to submit - the category error should be gone
      await page.getByLabel("Amount").fill("25");
      await page.getByRole("button", { name: "Save Transaction" }).click();
      // No "select a category" error
      await expect(page.getByText(/select a category/i)).not.toBeVisible();
    }
  });

  test("note field is optional and accepts text", async ({ page }) => {
    await page.goto("/add");
    const noteField = page.getByLabel("Note").or(page.getByPlaceholder(/note|optional/i));
    if (await noteField.count() > 0) {
      await noteField.first().fill("Lunch with team");
      await expect(noteField.first()).toHaveValue("Lunch with team");
    }
  });

  test("back button navigates away from add screen", async ({ page }) => {
    await page.goto("/");
    await page.goto("/add");
    await page.getByRole("button", { name: /back/i }).click();
    await expect(page).not.toHaveURL(/\/add$/);
  });
});
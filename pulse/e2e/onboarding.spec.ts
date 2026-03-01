import { test, expect } from "@playwright/test";
import { seedNewUser } from "./helpers/auth";

/**
 * Onboarding wizard tests.
 * Seeds an authenticated-but-not-onboarded user so the app redirects to /onboarding.
 */
test.describe("Onboarding Wizard", () => {
  test.beforeEach(async ({ page }) => {
    await seedNewUser(page);
  });

  test("redirects authenticated new user to onboarding", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL(/onboarding/, { timeout: 10_000 });
    await expect(page).toHaveURL(/onboarding/);
  });

  test("step 1 shows income question and step indicator", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByText("What is your monthly income?")).toBeVisible();
    await expect(page.getByLabel("Monthly Income")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  });

  test("step 1 shows validation error on empty continue", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(
      page.getByText("Enter a valid income amount greater than 0"),
    ).toBeVisible();
  });

  test("step 1 accepts valid income and advances to step 2", async ({ page }) => {
    await page.goto("/onboarding");
    await page.getByLabel("Monthly Income").fill("5000");
    await page.getByRole("button", { name: "Continue" }).click();
    // Step 2: expenses
    await expect(page.getByText(/recurring|expenses/i)).toBeVisible({ timeout: 8_000 });
  });

  test("can navigate from step 1 through step 2 to step 3", async ({ page }) => {
    await page.goto("/onboarding");

    // Step 1  Income
    await page.getByLabel("Monthly Income").fill("5000");
    await page.getByRole("button", { name: "Continue" }).click();

    // Step 2  Expenses: look for a continue/next button
    await page.waitForSelector("text=/expenses|savings|debt/i", { timeout: 8_000 });
    const continueBtn = page.getByRole("button", { name: /continue|next/i });
    await continueBtn.click();

    // Step 3  Budget
    await expect(page.getByText(/budget|limit/i)).toBeVisible({ timeout: 8_000 });
  });
});
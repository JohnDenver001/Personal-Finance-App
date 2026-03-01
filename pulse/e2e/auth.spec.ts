import { test, expect } from "@playwright/test";
import { clearAuth } from "./helpers/auth";

/**
 * Auth flow tests: Login & Register screens.
 * These run against the unauthenticated state so the app stays on /login.
 */
test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  //  Login 

  test("login page renders Pulse branding", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Pulse")).toBeVisible();
    await expect(page.getByText("Take control of your spending")).toBeVisible();
  });

  test("login page has email, password fields and sign-in button", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel("Email address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("login shows validation error when submitting empty form", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("login shows validation error for invalid email format", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("notanemail");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("login shows validation error for short password", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("test@example.com");
    await page.getByLabel("Password").fill("abc");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("successful login redirects to onboarding for new users", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("newuser@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await page.waitForURL(/onboarding/, { timeout: 10_000 });
    await expect(page).toHaveURL(/onboarding/);
  });

  test("sign up link navigates to register screen", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Create an account" }).click();
    await page.waitForURL(/register/, { timeout: 10_000 });
    await expect(page).toHaveURL(/register/);
  });

  //  Register 

  test("register page renders create account heading", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText("Create Account")).toBeVisible();
    await expect(page.getByText("Start your journey to better spending habits")).toBeVisible();
  });

  test("register page has all three fields and submit button", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
  });

  test("register shows error when passwords do not match", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByLabel("Confirm Password").fill("differentpass");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("register shows error when password too short", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("abc");
    await page.getByLabel("Confirm Password").fill("abc");
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("successful registration redirects to onboarding", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("newuser@example.com");
    await page.getByLabel("Password").fill("securepass");
    await page.getByLabel("Confirm Password").fill("securepass");
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL(/onboarding/, { timeout: 10_000 });
    await expect(page).toHaveURL(/onboarding/);
  });

  test("register sign in link navigates back to login", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: "Sign in instead" }).click();
    await page.waitForURL(/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/login/);
  });
});
import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration for the Pulse web app.
 * Assumes `npx expo start --web --port 8083` is running.
 * Run: npx playwright test
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:8083",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "off",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command:
      "cd c:\\Users\\LENOVO\\PycharmProjects\\Personal-Finance-App\\pulse && npx expo start --web --port 8083",
    url: "http://localhost:8083",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});

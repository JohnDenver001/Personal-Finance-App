import type { Page } from "@playwright/test";

/** Zustand persist state shape for pulse-auth-storage (must mirror auth-store partialize). */
interface AuthPersistedState {
  state: {
    user: {
      id: string;
      email: string;
      // monthly_income and monthly_budget_limit are intentionally absent:
      // they are no longer persisted to storage (security hardening).
      preferences: {
        financial_focus: string;
        currency: string;
        theme: string;
      };
      created_at: string;
    } | null;
    isAuthenticated: boolean;
    hasCompletedOnboarding: boolean;
    /** Epoch ms. Set far in the future for E2E tests so sessions never expire mid-run. */
    sessionExpiresAt: number | null;
  };
  version: number;
}

const BASE_USER = {
  id: "e2e-user-1",
  email: "e2e@example.com",
  preferences: { financial_focus: "balanced", currency: "USD", theme: "system" },
  created_at: "2026-01-01T00:00:00.000Z",
};

/** Far-future expiry so E2E sessions never hit the 24 h TTL during a test run. */
const E2E_SESSION_EXPIRES_AT = Date.now() + 365 * 24 * 60 * 60 * 1000;

/**
 * Inject a fully authenticated + onboarded user into localStorage.
 * Must be called BEFORE page.goto() to take effect on initial load.
 */
export async function seedAuthenticatedUser(page: Page): Promise<void> {
  const state: AuthPersistedState = {
    state: {
      user: BASE_USER,
      isAuthenticated: true,
      hasCompletedOnboarding: true,
      sessionExpiresAt: E2E_SESSION_EXPIRES_AT,
    },
    version: 0,
  };
  await page.addInitScript(
    (s) => localStorage.setItem("pulse-auth-storage", JSON.stringify(s)),
    state,
  );
}

/**
 * Inject an authenticated-but-not-yet-onboarded user into localStorage.
 * The app will redirect such users to /onboarding.
 */
export async function seedNewUser(page: Page): Promise<void> {
  const state: AuthPersistedState = {
    state: {
      user: BASE_USER,
      isAuthenticated: true,
      hasCompletedOnboarding: false,
      sessionExpiresAt: E2E_SESSION_EXPIRES_AT,
    },
    version: 0,
  };
  await page.addInitScript(
    (s) => localStorage.setItem("pulse-auth-storage", JSON.stringify(s)),
    state,
  );
}

/** Clear all persisted state so the app starts fresh (unauthenticated). */
export async function clearAuth(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.clear());
}
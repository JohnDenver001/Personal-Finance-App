import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, OnboardingData } from '@/types';

/**
 * How long a persisted session stays valid without a backend token refresh.
 * After this period the user is silently signed out on next app open.
 * In production, replace this with real JWT expiry from your auth provider.
 */
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Maximum consecutive failed sign-in attempts before the UI locks out.
 * Actual enforcement must also live server-side; this is a defence-in-depth
 * client guard to slow down credential-stuffing on the form layer.
 */
const MAX_SIGN_IN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * The subset of the User object that is safe to persist to device storage.
 * Financial figures (monthly_income, monthly_budget_limit) are intentionally
 * excluded — they should be reloaded from the backend on each session and
 * must NOT sit in plaintext localStorage where XSS can exfiltrate them.
 */
interface PersistedUser {
  id: string;
  email: string;
  preferences: User['preferences'];
  created_at: string;
}

interface AuthState {
  /** Minimal user identity — no financial fields (see PersistedUser). */
  user: PersistedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  /** Epoch ms at which the current session expires. Null = no active session. */
  sessionExpiresAt: number | null;
  /** Consecutive failed sign-in attempts (rate-limit guard). */
  signInAttempts: number;
  /** Epoch ms at which the lockout period ends. Null = not locked out. */
  lockedUntil: number | null;
  /**
   * Transient onboarding collection — NOT persisted to storage.
   * Contains sensitive financial input (income, debts, savings);
   * cleared on signOut and on completeOnboarding.
   */
  onboardingData: Partial<OnboardingData>;
}

interface AuthActions {
  setUser: (user: PersistedUser | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Call on app foreground to sign out silently if the session has expired. */
  checkSession: () => void;
  setLoading: (loading: boolean) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
}

/** Authentication store — manages user session and onboarding state.
 *
 * SECURITY DESIGN:
 * - Only a minimal PersistedUser (no financial fields) is written to storage.
 * - Financial data (income, budget, debts) lives in memory only.
 * - Sessions carry an expiry timestamp; checkSession() enforces it on resume.
 * - signOut() explicitly removes the storage key in addition to clearing state.
 * - A client-side rate-limit guard slows credential stuffing; real enforcement
 *   must also be implemented server-side (Supabase Auth has built-in limits).
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,
      sessionExpiresAt: null,
      signInAttempts: 0,
      lockedUntil: null,
      onboardingData: {},

      setUser: (user) =>
        set({ user, isAuthenticated: user !== null }),

      signIn: async (email: string, _password: string) => {
        const { lockedUntil, signInAttempts } = get();

        // Client-side lockout guard
        if (lockedUntil !== null && Date.now() < lockedUntil) {
          const remaining = Math.ceil((lockedUntil - Date.now()) / 60_000);
          throw new Error(
            `Too many failed attempts. Try again in ${remaining} minute${remaining === 1 ? '' : 's'}.`,
          );
        }

        set({ isLoading: true });
        try {
          // MVP: Mock sign-in — replace with real authService.signIn(email, password)
          // The real implementation must:
          //   1. Send credentials over HTTPS only
          //   2. Store the returned JWT/session token in the auth provider SDK
          //      (Supabase manages its own httpOnly-equivalent secure storage)
          //   3. NEVER store raw passwords or access tokens in this store
          const mockUser: PersistedUser = {
            id: 'user-1',
            email,
            // financial fields (monthly_income, monthly_budget_limit) intentionally
            // omitted — load them from your backend after auth, store in budgetStore
            preferences: {
              financial_focus: 'balanced',
              currency: 'USD',
              theme: 'system',
            },
            created_at: new Date().toISOString(),
          };
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            sessionExpiresAt: Date.now() + SESSION_TTL_MS,
            signInAttempts: 0,
            lockedUntil: null,
          });
        } catch {
          const newAttempts = signInAttempts + 1;
          set({
            isLoading: false,
            signInAttempts: newAttempts,
            lockedUntil:
              newAttempts >= MAX_SIGN_IN_ATTEMPTS
                ? Date.now() + LOCKOUT_DURATION_MS
                : null,
          });
          throw new Error('Invalid email or password');
        }
      },

      signUp: async (email: string, _password: string) => {
        set({ isLoading: true });
        try {
          // MVP: Mock sign-up — replace with real authService.signUp(email, password)
          const mockUser: PersistedUser = {
            id: 'user-' + Date.now(),
            email,
            preferences: {
              financial_focus: 'balanced',
              currency: 'USD',
              theme: 'system',
            },
            created_at: new Date().toISOString(),
          };
          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            hasCompletedOnboarding: false,
            sessionExpiresAt: Date.now() + SESSION_TTL_MS,
            signInAttempts: 0,
            lockedUntil: null,
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Registration failed. Please try again.');
        }
      },

      signOut: async () => {
        // Explicitly remove the persisted storage key so no stale session
        // data remains on disk after logout — critical on shared devices.
        try {
          await AsyncStorage.removeItem('pulse-auth-storage');
        } catch {
          // Non-fatal: in-memory state is cleared below regardless
        }
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
          sessionExpiresAt: null,
          signInAttempts: 0,
          lockedUntil: null,
          onboardingData: {},
        });
      },

      checkSession: () => {
        const { isAuthenticated, sessionExpiresAt } = get();
        if (isAuthenticated && sessionExpiresAt !== null && Date.now() > sessionExpiresAt) {
          // Session has expired — sign out silently
          void get().signOut();
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setOnboardingData: (data) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        })),

      completeOnboarding: () =>
        set((state) => {
          const updated = state.user
            ? {
                ...state.user,
                preferences: {
                  ...state.user.preferences,
                  financial_focus:
                    state.onboardingData.financial_focus ?? 'balanced',
                },
              }
            : state.user;
          // Clear onboardingData from memory now that it has been applied.
          // monthly_income / monthly_budget_limit go to budgetStore, not here.
          return { hasCompletedOnboarding: true, user: updated, onboardingData: {} };
        }),
    }),
    {
      name: 'pulse-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      /**
       * SECURITY: Only the minimum fields required for route-guarding and
       * user identity are persisted to device storage.
       *
       * Excluded from storage:
       *  - onboardingData  (income, debt, savings — sensitive financial input)
       *  - signInAttempts / lockedUntil  (reset on cold-start is intentional;
       *    real rate-limiting must be server-side)
       *  - isLoading  (transient UI state)
       */
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    },
  ),
);

import type { User } from '@/types';

/**
 * Authentication service layer.
 * MVP: Returns mock responses. Replace with Supabase Auth calls.
 */

/** Sign in with email and password */
export const signIn = async (
  email: string,
  _password: string,
): Promise<User> => {
  // MVP mock
  await new Promise((r) => setTimeout(r, 800));
  return {
    id: 'user-1',
    email,
    monthly_income: 5000,
    monthly_budget_limit: 3000,
    preferences: { financial_focus: 'balanced', currency: 'USD', theme: 'system' },
    created_at: new Date().toISOString(),
  };
};

/** Sign up with email and password */
export const signUp = async (
  email: string,
  _password: string,
): Promise<User> => {
  await new Promise((r) => setTimeout(r, 800));
  return {
    id: 'user-' + Date.now(),
    email,
    monthly_income: 0,
    monthly_budget_limit: 0,
    preferences: { financial_focus: 'balanced', currency: 'USD', theme: 'system' },
    created_at: new Date().toISOString(),
  };
};

/** Sign out */
export const signOut = async (): Promise<void> => {
  await new Promise((r) => setTimeout(r, 300));
};

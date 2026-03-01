import type { BudgetSummary } from '@/types';

/**
 * Budget service layer.
 * MVP: Returns mock data. Replace with Supabase calls.
 */

/** Fetch budget summary for a user */
export const getBudgetSummary = async (
  _userId: string,
): Promise<BudgetSummary> => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    monthly_income: 5000,
    monthly_budget_limit: 3000,
    total_spent: 1200,
    remaining_budget: 1800,
    daily_safe_to_spend: 120,
    spending_velocity: 0.8,
    discipline_score: 72,
    percent_spent: 40,
    percent_month_passed: 50,
    budget_health: 'green',
  };
};

/** Update budget settings */
export const updateBudget = async (
  _userId: string,
  _updates: { monthly_income?: number; monthly_budget_limit?: number },
): Promise<void> => {
  await new Promise((r) => setTimeout(r, 300));
};

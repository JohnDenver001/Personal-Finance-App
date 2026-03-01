import type { OnboardingInsight, OnboardingData } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

/**
 * AI service layer.
 * MVP: Returns mock AI-generated data. Replace with OpenAI API calls.
 */

/** Suggest a category based on transaction description */
export const suggestCategory = async (
  _description: string,
): Promise<string> => {
  await new Promise((r) => setTimeout(r, 200));
  return 'Food';
};

/** Generate onboarding insights from user financial data */
export const generateOnboardingInsight = async (
  data: OnboardingData,
): Promise<OnboardingInsight> => {
  await new Promise((r) => setTimeout(r, 1500));

  const budget = data.monthly_budget_limit;
  const categories = DEFAULT_CATEGORIES.slice(0, 8).map((cat, index) => ({
    name: cat.name,
    monthly_budget_allocation: Math.round(
      budget * [0.25, 0.15, 0.2, 0.1, 0.08, 0.07, 0.05, 0.1][index]!,
    ),
    icon: cat.icon,
    color: cat.color,
  }));

  const expenseRatio =
    data.recurring_expenses.reduce((sum, e) => sum + e.amount, 0) /
    data.monthly_income;

  return {
    suggested_categories: categories,
    overspending_risk:
      expenseRatio > 0.7 ? 'high' : expenseRatio > 0.5 ? 'medium' : 'low',
    initial_insight:
      'Based on your income and expenses, you have a ' +
      (expenseRatio > 0.7 ? 'tight' : 'healthy') +
      ' budget. Focus on tracking daily spending to stay on target.',
  };
};

/** Generate weekly summary insight */
export const generateWeeklySummary = async (
  _userId: string,
): Promise<string> => {
  await new Promise((r) => setTimeout(r, 800));
  return 'This week you stayed within budget in 4 out of 5 categories. Your biggest spending area was Food.';
};

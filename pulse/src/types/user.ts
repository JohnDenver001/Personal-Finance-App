/** User profile as defined in the PRD High-Level Data Model */
export interface User {
  id: string;
  email: string;
  monthly_income: number;
  monthly_budget_limit: number;
  preferences: UserPreferences;
  created_at: string;
}

/** User preference options for financial focus, currency, and theming */
export interface UserPreferences {
  financial_focus: 'strict' | 'balanced' | 'flexible';
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

/** Input for creating/updating user profile during onboarding */
export interface OnboardingData {
  monthly_income: number;
  recurring_expenses: RecurringExpense[];
  current_savings: number;
  debt: number;
  monthly_budget_limit: number;
  financial_focus: 'strict' | 'balanced' | 'flexible';
}

/** Recurring expense entered during onboarding */
export interface RecurringExpense {
  name: string;
  amount: number;
}

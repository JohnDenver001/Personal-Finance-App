/** Consistent error type for the service layer */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/** Budget summary computed from transaction data */
export interface BudgetSummary {
  monthly_income: number;
  monthly_budget_limit: number;
  total_spent: number;
  remaining_budget: number;
  daily_safe_to_spend: number;
  spending_velocity: number;
  discipline_score: number;
  percent_spent: number;
  percent_month_passed: number;
  budget_health: 'green' | 'yellow' | 'red';
}

/** User progression levels from PRD Section 4 */
export type ProgressionLevel =
  | 'Aware'
  | 'Controlled'
  | 'Stable'
  | 'Optimized'
  | 'Disciplined';

/** Progression level with number */
export interface UserLevel {
  level: number;
  name: ProgressionLevel;
  description: string;
  progress: number;
}

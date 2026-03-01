import { APP_CONFIG } from '@/constants/config';

/** PRD Pattern 1: Cash Flow Control  Remaining budget */
export const getRemainingBudget = (limit: number, spent: number): number =>
  limit - spent;

/** PRD Pattern 2: Spending Velocity  Ratio of budget used vs month passed */
export const getVelocityRatio = (
  percentBudgetUsed: number,
  percentMonthPassed: number,
): number =>
  percentMonthPassed === 0 ? 0 : percentBudgetUsed / percentMonthPassed;

/** Daily safe-to-spend given remaining budget and days left */
export const getDailySafeToSpend = (
  remaining: number,
  daysLeft: number,
): number => (daysLeft <= 0 ? 0 : remaining / daysLeft);

/** PRD Pattern 5: Financial Discipline Score (0-100) */
export const getDisciplineScore = (factors: {
  withinTotalBudget: boolean;
  withinCategoryBudgets: number;
  velocityControlled: boolean;
  loggingConsistency: number;
  savingsAllocated: boolean;
}): number => {
  let score = 0;

  // 25 points for staying within total budget
  if (factors.withinTotalBudget) score += 25;

  // 0-25 based on percentage of categories within budget
  score += Math.round(factors.withinCategoryBudgets * 25);

  // 25 points for velocity ratio <= 1
  if (factors.velocityControlled) score += 25;

  // 0-15 based on logging consistency (days logged / total days)
  score += Math.round(factors.loggingConsistency * 15);

  // 10 points for allocating savings
  if (factors.savingsAllocated) score += 10;

  return Math.min(100, Math.max(0, score));
};

/** PRD Pattern 1: Early Warning  High spend rate relative to time passed */
export const checkEarlyWarning = (
  percentSpent: number,
  percentMonthPassed: number,
): boolean =>
  percentMonthPassed > 0 &&
  percentSpent / percentMonthPassed > APP_CONFIG.EARLY_WARNING_THRESHOLD;

/** Calculate percentage of month that has passed */
export const getPercentMonthPassed = (date: Date): number => {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  return (date.getDate() / daysInMonth) * 100;
};

/** Calculate days remaining in the current month */
export const getDaysRemainingInMonth = (date: Date): number => {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  ).getDate();
  return daysInMonth - date.getDate();
};

/** Calculate percent of budget spent */
export const getPercentSpent = (spent: number, limit: number): number =>
  limit <= 0 ? 0 : (spent / limit) * 100;

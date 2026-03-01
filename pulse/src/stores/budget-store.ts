import { useMemo } from 'react';
import { create } from 'zustand';
import {
  getRemainingBudget,
  getVelocityRatio,
  getDailySafeToSpend,
  getDisciplineScore,
  getPercentSpent,
  getPercentMonthPassed,
  getDaysRemainingInMonth,
} from '@/utils/calculations';
import { getBudgetHealth } from '@/constants/colors';

interface BudgetState {
  monthlyIncome: number;
  monthlyBudgetLimit: number;
  isLoading: boolean;
}

export interface BudgetDerived {
  remainingBudget: number;
  dailySafeToSpend: number;
  spendingVelocity: number;
  disciplineScore: number;
  percentSpent: number;
  percentMonthPassed: number;
  budgetHealthColor: 'green' | 'yellow' | 'red';
}

interface BudgetActions {
  setBudget: (income: number, limit: number) => void;
  setLoading: (loading: boolean) => void;
}

/** Budget store — manages income and budget limit only.
 *
 *  totalSpent is intentionally NOT stored here; it is a derived value
 *  computed from the transaction store (useTotalSpent) to avoid dual-state
 *  synchronisation and cascading re-renders. */
export const useBudgetStore = create<BudgetState & BudgetActions>()((set) => ({
  monthlyIncome: 0,
  monthlyBudgetLimit: 0,
  isLoading: false,

  setBudget: (income, limit) =>
    set({ monthlyIncome: income, monthlyBudgetLimit: limit }),

  setLoading: (isLoading) => set({ isLoading }),
}));

/**
 * Selector: compute derived budget values.
 *
 * @param totalSpent - pass the value from useTotalSpent() so this hook
 *   does NOT subscribe to budgetStore for a field that lives elsewhere.
 *
 * Returns a stable object reference via useMemo — consumers only re-render
 * when monthlyBudgetLimit or totalSpent actually changes.
 */
export const useBudgetDerived = (totalSpent: number): BudgetDerived => {
  const monthlyBudgetLimit = useBudgetStore((s) => s.monthlyBudgetLimit);

  return useMemo(() => {
    const now = new Date();
    const percentSpent = getPercentSpent(totalSpent, monthlyBudgetLimit);
    const percentMonthPassed = getPercentMonthPassed(now);
    const remaining = getRemainingBudget(monthlyBudgetLimit, totalSpent);
    const daysLeft = getDaysRemainingInMonth(now);
    const velocity = getVelocityRatio(percentSpent, percentMonthPassed);

    return {
      remainingBudget: remaining,
      dailySafeToSpend: getDailySafeToSpend(remaining, daysLeft),
      spendingVelocity: velocity,
      disciplineScore: getDisciplineScore({
        withinTotalBudget: totalSpent <= monthlyBudgetLimit,
        // TODO(post-MVP): wire real per-category overspend ratio
        withinCategoryBudgets: 1.0,
        velocityControlled: velocity <= 1,
        // TODO(post-MVP): compute from actual logged days
        loggingConsistency: 1.0,
        savingsAllocated: false,
      }),
      percentSpent,
      percentMonthPassed,
      budgetHealthColor: getBudgetHealth(percentSpent),
    };
  }, [totalSpent, monthlyBudgetLimit]);
};

import { useBudgetStore, useBudgetDerived } from '@/stores/budget-store';
import { useTotalSpent } from '@/stores/transaction-store';
import { useAuthStore } from '@/stores/auth-store';

/**
 * Custom hook for budget state and derived calculations.
 * totalSpent is sourced from the transaction store (single source of truth)
 * and passed into useBudgetDerived so no cross-store sync is required.
 */
export const useBudget = () => {
  const { monthlyIncome, monthlyBudgetLimit, isLoading } = useBudgetStore();
  const totalSpent = useTotalSpent();
  const derived = useBudgetDerived(totalSpent);
  const currency = useAuthStore((s) => s.user?.preferences.currency ?? 'USD');

  return {
    monthlyIncome,
    monthlyBudgetLimit,
    totalSpent,
    isLoading,
    currency,
    ...derived,
  };
};

import { useMemo } from 'react';
import { create } from 'zustand';
import type { Transaction, TransactionInput, Category } from '@/types';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

/** Full Category objects derived from the static DEFAULT_CATEGORIES list.
 *  Used as the initial store state so the CategoryPicker is never empty,
 *  even before onboarding completes or after a web page refresh. */
const SEED_CATEGORIES: Category[] = DEFAULT_CATEGORIES.map((cat, i) => ({
  id: `cat-default-${i + 1}`,
  user_id: 'system',
  name: cat.name,
  monthly_budget_allocation: 0,
  icon: cat.icon,
  color: cat.color,
}));

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionActions {
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/** Transaction store  manages transaction and category state */
export const useTransactionStore = create<TransactionState & TransactionActions>()(
  (set) => ({
    transactions: [],
    categories: SEED_CATEGORIES,
    isLoading: false,
    error: null,

    addTransaction: (input) =>
      set((state) => {
        // Derive user_id from the auth store at call-time rather than
        // hardcoding 'user-1'. This prevents data mixing when different
        // accounts are used on the same device.
        // Importing inside the action avoids a circular-module dependency.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { useAuthStore } = require('@/stores/auth-store') as typeof import('@/stores/auth-store');
        const userId = useAuthStore.getState().user?.id ?? 'anonymous';

        return {
          transactions: [
            {
              ...input,
              id: `txn-${Date.now()}`,
              user_id: userId,
              created_at: new Date().toISOString(),
            },
            ...state.transactions,
          ],
          error: null,
        };
      }),

    updateTransaction: (id, updates) =>
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      })),

    deleteTransaction: (id) =>
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),

    setTransactions: (transactions) => set({ transactions }),

    setCategories: (categories) => set({ categories }),

    addCategory: (category) =>
      set((state) => ({
        categories: [...state.categories, category],
      })),

    updateCategory: (id, updates) =>
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? { ...c, ...updates } : c,
        ),
      })),

    deleteCategory: (id) =>
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      })),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),
  }),
);

/** Selector: get total amount spent this month.
 *
 *  useMemo ensures the filter+reduce only re-runs when the transactions
 *  array reference changes (i.e. after CRUD), not on every render. */
export const useTotalSpent = (): number => {
  const transactions = useTransactionStore((s) => s.transactions);
  return useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return transactions
      .filter((t) => new Date(t.timestamp) >= monthStart)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
};

/** Selector: get recent N transactions.
 *
 *  Returns a stable array reference as long as the leading N items and
 *  the overall list reference have not changed. */
export const useRecentTransactions = (count: number = 5): Transaction[] => {
  const transactions = useTransactionStore((s) => s.transactions);
  return useMemo(() => transactions.slice(0, count), [transactions, count]);
};

/** Selector: get spending by category for current month.
 *
 *  Returns a stable object reference — only recalculates on transaction
 *  array changes. */
export const useSpendingByCategory = (): Record<string, number> => {
  const transactions = useTransactionStore((s) => s.transactions);
  return useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    return transactions
      .filter((t) => new Date(t.timestamp) >= monthStart)
      .reduce<Record<string, number>>((acc, t) => {
        acc[t.category_id] = (acc[t.category_id] ?? 0) + t.amount;
        return acc;
      }, {});
  }, [transactions]);
};

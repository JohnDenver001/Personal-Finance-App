import { useTransactionStore, useTotalSpent, useRecentTransactions, useSpendingByCategory } from '@/stores/transaction-store';

/**
 * Custom hook for transactions state and computed selectors.
 */
export const useTransactions = () => {
  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useTransactionStore((s) => s.categories);
  const isLoading = useTransactionStore((s) => s.isLoading);
  const error = useTransactionStore((s) => s.error);
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);

  return {
    transactions,
    categories,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export { useTotalSpent, useRecentTransactions, useSpendingByCategory };

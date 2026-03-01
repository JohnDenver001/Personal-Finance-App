import type { Transaction, TransactionInput, TransactionFilters } from '@/types';

/**
 * Transaction service layer.
 * MVP: Works with local store. Replace with Supabase calls.
 */

/** Fetch transactions for a user with optional filters */
export const getTransactions = async (
  _userId: string,
  _filters?: TransactionFilters,
): Promise<Transaction[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [];
};

/** Create a new transaction */
export const createTransaction = async (
  input: TransactionInput,
): Promise<Transaction> => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    ...input,
    id: 'txn-' + Date.now(),
    user_id: 'user-1',
    created_at: new Date().toISOString(),
  };
};

/** Update an existing transaction */
export const updateTransaction = async (
  id: string,
  updates: Partial<Transaction>,
): Promise<Transaction> => {
  await new Promise((r) => setTimeout(r, 300));
  return {
    id,
    user_id: 'user-1',
    amount: 0,
    category_id: '',
    timestamp: new Date().toISOString(),
    created_at: new Date().toISOString(),
    ...updates,
  };
};

/** Delete a transaction by ID */
export const deleteTransaction = async (_id: string): Promise<void> => {
  await new Promise((r) => setTimeout(r, 300));
};

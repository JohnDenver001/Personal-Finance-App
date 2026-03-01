/** Transaction as defined in the PRD High-Level Data Model */
export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category_id: string;
  timestamp: string;
  note?: string;
  created_at: string;
}

/** Input for creating a new transaction (server generates id, user_id, created_at) */
export type TransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'>;

/** Filters for querying transactions */
export interface TransactionFilters {
  category_id?: string;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

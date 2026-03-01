/** Category as defined in the PRD High-Level Data Model */
export interface Category {
  id: string;
  user_id: string;
  name: string;
  monthly_budget_allocation: number;
  icon?: string;
  color?: string;
}

/** Input for creating a new category */
export type CategoryInput = Omit<Category, 'id' | 'user_id'>;

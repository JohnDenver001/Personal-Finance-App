/** Color system as specified in the PRD UI/UX Standards */
export const COLORS = {
  primary: '#6C63FF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    textPrimary: '#212121',
    textSecondary: '#757575',
    cardShadow: 'rgba(0,0,0,0.08)',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    textPrimary: '#FAFAFA',
    textSecondary: '#BDBDBD',
    cardShadow: 'rgba(0,0,0,0.3)',
  },
} as const;

/** Budget health color mapping based on percent spent */
export const getBudgetHealthColor = (percentSpent: number): string => {
  if (percentSpent < 60) return COLORS.success;
  if (percentSpent <= 85) return COLORS.warning;
  return COLORS.danger;
};

/** Budget health status from percent spent */
export const getBudgetHealth = (percentSpent: number): 'green' | 'yellow' | 'red' => {
  if (percentSpent < 60) return 'green';
  if (percentSpent <= 85) return 'yellow';
  return 'red';
};

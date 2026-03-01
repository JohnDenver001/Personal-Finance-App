/** Default expense categories with icons and colors */
export const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'fast-food-outline', color: '#FF6B6B' },
  { name: 'Transport', icon: 'car-outline', color: '#4ECDC4' },
  { name: 'Housing', icon: 'home-outline', color: '#45B7D1' },
  { name: 'Utilities', icon: 'flash-outline', color: '#96CEB4' },
  { name: 'Entertainment', icon: 'game-controller-outline', color: '#DDA0DD' },
  { name: 'Shopping', icon: 'bag-outline', color: '#FFEAA7' },
  { name: 'Health', icon: 'medkit-outline', color: '#74B9FF' },
  { name: 'Education', icon: 'school-outline', color: '#A29BFE' },
  { name: 'Personal', icon: 'person-outline', color: '#FD79A8' },
  { name: 'Savings', icon: 'wallet-outline', color: '#00B894' },
  { name: 'Debt', icon: 'trending-down-outline', color: '#E17055' },
  { name: 'Other', icon: 'ellipsis-horizontal-outline', color: '#636E72' },
] as const;

/** Financial focus options displayed during onboarding */
export const FINANCIAL_FOCUS_OPTIONS = [
  {
    value: 'strict' as const,
    label: 'Strict Control',
    description: 'Tight budget tracking with frequent alerts',
    icon: 'shield-checkmark-outline',
  },
  {
    value: 'balanced' as const,
    label: 'Balanced',
    description: 'Moderate tracking with weekly check-ins',
    icon: 'scale-outline',
  },
  {
    value: 'flexible' as const,
    label: 'Flexible',
    description: 'Relaxed tracking with monthly summaries',
    icon: 'leaf-outline',
  },
] as const;

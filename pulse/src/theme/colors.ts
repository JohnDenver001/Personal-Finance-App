import { COLORS } from '@/constants/colors';

/** Resolved theme colors based on current color scheme */
export const getThemeColors = (scheme: 'light' | 'dark') => ({
  primary: COLORS.primary,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  background: COLORS[scheme].background,
  surface: COLORS[scheme].surface,
  textPrimary: COLORS[scheme].textPrimary,
  textSecondary: COLORS[scheme].textSecondary,
  cardShadow: COLORS[scheme].cardShadow,
});

export type ThemeColors = ReturnType<typeof getThemeColors>;

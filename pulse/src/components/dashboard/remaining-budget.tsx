import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '@/components/ui/card';
import { COLORS, getBudgetHealthColor } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';

interface RemainingBudgetProps {
  remaining: number;
  percentSpent: number;
  currency?: string;
}

/** Large remaining budget display with color-coded health indicator */
export function RemainingBudget({
  remaining,
  percentSpent,
  currency = 'USD',
}: RemainingBudgetProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const healthColor = getBudgetHealthColor(percentSpent);

  return (
    <Card padding="xl">
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>
        Money Left
      </Text>
      <Text style={[styles.amount, { color: healthColor }]}>
        {formatCurrency(Math.max(0, remaining), currency)}
      </Text>
      {remaining < 0 ? (
        <Text style={styles.overBudget}>
          Over budget by {formatCurrency(Math.abs(remaining), currency)}
        </Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amount: {
    fontSize: TYPOGRAPHY.hero.fontSize,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  overBudget: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.xs,
  },
});

import { Text, StyleSheet, useColorScheme } from 'react-native';
import { Card } from '@/components/ui/card';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';

interface DailySafeToSpendProps {
  amount: number;
  currency?: string;
}

/** Secondary display showing safe daily spending amount */
export function DailySafeToSpend({
  amount,
  currency = 'USD',
}: DailySafeToSpendProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <Card padding="base">
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>
        Safe to spend today
      </Text>
      <Text style={[styles.amount, { color: themeColors.textPrimary }]}>
        {formatCurrency(Math.max(0, amount), currency)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
  },
  amount: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});

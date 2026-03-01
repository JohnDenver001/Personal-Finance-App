import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/card';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import { formatTransactionDate } from '@/utils/date';
import type { Transaction, Category } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  currency?: string;
}

/** Compact list of recent transactions for the dashboard */
export function RecentTransactions({
  transactions,
  categories,
  currency = 'USD',
}: RecentTransactionsProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();

  // Build a Map once per categories change instead of doing Array.find
  // on every rendered row.
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  if (transactions.length === 0) {
    return (
      <Card padding="base">
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Recent Transactions
        </Text>
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          No transactions yet. Tap + to add your first one.
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="base">
      <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
        Recent Transactions
      </Text>
      {transactions.map((txn) => {
        const category = categoryMap.get(txn.category_id);
        return (
          <Pressable
            key={txn.id}
            style={styles.item}
            onPress={() => router.push('/transaction/' + txn.id)}
            accessibilityLabel={
              (category?.name ?? 'Transaction') +
              ', ' +
              formatCurrency(txn.amount, currency)
            }
            accessibilityRole="button"
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (category?.color ?? '#636E72') + '20' },
              ]}
            >
              <Ionicons
                name={(category?.icon as keyof typeof Ionicons.glyphMap) ?? 'cash-outline'}
                size={20}
                color={category?.color ?? '#636E72'}
              />
            </View>
            <View style={styles.info}>
              <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>
                {category?.name ?? 'Unknown'}
              </Text>
              <Text style={[styles.date, { color: themeColors.textSecondary }]}>
                {formatTransactionDate(txn.timestamp)}
              </Text>
            </View>
            <Text style={[styles.amount, { color: COLORS.danger }]}>
              -{formatCurrency(txn.amount, currency)}
            </Text>
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    minHeight: 44,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  date: {
    fontSize: TYPOGRAPHY.small.fontSize,
    marginTop: 2,
  },
  amount: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
});

import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import { formatTransactionDate } from '@/utils/date';
import type { Transaction, Category } from '@/types';

interface TransactionListItemProps {
  transaction: Transaction;
  category?: Category;
  currency?: string;
  onPress: (id: string) => void;
}

/** Single transaction row for lists */
export function TransactionListItem({
  transaction,
  category,
  currency = 'USD',
  onPress,
}: TransactionListItemProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <Pressable
      style={[styles.container, { borderBottomColor: themeColors.surface }]}
      onPress={() => onPress(transaction.id)}
      accessibilityLabel={
        (category?.name ?? 'Transaction') +
        ', ' +
        formatCurrency(transaction.amount, currency)
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
        <Text style={[styles.name, { color: themeColors.textPrimary }]}>
          {category?.name ?? 'Unknown'}
        </Text>
        {transaction.note ? (
          <Text
            style={[styles.note, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {transaction.note}
          </Text>
        ) : null}
        <Text style={[styles.date, { color: themeColors.textSecondary }]}>
          {formatTransactionDate(transaction.timestamp)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: COLORS.danger }]}>
        -{formatCurrency(transaction.amount, currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    minHeight: 44,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  name: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  note: {
    fontSize: TYPOGRAPHY.small.fontSize,
    marginTop: 2,
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

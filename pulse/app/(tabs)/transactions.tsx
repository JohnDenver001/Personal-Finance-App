import { View, Text, FlatList, Pressable, Alert, StyleSheet, useColorScheme } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '@/stores/transaction-store';
import { useAuthStore } from '@/stores/auth-store';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import { formatTransactionDate } from '@/utils/date';
import type { Transaction, Category } from '@/types';

type ListRow =
  | { type: 'header'; label: string }
  | { type: 'item'; transaction: Transaction };

function monthLabel(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export default function TransactionsScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();

  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useTransactionStore((s) => s.categories);
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction);
  const currency = useAuthStore((s) => s.user?.preferences.currency ?? 'USD');

  const categoryMap = useMemo(
    () => new Map<string, Category>(categories.map((c) => [c.id, c])),
    [categories],
  );

  const listData = useMemo<ListRow[]>(() => {
    const rows: ListRow[] = [];
    let currentMonth = '';
    for (const txn of transactions) {
      const label = monthLabel(txn.timestamp);
      if (label !== currentMonth) {
        currentMonth = label;
        rows.push({ type: 'header', label });
      }
      rows.push({ type: 'item', transaction: txn });
    }
    return rows;
  }, [transactions]);

  const handleDelete = (txn: Transaction) => {
    Alert.alert(
      'Delete this transaction?',
      formatCurrency(txn.amount, currency) + ' will be removed permanently.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(txn.id),
        },
      ],
    );
  };

  const renderRow = ({ item }: { item: ListRow }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.monthHeader}>
          <Text style={[styles.monthLabel, { color: themeColors.textSecondary }]}>
            {item.label}
          </Text>
        </View>
      );
    }

    const { transaction: txn } = item;
    const category = categoryMap.get(txn.category_id);

    return (
      <Pressable
        style={[styles.row, { backgroundColor: themeColors.surface }]}
        onPress={() => router.push('/transaction/' + txn.id)}
        onLongPress={() => handleDelete(txn)}
        accessibilityLabel={
          (category?.name ?? 'Transaction') +
          ', ' +
          formatCurrency(txn.amount, currency)
        }
        accessibilityRole="button"
        accessibilityHint="Double tap to view details, hold to delete"
      >
        <View
          style={[
            styles.colorDot,
            { backgroundColor: category?.color ?? '#636E72' },
          ]}
        />
        <View style={styles.info}>
          <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>
            {category?.name ?? 'Unknown'}
          </Text>
          {txn.note ? (
            <Text
              style={[styles.note, { color: themeColors.textSecondary }]}
              numberOfLines={1}
            >
              {txn.note}
            </Text>
          ) : null}
          <Text style={[styles.date, { color: themeColors.textSecondary }]}>
            {formatTransactionDate(txn.timestamp)}
          </Text>
        </View>
        <Text style={styles.amount}>
          -{formatCurrency(txn.amount, currency)}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        Transactions
      </Text>
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={48} color={themeColors.textSecondary} />
          <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
            No transactions yet. Tap + to record your first one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) =>
            item.type === 'header' ? 'header-' + item.label : item.transaction.id
          }
          renderItem={renderRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.hero.fontSize,
    fontWeight: '700',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  listContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['4xl'],
  },
  monthHeader: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  monthLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  note: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  date: {
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  amount: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    textAlign: 'center',
  },
});

import { ScrollView, RefreshControl, View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RemainingBudget } from '@/components/dashboard/remaining-budget';
import { DailySafeToSpend } from '@/components/dashboard/daily-safe-to-spend';
import { SpendingProgressBar } from '@/components/dashboard/spending-progress-bar';
import { DisciplineScore } from '@/components/dashboard/discipline-score';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { useBudgetStore, useBudgetDerived } from '@/stores/budget-store';
import { useTransactionStore, useTotalSpent, useRecentTransactions } from '@/stores/transaction-store';
import { useAuthStore } from '@/stores/auth-store';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { APP_CONFIG } from '@/constants/config';

/**
 * Dashboard screen  PRD Section 2, Home Dashboard.
 * Displays remaining budget, safe-to-spend, progress bar, discipline score,
 * and recent transactions. Pull-to-refresh reloads budget data.
 */
export default function DashboardScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const user = useAuthStore((s) => s.user);
  const monthlyBudgetLimit = useBudgetStore((s) => s.monthlyBudgetLimit);
  const totalSpent = useTotalSpent();
  const budget = useBudgetDerived(totalSpent);
  const recentTransactions = useRecentTransactions(APP_CONFIG.RECENT_TRANSACTION_COUNT);
  const categories = useTransactionStore((s) => s.categories);
  const currency = user?.preferences.currency ?? 'USD';

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // MVP: In production, fetch fresh data from backend
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        <RemainingBudget
          remaining={budget.remainingBudget}
          percentSpent={budget.percentSpent}
          currency={currency}
        />

        <View style={styles.row}>
          <View style={styles.halfCard}>
            <DailySafeToSpend
              amount={budget.dailySafeToSpend}
              currency={currency}
            />
          </View>
          <View style={styles.halfCard}>
            <DisciplineScore score={budget.disciplineScore} />
          </View>
        </View>

        <SpendingProgressBar
          spent={totalSpent}
          limit={monthlyBudgetLimit}
          currency={currency}
        />

        <RecentTransactions
          transactions={recentTransactions}
          categories={categories}
          currency={currency}
        />
      </ScrollView>

      {/* Quick Add FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/(tabs)/add')}
        accessibilityLabel="Add transaction"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    padding: SPACING.base,
    gap: SPACING.base,
    paddingBottom: SPACING['4xl'],
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  halfCard: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

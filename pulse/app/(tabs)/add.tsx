import { StyleSheet, useColorScheme, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Header } from '@/components/common/header';
import { TransactionForm } from '@/components/transaction/transaction-form';
import { useTransactionStore } from '@/stores/transaction-store';
import { COLORS } from '@/constants/colors';

/**
 * Add Transaction screen  PRD Section 2, Daily Usage.
 * CRITICAL: Entire flow from opening to saving must complete in  3 taps.
 * Tap 1: Enter amount  Tap 2: Select category  Tap 3: Save
 */
export default function AddTransactionScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const { addTransaction, categories } = useTransactionStore();

  const handleSubmit = async (data: {
    amount: number;
    category_id: string;
    note?: string;
  }) => {
    // Optimistic UI update — totalSpent is derived from transactionStore,
    // so budget components re-compute automatically without a separate sync.
    addTransaction({
      amount: data.amount,
      category_id: data.category_id,
      timestamp: new Date().toISOString(),
      note: data.note,
    });

    // Success haptic feedback — expo-haptics is not available on web
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Alert.alert is a no-op on web; use window.alert as an explicit fallback.
    if (Platform.OS === 'web') {
      window.alert('Transaction saved successfully!');
      router.back();
    } else {
      Alert.alert('Saved!', 'Transaction added successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Header title="Add Transaction" showBack />
      <TransactionForm
        categories={categories}
        onSubmit={handleSubmit}
        submitLabel="Save Transaction"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});

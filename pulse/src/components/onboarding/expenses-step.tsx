import { View, Text, Pressable, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/colors';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import type { RecurringExpense } from '@/types';

interface ExpensesStepProps {
  initialExpenses?: RecurringExpense[];
  initialSavings?: number;
  initialDebt?: number;
  onNext: (data: {
    recurring_expenses: RecurringExpense[];
    current_savings: number;
    debt: number;
  }) => void;
  onBack: () => void;
}

/** Onboarding Step 2: Recurring expenses, savings, and debt */
export function ExpensesStep({
  initialExpenses = [],
  initialSavings = 0,
  initialDebt = 0,
  onNext,
  onBack,
}: ExpensesStepProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  const [expenses, setExpenses] = useState<RecurringExpense[]>(
    initialExpenses.length > 0 ? initialExpenses : [{ name: '', amount: 0 }],
  );
  const [savings, setSavings] = useState(initialSavings.toString());
  const [debt, setDebt] = useState(initialDebt.toString());
  const [error, setError] = useState<string | null>(null);

  const addExpense = () => {
    setExpenses((prev) => [...prev, { name: '', amount: 0 }]);
  };

  const updateExpense = (index: number, field: 'name' | 'amount', value: string) => {
    setExpenses((prev) =>
      prev.map((e, i) =>
        i === index
          ? { ...e, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
          : e,
      ),
    );
  };

  const removeExpense = (index: number) => {
    if (expenses.length <= 1) return;
    setExpenses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const validExpenses = expenses.filter((e) => e.name.trim() && e.amount > 0);
    if (validExpenses.length === 0) {
      setError('Add at least one recurring expense');
      return;
    }
    setError(null);
    onNext({
      recurring_expenses: validExpenses,
      current_savings: parseFloat(savings) || 0,
      debt: parseFloat(debt) || 0,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        Your recurring expenses
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
        Add your fixed monthly expenses like rent, subscriptions, and bills.
      </Text>

      {expenses.map((expense, index) => (
        <View key={index} style={styles.expenseRow}>
          <View style={styles.expenseInputs}>
            <View style={styles.nameInput}>
              <Input
                placeholder="Expense name"
                value={expense.name}
                onChangeText={(val) => updateExpense(index, 'name', val)}
              />
            </View>
            <View style={styles.amountInput}>
              <Input
                placeholder="Amount"
                value={expense.amount > 0 ? expense.amount.toString() : ''}
                onChangeText={(val) => updateExpense(index, 'amount', val)}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          {expenses.length > 1 ? (
            <Pressable
              onPress={() => removeExpense(index)}
              style={styles.removeButton}
              accessibilityLabel="Remove expense"
            >
              <Ionicons name="close-circle" size={24} color={COLORS.danger} />
            </Pressable>
          ) : null}
        </View>
      ))}

      <Pressable onPress={addExpense} style={styles.addButton} accessibilityLabel="Add another expense">
        <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Add another expense</Text>
      </Pressable>

      <View style={styles.separator} />

      <Input
        label="Current Savings"
        placeholder="0"
        value={savings !== '0' ? savings : ''}
        onChangeText={setSavings}
        keyboardType="decimal-pad"
      />

      <Input
        label="Debt (optional)"
        placeholder="0"
        value={debt !== '0' ? debt : ''}
        onChangeText={setDebt}
        keyboardType="decimal-pad"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <Button title="Back" onPress={onBack} variant="ghost" />
        <Button title="Continue" onPress={handleNext} size="lg" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.xl },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.body.lineHeight,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  expenseInputs: { flex: 1, flexDirection: 'row', gap: SPACING.sm },
  nameInput: { flex: 2 },
  amountInput: { flex: 1 },
  removeButton: {
    paddingTop: SPACING.lg,
    paddingLeft: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    minHeight: 44,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: SPACING.xl,
  },
  error: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginBottom: SPACING.base,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
});

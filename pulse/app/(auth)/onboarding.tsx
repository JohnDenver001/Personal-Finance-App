import { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StepIndicator } from '@/components/onboarding/step-indicator';
import { IncomeStep } from '@/components/onboarding/income-step';
import { ExpensesStep } from '@/components/onboarding/expenses-step';
import { BudgetStep } from '@/components/onboarding/budget-step';
import { FocusStep } from '@/components/onboarding/focus-step';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { useBudgetStore } from '@/stores/budget-store';
import { useTransactionStore } from '@/stores/transaction-store';
import { generateOnboardingInsight } from '@/services/ai-service';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';
import type { OnboardingData, OnboardingInsight } from '@/types';

const TOTAL_STEPS = 4;

/** Onboarding wizard  PRD Section 2, Onboarding Steps 2-4 + AI generation */
export default function OnboardingScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const { setOnboardingData, completeOnboarding, onboardingData } = useAuthStore();
  const userId = useAuthStore((s) => s.user?.id ?? 'anonymous');
  const { setBudget } = useBudgetStore();
  const { setCategories } = useTransactionStore();

  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insight, setInsight] = useState<OnboardingInsight | null>(null);

  const handleIncomeNext = (income: number) => {
    setOnboardingData({ monthly_income: income });
    setStep(2);
  };

  const handleExpensesNext = (data: {
    recurring_expenses: { name: string; amount: number }[];
    current_savings: number;
    debt: number;
  }) => {
    setOnboardingData(data);
    setStep(3);
  };

  const handleBudgetNext = (limit: number) => {
    setOnboardingData({ monthly_budget_limit: limit });
    setStep(4);
  };

  const handleFocusNext = async (focus: 'strict' | 'balanced' | 'flexible') => {
    setOnboardingData({ financial_focus: focus });
    setIsAnalyzing(true);

    try {
      const fullData: OnboardingData = {
        monthly_income: onboardingData.monthly_income ?? 0,
        recurring_expenses: onboardingData.recurring_expenses ?? [],
        current_savings: onboardingData.current_savings ?? 0,
        debt: onboardingData.debt ?? 0,
        monthly_budget_limit: onboardingData.monthly_budget_limit ?? 0,
        financial_focus: focus,
      };

      const result = await generateOnboardingInsight(fullData);
      setInsight(result);
    } catch {
      setInsight({
        suggested_categories: [],
        overspending_risk: 'medium',
        initial_insight: 'We could not analyze your data right now. You can still proceed.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    setBudget(
      onboardingData.monthly_income ?? 0,
      onboardingData.monthly_budget_limit ?? 0,
    );

    if (insight?.suggested_categories) {
      const categories = insight.suggested_categories.map((cat, i) => ({
        id: 'cat-' + (i + 1),
        user_id: userId,
        name: cat.name,
        monthly_budget_allocation: cat.monthly_budget_allocation,
        icon: cat.icon,
        color: cat.color,
      }));
      setCategories(categories);
    }

    completeOnboarding();
    router.replace('/(tabs)');
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <LoadingSpinner
          message="Pulse is analyzing your finances..."
          fullScreen
        />
      </SafeAreaView>
    );
  }

  if (insight) {
    const riskColor =
      insight.overspending_risk === 'high'
        ? COLORS.danger
        : insight.overspending_risk === 'medium'
          ? COLORS.warning
          : COLORS.success;

    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
        <View style={styles.resultContainer}>
          <Text style={[styles.resultTitle, { color: themeColors.textPrimary }]}>
            Your Financial Snapshot
          </Text>

          <Card padding="base" style={styles.resultCard}>
            <Text style={[styles.resultLabel, { color: themeColors.textSecondary }]}>
              Overspending Risk
            </Text>
            <Badge
              label={insight.overspending_risk.toUpperCase()}
              color={riskColor}
            />
          </Card>

          <Card padding="base" style={styles.resultCard}>
            <Text style={[styles.resultLabel, { color: themeColors.textSecondary }]}>
              Insight
            </Text>
            <Text style={[styles.resultText, { color: themeColors.textPrimary }]}>
              {insight.initial_insight}
            </Text>
          </Card>

          {insight.suggested_categories.length > 0 ? (
            <Card padding="base" style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: themeColors.textSecondary }]}>
                Suggested Budget Breakdown
              </Text>
              {insight.suggested_categories.map((cat) => (
                <View key={cat.name} style={styles.categoryRow}>
                  <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>
                    {cat.name}
                  </Text>
                  <Text style={[styles.categoryAmount, { color: COLORS.primary }]}>
                    {formatCurrency(cat.monthly_budget_allocation)}
                  </Text>
                </View>
              ))}
            </Card>
          ) : null}

          <Button
            title="Looks Good  Let's Go!"
            onPress={handleConfirm}
            fullWidth
            size="lg"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />

      {step === 1 && (
        <IncomeStep
          initialValue={onboardingData.monthly_income}
          onNext={handleIncomeNext}
        />
      )}
      {step === 2 && (
        <ExpensesStep
          initialExpenses={onboardingData.recurring_expenses}
          initialSavings={onboardingData.current_savings}
          initialDebt={onboardingData.debt}
          onNext={handleExpensesNext}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <BudgetStep
          monthlyIncome={onboardingData.monthly_income ?? 0}
          initialValue={onboardingData.monthly_budget_limit}
          onNext={handleBudgetNext}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <FocusStep
          initialValue={onboardingData.financial_focus}
          onNext={handleFocusNext}
          onBack={() => setStep(3)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  resultContainer: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  resultCard: {
    marginBottom: SPACING.base,
  },
  resultLabel: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
});

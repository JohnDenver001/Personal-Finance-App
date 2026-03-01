import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';

interface BudgetStepProps {
  monthlyIncome: number;
  initialValue?: number;
  onNext: (limit: number) => void;
  onBack: () => void;
}

/** Onboarding Step 3: Set monthly budget limit */
export function BudgetStep({
  monthlyIncome,
  initialValue,
  onNext,
  onBack,
}: BudgetStepProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  const budgetSchema = z.object({
    budget_limit: z.string().refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0 && num <= monthlyIncome;
      },
      {
        message:
          'Budget must be greater than 0 and not exceed your income (' +
          formatCurrency(monthlyIncome) +
          ')',
      },
    ),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget_limit: initialValue?.toString() ?? '',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        Set your monthly budget
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
        How much do you want to allow yourself to spend each month? Your income
        is {formatCurrency(monthlyIncome)}.
      </Text>

      <Controller
        control={control}
        name="budget_limit"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Monthly Budget Limit"
            placeholder="e.g. 3000"
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            error={errors.budget_limit?.message}
            autoFocus
          />
        )}
      />

      <View style={styles.buttons}>
        <Button title="Back" onPress={onBack} variant="ghost" />
        <Button
          title="Continue"
          onPress={handleSubmit((data) =>
            onNext(parseFloat(data.budget_limit)),
          )}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginBottom: SPACING['2xl'],
    lineHeight: TYPOGRAPHY.body.lineHeight,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
  },
});

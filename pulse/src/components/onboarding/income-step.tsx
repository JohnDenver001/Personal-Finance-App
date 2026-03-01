import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

const incomeSchema = z.object({
  monthly_income: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Enter a valid income amount greater than 0' },
  ),
});

interface IncomeStepProps {
  initialValue?: number;
  onNext: (income: number) => void;
}

/** Onboarding Step 1: Monthly income input */
export function IncomeStep({ initialValue, onNext }: IncomeStepProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      monthly_income: initialValue?.toString() ?? '',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        What is your monthly income?
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
        This helps us calculate how much you can spend safely.
      </Text>

      <Controller
        control={control}
        name="monthly_income"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Monthly Income"
            placeholder="e.g. 5000"
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            error={errors.monthly_income?.message}
            autoFocus
          />
        )}
      />

      <Button
        title="Continue"
        onPress={handleSubmit((data) => onNext(parseFloat(data.monthly_income)))}
        fullWidth
        size="lg"
      />
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
});

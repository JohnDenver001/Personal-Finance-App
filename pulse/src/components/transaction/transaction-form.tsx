import { View, StyleSheet, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CategoryPicker } from './category-picker';
import { APP_CONFIG } from '@/constants/config';
import { SPACING } from '@/theme/spacing';
import type { Category } from '@/types';

const transactionSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Enter a valid amount greater than 0' },
  ),
  category_id: z.string().min(1, 'Please select a category'),
  note: z.string().max(APP_CONFIG.MAX_NOTE_LENGTH, 'Note is too long').optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  categories: Category[];
  suggestedCategoryId?: string;
  initialValues?: { amount?: string; category_id?: string; note?: string };
  onSubmit: (data: { amount: number; category_id: string; note?: string }) => void | Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

/** Transaction form with amount, category picker, and optional note */
export function TransactionForm({
  categories,
  suggestedCategoryId,
  initialValues,
  onSubmit,
  loading = false,
  submitLabel = 'Save',
}: TransactionFormProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialValues?.amount ?? '',
      category_id: initialValues?.category_id ?? '',
      note: initialValues?.note ?? '',
    },
  });

  const onFormSubmit = async (data: TransactionFormData) => {
    await onSubmit({
      amount: parseFloat(data.amount),
      category_id: data.category_id,
      note: data.note || undefined,
    });
    // Reset all fields to defaults so the form is blank immediately after save
    // and remains blank if the user navigates away and returns to this tab.
    reset({ amount: '', category_id: '', note: '' });
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Amount"
            placeholder="0.00"
            value={value}
            onChangeText={onChange}
            keyboardType="decimal-pad"
            error={errors.amount?.message}
            autoFocus
            accessibilityLabel="Transaction amount"
          />
        )}
      />

      <Controller
        control={control}
        name="category_id"
        render={({ field: { value } }) => (
          <View>
            <CategoryPicker
              categories={categories}
              selected={value || null}
              onSelect={(id) => setValue('category_id', id, { shouldValidate: true })}
              suggestedId={suggestedCategoryId}
            />
            {errors.category_id ? (
              <View style={styles.errorContainer}>
                <Input
                  value=""
                  onChangeText={() => {}}
                  error={errors.category_id.message}
                />
              </View>
            ) : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Note (optional)"
            placeholder="What was this for?"
            value={value ?? ''}
            onChangeText={onChange}
            maxLength={APP_CONFIG.MAX_NOTE_LENGTH}
            error={errors.note?.message}
            accessibilityLabel="Transaction note"
          />
        )}
      />

      <Button
        title={submitLabel}
        onPress={handleSubmit(onFormSubmit)}
        loading={loading}
        fullWidth
        size="lg"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.base,
  },
  errorContainer: {
    marginTop: -SPACING.sm,
  },
});

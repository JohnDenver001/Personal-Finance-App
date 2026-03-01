import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { COLORS } from '@/constants/colors';
import { FINANCIAL_FOCUS_OPTIONS } from '@/constants/categories';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

type FocusValue = 'strict' | 'balanced' | 'flexible';

interface FocusStepProps {
  initialValue?: FocusValue;
  onNext: (focus: FocusValue) => void;
  onBack: () => void;
}

/** Onboarding Step 4: Select financial focus mode */
export function FocusStep({ initialValue, onNext, onBack }: FocusStepProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const [selected, setSelected] = useState<FocusValue | null>(
    initialValue ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) {
      setError('Please select a financial focus');
      return;
    }
    setError(null);
    onNext(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        Choose your financial focus
      </Text>
      <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
        This determines how closely Pulse monitors your spending.
      </Text>

      {FINANCIAL_FOCUS_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              {
                borderColor: isSelected ? COLORS.primary : themeColors.surface,
                backgroundColor: isSelected
                  ? COLORS.primary + '10'
                  : 'transparent',
              },
            ]}
            onPress={() => {
              setSelected(option.value);
              setError(null);
            }}
            accessibilityLabel={option.label + ': ' + option.description}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
          >
            <Ionicons
              name={option.icon as keyof typeof Ionicons.glyphMap}
              size={28}
              color={isSelected ? COLORS.primary : themeColors.textSecondary}
            />
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionLabel,
                  { color: isSelected ? COLORS.primary : themeColors.textPrimary },
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[styles.optionDescription, { color: themeColors.textSecondary }]}
              >
                {option.description}
              </Text>
            </View>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
            ) : null}
          </Pressable>
        );
      })}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <Button title="Back" onPress={onBack} variant="ghost" />
        <Button title="Finish Setup" onPress={handleNext} size="lg" />
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
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: RADIUS.card,
    borderWidth: 2,
    marginBottom: SPACING.md,
    minHeight: 44,
  },
  optionText: {
    flex: 1,
    marginLeft: SPACING.base,
  },
  optionLabel: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: 2,
  },
  error: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.sm,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING['2xl'],
  },
});

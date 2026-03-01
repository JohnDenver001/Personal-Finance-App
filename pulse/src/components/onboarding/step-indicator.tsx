import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

/** Step progress indicator for onboarding wizard */
export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: themeColors.textSecondary }]}>
        Step {currentStep} of {totalSteps}
      </Text>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i + 1 <= currentStep
                    ? COLORS.primary
                    : themeColors.surface,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.base,
  },
  text: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

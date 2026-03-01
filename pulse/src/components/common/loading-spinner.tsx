import { View, ActivityIndicator, Text, StyleSheet, useColorScheme } from 'react-native';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

/** Loading indicator with optional message */
export function LoadingSpinner({
  message,
  size = 'large',
  fullScreen = false,
}: LoadingSpinnerProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      {message ? (
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['2xl'],
  },
  fullScreen: {
    flex: 1,
  },
  message: {
    marginTop: SPACING.base,
    fontSize: TYPOGRAPHY.body.fontSize,
    textAlign: 'center',
  },
});

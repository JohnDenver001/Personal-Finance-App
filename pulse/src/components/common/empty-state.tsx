import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

/** Empty state placeholder with icon, title, and description */
export function EmptyState({ icon, title, message }: EmptyStateProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color={themeColors.textSecondary} />
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: themeColors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING['3xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginTop: SPACING.base,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body.lineHeight,
  },
});

import { View, Text, StyleSheet } from 'react-native';
import { RADIUS, SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface BadgeProps {
  label: string;
  color: string;
  textColor?: string;
}

/** Small colored badge for tags, categories, and status indicators */
export function Badge({ label, color, textColor = '#FFFFFF' }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.button,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: TYPOGRAPHY.small.fontSize,
    fontWeight: '600',
  },
});

import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatRelativeTime } from '@/utils/date';
import type { Insight } from '@/types';

const INSIGHT_ICONS: Record<Insight['type'], keyof typeof Ionicons.glyphMap> = {
  weekly: 'calendar-outline',
  monthly: 'stats-chart-outline',
  alert: 'warning-outline',
  pattern: 'analytics-outline',
};

const INSIGHT_COLORS: Record<Insight['type'], string> = {
  weekly: COLORS.primary,
  monthly: COLORS.success,
  alert: COLORS.warning,
  pattern: '#45B7D1',
};

interface InsightCardProps {
  insight: Insight;
}

/** Styled insight card with type-specific icon and color */
export function InsightCard({ insight }: InsightCardProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const iconName = INSIGHT_ICONS[insight.type];
  const iconColor = INSIGHT_COLORS[insight.type];

  return (
    <Card padding="base" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <Text style={[styles.time, { color: themeColors.textSecondary }]}>
          {formatRelativeTime(insight.created_at)}
        </Text>
      </View>
      <Text style={[styles.text, { color: themeColors.textPrimary }]}>
        {insight.generated_text}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  text: {
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
  },
});

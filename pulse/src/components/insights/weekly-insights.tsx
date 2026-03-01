import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { InsightCard } from './insight-card';
import { EmptyState } from '@/components/common/empty-state';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import type { Insight } from '@/types';

interface WeeklyInsightsProps {
  insights: Insight[];
}

/** Weekly insights section showing spending patterns and suggestions */
export function WeeklyInsights({ insights }: WeeklyInsightsProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  if (insights.length === 0) {
    return (
      <EmptyState
        icon="calendar-outline"
        title="No weekly insights yet"
        message="Keep logging your transactions and Pulse will generate personalized insights every week."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: themeColors.textPrimary }]}>
        This Week
      </Text>
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.base,
  },
  heading: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.base,
  },
});

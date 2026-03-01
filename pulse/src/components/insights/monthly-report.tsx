import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { InsightCard } from './insight-card';
import { EmptyState } from '@/components/common/empty-state';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import type { Insight } from '@/types';

interface MonthlyReportProps {
  insights: Insight[];
}

/** Monthly report section showing budget performance and trends */
export function MonthlyReport({ insights }: MonthlyReportProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  if (insights.length === 0) {
    return (
      <EmptyState
        icon="stats-chart-outline"
        title="No monthly report yet"
        message="Your first monthly report will be available at the end of the month."
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: themeColors.textPrimary }]}>
        Monthly Report
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

import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/common/empty-state';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import type { PatternData } from '@/types';

interface PatternVisualizationsProps {
  patterns: PatternData | null;
}

/** Pattern visualizations section: velocity, streaks, risk alerts */
export function PatternVisualizations({ patterns }: PatternVisualizationsProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  if (!patterns) {
    return (
      <EmptyState
        icon="analytics-outline"
        title="Not enough data yet"
        message="Log transactions for at least a week to see your spending patterns."
      />
    );
  }

  const velocityStatus =
    patterns.velocity_ratio <= 1 ? 'On Track' : 'Overspending';
  const velocityColor =
    patterns.velocity_ratio <= 1 ? COLORS.success : COLORS.danger;

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: themeColors.textPrimary }]}>
        Patterns
      </Text>

      {/* Spending Velocity */}
      <Card padding="base" style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="speedometer-outline" size={24} color={velocityColor} />
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>
              Spending Speed
            </Text>
            <Text style={[styles.cardValue, { color: velocityColor }]}>
              {velocityStatus} ({patterns.velocity_ratio.toFixed(1)}x)
            </Text>
          </View>
        </View>
      </Card>

      {/* Streaks */}
      <Card padding="base" style={styles.card}>
        <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>
          Streaks
        </Text>
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <Ionicons name="flame-outline" size={20} color={COLORS.warning} />
            <Text style={[styles.streakValue, { color: themeColors.textPrimary }]}>
              {patterns.streaks.logging_streak}
            </Text>
            <Text style={[styles.streakLabel, { color: themeColors.textSecondary }]}>
              days logging
            </Text>
          </View>
          <View style={styles.streakItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
            <Text style={[styles.streakValue, { color: themeColors.textPrimary }]}>
              {patterns.streaks.within_budget_streak}
            </Text>
            <Text style={[styles.streakLabel, { color: themeColors.textSecondary }]}>
              days in budget
            </Text>
          </View>
        </View>
      </Card>

      {/* Risk Alerts */}
      {patterns.risk_alerts.length > 0 ? (
        <Card padding="base" style={styles.card}>
          <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>
            Risk Alerts
          </Text>
          {patterns.risk_alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <Ionicons
                name="warning"
                size={16}
                color={
                  alert.severity === 'high'
                    ? COLORS.danger
                    : alert.severity === 'medium'
                      ? COLORS.warning
                      : COLORS.primary
                }
              />
              <Text style={[styles.alertText, { color: themeColors.textPrimary }]}>
                {alert.message}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}
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
  card: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  cardValue: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '500',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
  },
  streakItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  streakValue: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  alertText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    flex: 1,
  },
});

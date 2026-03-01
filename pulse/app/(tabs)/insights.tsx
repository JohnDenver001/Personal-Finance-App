import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WeeklyInsights } from '@/components/insights/weekly-insights';
import { MonthlyReport } from '@/components/insights/monthly-report';
import { PatternVisualizations } from '@/components/insights/pattern-visualizations';
import { useInsightStore } from '@/stores/insight-store';
import { COLORS } from '@/constants/colors';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

type InsightTab = 'weekly' | 'monthly' | 'patterns';

/**
 * Insights screen  PRD Sections 2 & 3.
 * Tabbed view: Weekly Insights, Monthly Report, Pattern Visualizations.
 */
export default function InsightsScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const [activeTab, setActiveTab] = useState<InsightTab>('weekly');

  const weeklyInsights = useInsightStore((s) => s.weeklyInsights);
  const monthlyInsights = useInsightStore((s) => s.monthlyInsights);
  const patterns = useInsightStore((s) => s.patterns);

  const tabs: { key: InsightTab; label: string }[] = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'patterns', label: 'Patterns' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        Insights
      </Text>

      <View style={[styles.tabBar, { backgroundColor: themeColors.surface }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={[
                styles.tab,
                isActive && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label + ' insights'}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? COLORS.primary
                      : themeColors.textSecondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'weekly' && <WeeklyInsights insights={weeklyInsights} />}
        {activeTab === 'monthly' && <MonthlyReport insights={monthlyInsights} />}
        {activeTab === 'patterns' && <PatternVisualizations patterns={patterns} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  title: {
    fontSize: TYPOGRAPHY.hero.fontSize,
    fontWeight: '700',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: SPACING.base,
    borderRadius: RADIUS.card,
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.input,
    minHeight: 44,
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary + '15',
  },
  tabText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
});

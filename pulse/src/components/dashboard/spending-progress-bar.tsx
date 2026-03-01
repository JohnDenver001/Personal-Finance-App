import { View, Text, StyleSheet, useColorScheme, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { COLORS, getBudgetHealthColor } from '@/constants/colors';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import { formatCurrency } from '@/utils/currency';

interface SpendingProgressBarProps {
  spent: number;
  limit: number;
  currency?: string;
}

/** Animated spending progress bar with color transitions */
export function SpendingProgressBar({
  spent,
  limit,
  currency = 'USD',
}: SpendingProgressBarProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const healthColor = getBudgetHealthColor(percent);
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent, animWidth]);

  return (
    <Card padding="base">
      <View style={styles.header}>
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>
          Spending Progress
        </Text>
        <Text style={[styles.percent, { color: healthColor }]}>
          {Math.round(percent)}%
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: themeColors.surface }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: healthColor,
              width: animWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          {formatCurrency(spent, currency)} spent
        </Text>
        <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
          of {formatCurrency(limit, currency)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
  },
  percent: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '700',
  },
  track: {
    height: 12,
    borderRadius: RADIUS.button,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.button,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  footerText: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
});

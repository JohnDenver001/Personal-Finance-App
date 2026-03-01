import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Card } from '@/components/ui/card';
import { COLORS, getBudgetHealthColor } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface DisciplineScoreProps {
  score: number;
}

/** Circular progress indicator showing financial discipline score (0-100) */
export function DisciplineScore({ score }: DisciplineScoreProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const scoreColor = getBudgetHealthColor(100 - score);

  return (
    <Card padding="base">
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>
        Financial Discipline
      </Text>
      <View style={styles.scoreContainer}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={themeColors.surface}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            rotation="-90"
            origin={size / 2 + ',' + size / 2}
          />
        </Svg>
        <View style={styles.scoreTextContainer}>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}</Text>
          <Text style={[styles.scoreMax, { color: themeColors.textSecondary }]}>
            / 100
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: TYPOGRAPHY.small.fontSize,
  },
});

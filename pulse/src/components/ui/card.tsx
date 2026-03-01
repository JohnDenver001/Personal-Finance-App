import { View, StyleSheet, useColorScheme } from 'react-native';
import type { ReactNode } from 'react';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACING } from '@/theme/spacing';

interface CardProps {
  children: ReactNode;
  padding?: keyof typeof SPACING;
  style?: object;
}

/** Reusable card container with theme-aware background and shadow */
export function Card({ children, padding = 'base', style }: CardProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: scheme === 'dark' ? themeColors.surface : '#FFFFFF',
          shadowColor: themeColors.cardShadow,
        },
        { padding: SPACING[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.card,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
});

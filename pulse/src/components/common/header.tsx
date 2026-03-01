import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    label: string;
  };
}

/** Screen header with optional back button and right action */
export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={[styles.container, { borderBottomColor: themeColors.surface }]}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={themeColors.textPrimary}
            />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text
        style={[styles.title, { color: themeColors.textPrimary }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={styles.right}>
        {rightAction ? (
          <Pressable
            onPress={rightAction.onPress}
            style={styles.actionButton}
            accessibilityLabel={rightAction.label}
            accessibilityRole="button"
          >
            <Ionicons
              name={rightAction.icon}
              size={24}
              color={COLORS.primary}
            />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  left: {
    width: 44,
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  actionButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 44,
  },
});

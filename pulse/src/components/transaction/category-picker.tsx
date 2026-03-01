import { View, Text, Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { SPACING, RADIUS } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';
import type { Category } from '@/types';

interface CategoryPickerProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string) => void;
  suggestedId?: string;
}

/** Scrollable grid of category icons for transaction entry */
export function CategoryPicker({
  categories,
  selected,
  onSelect,
  suggestedId,
}: CategoryPickerProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: themeColors.textSecondary }]}>
        Category
      </Text>
      {categories.length === 0 ? (
        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
          No categories available.
        </Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {categories.map((cat) => {
            const isSelected = selected === cat.id;
            const isSuggested = suggestedId === cat.id && !selected;

            return (
              <Pressable
                key={cat.id}
                style={[
                  styles.item,
                  isSelected && { borderColor: COLORS.primary, borderWidth: 2 },
                  isSuggested && {
                    borderColor: COLORS.primary,
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                  },
                ]}
                onPress={() => onSelect(cat.id)}
                accessibilityLabel={'Select ' + cat.name + ' category'}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: (cat.color ?? '#636E72') + '20' },
                  ]}
                >
                  <Ionicons
                    name={(cat.icon as keyof typeof Ionicons.glyphMap) ?? 'ellipsis-horizontal-outline'}
                    size={24}
                    color={cat.color ?? '#636E72'}
                  />
                </View>
                <Text
                  style={[styles.name, { color: themeColors.textPrimary }]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
                {isSuggested ? (
                  <Text style={styles.suggested}>Suggested</Text>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  item: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: RADIUS.card,
    minWidth: 72,
    minHeight: 44,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: TYPOGRAPHY.small.fontSize,
    fontWeight: '500',
    textAlign: 'center',
  },
  suggested: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    paddingVertical: SPACING.sm,
  },
});

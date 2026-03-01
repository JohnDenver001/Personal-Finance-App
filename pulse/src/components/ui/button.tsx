import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

/** Reusable button component with multiple variants and loading state */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeMap = { sm: styles.size_sm, md: styles.size_md, lg: styles.size_lg } as const;
  const textVariantMap = { primary: styles.text_primary, secondary: styles.text_secondary, outline: styles.text_outline, ghost: styles.text_ghost } as const;
  const textSizeMap = { sm: styles.textSize_sm, md: styles.textSize_md, lg: styles.textSize_lg } as const;

  const buttonStyles = [
    styles.base,
    styles[variant],
    sizeMap[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textStyles = [
    styles.text,
    textVariantMap[variant],
    textSizeMap[size],
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !isDisabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : COLORS.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: '#E8E6FF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
  },
  size_md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  size_lg: {
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING['2xl'],
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  text_secondary: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  text_outline: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  text_ghost: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  textSize_sm: {
    fontSize: TYPOGRAPHY.caption.fontSize,
  },
  textSize_md: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  textSize_lg: {
    fontSize: TYPOGRAPHY.heading.fontSize,
  },
});

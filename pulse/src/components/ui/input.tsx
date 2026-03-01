import { View, TextInput, Text, StyleSheet, useColorScheme } from 'react-native';
import { forwardRef } from 'react';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  maxLength?: number;
  multiline?: boolean;
  accessibilityLabel?: string;
}

/** Themed text input with label and error display */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoFocus,
    maxLength,
    multiline,
    accessibilityLabel,
  },
  ref,
) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            backgroundColor: themeColors.surface,
            color: themeColors.textPrimary,
            borderColor: error ? COLORS.danger : themeColors.surface,
          },
          multiline && styles.multiline,
        ]}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoFocus={autoFocus}
        maxLength={maxLength}
        multiline={multiline}
        accessibilityLabel={accessibilityLabel ?? label}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.base,
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  input: {
    borderRadius: RADIUS.input,
    borderWidth: 1.5,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.base,
    fontSize: TYPOGRAPHY.body.fontSize,
    minHeight: 48,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  error: {
    color: COLORS.danger,
    fontSize: TYPOGRAPHY.small.fontSize,
    marginTop: SPACING.xs,
  },
});

import { View, Text, Pressable, StyleSheet, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { COLORS } from '@/constants/colors';
import { SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

const registerSchema = z
  .object({
    email: z
      .string()
      .email('Enter a valid email address')
      .max(254, 'Email address is too long'),
    // OWASP ASVS 2.1: ≥8 chars, no composition rules beyond this minimum.
    // The regex below enforces at least one letter and one digit so that
    // all-space or trivially guessable passwords are rejected.
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be 128 characters or fewer')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        'Password must contain at least one letter and one number',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/** Register screen with email/password/confirm  PRD Section 2, Onboarding Step 1 */
export default function RegisterScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signUp(data.email, data.password);
      router.replace('/(auth)/onboarding');
    } catch {
      setError('email', { message: 'Registration failed. Try again.' });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            Start your journey to better spending habits
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="At least 8 characters"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </View>

        <Pressable
          onPress={() => router.back()}
          style={styles.link}
          accessibilityRole="link"
          accessibilityLabel="Sign in instead"
        >
          <Text style={[styles.linkText, { color: themeColors.textSecondary }]}>
            Already have an account?{' '}
            <Text style={styles.linkHighlight}>Sign in</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  header: {
    marginBottom: SPACING['2xl'],
  },
  title: {
    fontSize: TYPOGRAPHY.hero.fontSize,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginTop: SPACING.sm,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  link: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  linkHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

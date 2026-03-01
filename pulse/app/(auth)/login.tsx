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

const loginSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .max(254, 'Email address is too long'),
  // NIST SP 800-63B / OWASP ASVS 2.1.1: minimum 8 characters
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/** Login screen with email/password form  PRD Section 2, Onboarding Step 1 */
export default function LoginScreen() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (err) {
      // Surface lockout message directly; fall back to generic credential error.
      const message =
        err instanceof Error && err.message.startsWith('Too many')
          ? err.message
          : 'Invalid email or password';
      setError('password', { message });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: COLORS.primary }]}>Pulse</Text>
          <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
            Take control of your spending
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
                accessibilityLabel="Email address"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
                error={errors.password?.message}
                accessibilityLabel="Password"
              />
            )}
          />

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
          />
        </View>

        <Pressable
          onPress={() => router.push('/(auth)/register')}
          style={styles.link}
          accessibilityRole="link"
          accessibilityLabel="Create an account"
        >
          <Text style={[styles.linkText, { color: themeColors.textSecondary }]}>
            No account yet?{' '}
            <Text style={styles.linkHighlight}>Sign up</Text>
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
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  tagline: {
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

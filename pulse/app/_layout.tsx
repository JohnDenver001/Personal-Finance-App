import { useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { useAuthStore } from '@/stores/auth-store';
import { COLORS } from '@/constants/colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/** Root layout  wraps the app in providers and handles auth-based routing */
export default function RootLayout() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);
  const checkSession = useAuthStore((s) => s.checkSession);

  // Validate session expiry whenever the component mounts (app foregrounded).
  // This is a client-side safety net; real session validation must happen
  // server-side on every authenticated API request.
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !hasCompletedOnboarding && (segments as string[])[1] !== 'onboarding') {
      router.replace('/(auth)/onboarding');
    } else if (isAuthenticated && hasCompletedOnboarding && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, segments, router]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <StatusBar
            barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={themeColors.background}
          />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: themeColors.background },
              animation: 'slide_from_right',
            }}
          />
        </ErrorBoundary>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

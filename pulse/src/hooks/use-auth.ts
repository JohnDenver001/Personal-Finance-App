import { useAuthStore } from '@/stores/auth-store';

/**
 * Custom hook for authentication state and actions.
 * Uses fine-grained selectors so components only re-render on the
 * specific slice of auth state they actually consume.
 */
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  // signOut is async — callers should void or await it.
  const signOut = useAuthStore((s) => s.signOut);
  const checkSession = useAuthStore((s) => s.checkSession);

  return {
    user,
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    signIn,
    signUp,
    signOut,
    checkSession,
  };
};

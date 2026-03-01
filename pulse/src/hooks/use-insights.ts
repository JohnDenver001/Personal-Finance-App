import { useInsightStore } from '@/stores/insight-store';

/**
 * Custom hook for insights state.
 */
export const useInsights = () => {
  const weeklyInsights = useInsightStore((s) => s.weeklyInsights);
  const monthlyInsights = useInsightStore((s) => s.monthlyInsights);
  const patterns = useInsightStore((s) => s.patterns);
  const alerts = useInsightStore((s) => s.alerts);
  const isLoading = useInsightStore((s) => s.isLoading);
  const dismissAlert = useInsightStore((s) => s.dismissAlert);

  return {
    weeklyInsights,
    monthlyInsights,
    patterns,
    alerts,
    isLoading,
    dismissAlert,
  };
};

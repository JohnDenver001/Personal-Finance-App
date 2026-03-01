import type { Insight, PatternData } from '@/types';

/**
 * Insight service layer.
 * MVP: Returns mock insights. Replace with AI-powered backend calls.
 */

/** Fetch weekly insights */
export const getWeeklyInsights = async (
  _userId: string,
): Promise<Insight[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [
    {
      id: 'insight-1',
      user_id: 'user-1',
      type: 'weekly',
      generated_text:
        'You spent 35% of your food budget in the first 10 days of the month.',
      created_at: new Date().toISOString(),
    },
  ];
};

/** Fetch monthly report insights */
export const getMonthlyReport = async (
  _userId: string,
  _month: string,
): Promise<Insight[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return [];
};

/** Fetch pattern data for intelligence dashboard */
export const getPatterns = async (
  _userId: string,
): Promise<PatternData> => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    spending_heatmap: [],
    velocity_ratio: 0.8,
    risk_alerts: [],
    streaks: {
      logging_streak: 5,
      within_budget_streak: 3,
      best_logging_streak: 12,
      best_budget_streak: 8,
    },
  };
};

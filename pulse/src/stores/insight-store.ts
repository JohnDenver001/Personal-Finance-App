import { create } from 'zustand';
import type { Insight, PatternData, RiskAlert } from '@/types';

interface InsightState {
  weeklyInsights: Insight[];
  monthlyInsights: Insight[];
  patterns: PatternData | null;
  alerts: RiskAlert[];
  isLoading: boolean;
}

interface InsightActions {
  setWeeklyInsights: (insights: Insight[]) => void;
  setMonthlyInsights: (insights: Insight[]) => void;
  setPatterns: (patterns: PatternData) => void;
  addAlert: (alert: RiskAlert) => void;
  dismissAlert: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

/** Insight store  manages AI-generated insights and patterns */
export const useInsightStore = create<InsightState & InsightActions>()((set) => ({
  weeklyInsights: [],
  monthlyInsights: [],
  patterns: null,
  alerts: [],
  isLoading: false,

  setWeeklyInsights: (weeklyInsights) => set({ weeklyInsights }),

  setMonthlyInsights: (monthlyInsights) => set({ monthlyInsights }),

  setPatterns: (patterns) => set({ patterns }),

  addAlert: (alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),

  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));

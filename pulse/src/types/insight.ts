/** Insight as defined in the PRD High-Level Data Model */
export interface Insight {
  id: string;
  user_id: string;
  type: 'weekly' | 'monthly' | 'alert' | 'pattern';
  generated_text: string;
  created_at: string;
}

/** Pattern data for the intelligence dashboard */
export interface PatternData {
  spending_heatmap: HeatmapEntry[];
  velocity_ratio: number;
  risk_alerts: RiskAlert[];
  streaks: StreakData;
}

/** Single heatmap entry for day-of-week x time-of-day spending */
export interface HeatmapEntry {
  day: number;
  hour: number;
  total: number;
}

/** Risk alert with severity level */
export interface RiskAlert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
}

/** Streak tracking data */
export interface StreakData {
  logging_streak: number;
  within_budget_streak: number;
  best_logging_streak: number;
  best_budget_streak: number;
}

/** AI-generated insight from onboarding */
export interface OnboardingInsight {
  suggested_categories: Array<{
    name: string;
    monthly_budget_allocation: number;
    icon: string;
    color: string;
  }>;
  overspending_risk: 'low' | 'medium' | 'high';
  initial_insight: string;
}

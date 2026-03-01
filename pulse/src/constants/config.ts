/** Application configuration constants */
export const APP_CONFIG = {
  /** Maximum characters for transaction notes */
  MAX_NOTE_LENGTH: 200,
  /** Number of recent transactions shown on dashboard */
  RECENT_TRANSACTION_COUNT: 5,
  /** Minimum tap target size in points (accessibility) */
  MIN_TAP_TARGET: 44,
  /** Payday effect detection window in hours */
  PAYDAY_DETECTION_HOURS: 72,
  /** Early warning velocity threshold */
  EARLY_WARNING_THRESHOLD: 1.5,
  /** Overspending velocity threshold */
  OVERSPEND_VELOCITY_THRESHOLD: 1.0,
} as const;

/** User progression levels from PRD Section 4 */
export const PROGRESSION_LEVELS = [
  { level: 1, name: 'Aware' as const, description: 'Tracks regularly' },
  { level: 2, name: 'Controlled' as const, description: 'Stays within budget' },
  { level: 3, name: 'Stable' as const, description: 'Builds savings' },
  { level: 4, name: 'Optimized' as const, description: 'Low spending variance' },
  { level: 5, name: 'Disciplined' as const, description: 'Predictable financial behavior' },
] as const;

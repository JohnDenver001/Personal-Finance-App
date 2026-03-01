import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from 'date-fns';

/** Format a timestamp for display in transaction lists */
export const formatTransactionDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isToday(date)) return 'Today, ' + format(date, 'h:mm a');
  if (isYesterday(date)) return 'Yesterday, ' + format(date, 'h:mm a');
  return format(date, 'MMM d, h:mm a');
};

/** Relative time display (e.g., "2 hours ago") */
export const formatRelativeTime = (timestamp: string): string =>
  formatDistanceToNow(new Date(timestamp), { addSuffix: true });

/** Format a date for section headers (e.g., "February 2026") */
export const formatMonthYear = (date: Date): string =>
  format(date, 'MMMM yyyy');

/** Get the start of the current month as ISO string */
export const getCurrentMonthStart = (): string =>
  startOfMonth(new Date()).toISOString();

/** Get the end of the current month as ISO string */
export const getCurrentMonthEnd = (): string =>
  endOfMonth(new Date()).toISOString();

/** Get the number of days remaining in the current month */
export const getDaysLeftInMonth = (): number => {
  const now = new Date();
  const monthEnd = endOfMonth(now);
  return differenceInDays(monthEnd, now);
};

/** Format a full date for detail views */
export const formatFullDate = (timestamp: string): string =>
  format(new Date(timestamp), 'EEEE, MMMM d, yyyy \'at\' h:mm a');

/** Format a number as currency with the given currency code */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return currency + ' ' + amount.toFixed(2);
  }
};

/** Format a number as compact currency (e.g., .2K) */
export const formatCompactCurrency = (
  amount: number,
  currency: string = 'USD',
): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch {
    return currency + ' ' + amount.toFixed(0);
  }
};

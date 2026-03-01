/** Structured logger  replaces console.log throughout the app */
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const isDev = __DEV__;

/** Structured log entry */
const log = (level: LogLevel, message: string, data?: unknown): void => {
  if (!isDev && level === 'debug') return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(data !== undefined ? { data } : {}),
  };

  switch (level) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(entry));
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(JSON.stringify(entry));
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(entry));
  }
};

export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};

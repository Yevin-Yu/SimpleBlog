const isDevelopment = import.meta.env.DEV;

/**
 * 日志工具
 */
export const logger = {
  error: (message: string, error?: unknown): void => {
    if (isDevelopment) {
      console.error(`[Error] ${message}`, error);
    }
  },
  warn: (message: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(`[Warn] ${message}`, ...args);
    }
  },
};


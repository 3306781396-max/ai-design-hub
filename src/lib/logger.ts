/**
 * Dev-only logger — only logs in development.
 * Prevents internal error details from leaking in production.
 */
const isDev = process.env.NODE_ENV === "development";

export function logError(context: string, err: unknown): void {
  if (isDev) {
    console.error(`[${context}]`, err);
  }
}

export function logWarn(context: string, message: string): void {
  if (isDev) {
    console.warn(`[${context}]`, message);
  }
}

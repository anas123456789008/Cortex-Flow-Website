// Reports client-side errors caught by the root error boundary.
// Replace the console.error below with a real error-tracking service
// (Sentry, LogRocket, etc.) when you set one up.
type ErrorContext = Record<string, unknown>;

export function reportError(error: unknown, context: ErrorContext = {}) {
  if (typeof window === "undefined") return;
  console.error("[error-boundary]", error, {
    route: window.location.pathname,
    ...context,
  });
}

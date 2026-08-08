// Lightweight client-side error reporter. This previously forwarded errors
// to Lovable's editor overlay via window.__lovableEvents; now it just logs
// to the console. Swap in Sentry/etc. here if you want remote error tracking.
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[error-boundary]", error, {
    route: window.location.pathname,
    ...context,
  });
}

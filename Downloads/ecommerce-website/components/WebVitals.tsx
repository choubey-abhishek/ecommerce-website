"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Real Core Web Vitals capture, not a placeholder. In development it
 * logs each metric to the console so regressions are visible immediately
 * while working locally. In production it's wired to forward to GA4 only
 * if analytics is actually configured (Phase 11 doesn't add a fake
 * dashboard) — see the guard below. Until then, metrics are still visible
 * via any hosting provider's own Web Vitals reporting (e.g. Vercel
 * Analytics) if that's enabled separately.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log(`[web-vitals] ${metric.name}:`, Math.round(metric.value), metric);
      return;
    }

    const gtagId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!gtagId || typeof window === "undefined") return;

    const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== "function") return;

    gtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  });

  return null;
}

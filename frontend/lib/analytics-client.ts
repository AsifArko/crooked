"use client";

import { getOrCreateSessionId } from "./useSessionId";

const API_BASE = "";

export async function trackPageView(url: string, loadTimeMs?: number, referrer?: string) {
  try {
    await fetch(`${API_BASE}/api/analytics/page-view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        sessionId: getOrCreateSessionId(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        loadTimeMs,
        referrer: referrer ?? (typeof document !== "undefined" ? document.referrer : null),
      }),
    });
  } catch {
    // Silently ignore tracking errors
  }
}

export async function trackEvent(
  eventType: string,
  eventName: string,
  metadata?: Record<string, unknown>
) {
  try {
    await fetch(`${API_BASE}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType,
        eventName,
        url: typeof window !== "undefined" ? window.location.href : null,
        sessionId: getOrCreateSessionId(),
        metadata,
      }),
    });
  } catch {
    // Silently ignore
  }
}

export async function trackError(
  message: string,
  errorType: "client" | "server" | "api" = "client",
  severity: "low" | "medium" | "high" | "critical" = "medium",
  stackTrace?: string
) {
  try {
    await fetch(`${API_BASE}/api/analytics/error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        errorType,
        message,
        severity,
        url: typeof window !== "undefined" ? window.location.href : null,
        stackTrace,
      }),
    });
  } catch {
    // Silently ignore
  }
}

export async function trackPerformance(
  metric: string,
  value: number,
  url?: string
) {
  try {
    await fetch(`${API_BASE}/api/analytics/performance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metric,
        value,
        url: url ?? (typeof window !== "undefined" ? window.location.href : null),
        sessionId: getOrCreateSessionId(),
      }),
    });
  } catch {
    // Silently ignore
  }
}

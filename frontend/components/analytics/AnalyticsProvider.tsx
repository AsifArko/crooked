"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView, trackEvent, trackPerformance, trackError } from "@/lib/analytics-client";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onError = (event: ErrorEvent) => {
      trackError(
        event.message ?? "Unknown error",
        "client",
        "medium",
        event.error?.stack
      );
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message =
        typeof event.reason === "object" && event.reason !== null && "message" in event.reason
          ? String((event.reason as Error).message)
          : String(event.reason);
      trackError(message, "client", "medium");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    const url = typeof window !== "undefined" ? window.location.href : pathname;
    trackPageView(url);
    trackEvent("navigation", "page_view", { url });
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reportWebVitals = (metric: { name: string; value: number; id: string }) => {
      trackPerformance(metric.name.toLowerCase(), metric.value);
    };

    import("web-vitals").then(({ onCLS, onLCP, onTTFB, onINP, onFCP }) => {
      onCLS(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
    });
  }, []);

  return <>{children}</>;
}

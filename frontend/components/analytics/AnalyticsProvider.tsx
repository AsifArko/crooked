"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView, trackPerformance } from "@/lib/analytics-client";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    const url = typeof window !== "undefined" ? window.location.href : pathname;
    trackPageView(url);
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

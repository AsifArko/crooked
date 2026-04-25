import { definePlugin } from "sanity";
import { BarChartIcon, ActivityIcon } from "@sanity/icons";
import { lazy, Suspense } from "react";
import { Card, Spinner } from "@sanity/ui";

const SiteAnalyticsDashboard = lazy(
  () =>
    import("@/components/admin/SiteAnalyticsDashboard").then((m) => ({
      default: m.SiteAnalyticsDashboard,
    }))
);
const SystemMonitoringDashboard = lazy(
  () =>
    import("@/components/admin/SystemMonitoringDashboard").then((m) => ({
      default: m.SystemMonitoringDashboard,
    }))
);

function LoadingFallback() {
  return (
    <Card padding={5}>
      <Spinner />
    </Card>
  );
}

export const analyticsToolsPlugin = definePlugin({
  name: "analytics-tools",
  tools: (prev) => [
    ...prev,
    {
      name: "events",
      title: "Events",
      icon: BarChartIcon,
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <SiteAnalyticsDashboard />
        </Suspense>
      ),
    },
    {
      name: "system-monitoring",
      title: "System Monitoring",
      icon: ActivityIcon,
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <SystemMonitoringDashboard />
        </Suspense>
      ),
    },
  ],
});

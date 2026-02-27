import { definePlugin } from "sanity";
import { BarChartIcon, ActivityIcon, DownloadIcon } from "@sanity/icons";
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
const UserDownloadsDashboard = lazy(
  () =>
    import("@/components/admin/UserDownloadsDashboard").then((m) => ({
      default: m.UserDownloadsDashboard,
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
      name: "site-analytics",
      title: "Site Analytics",
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
    {
      name: "resume-downloads",
      title: "Resume Downloads",
      icon: DownloadIcon,
      component: () => (
        <Suspense fallback={<LoadingFallback />}>
          <UserDownloadsDashboard />
        </Suspense>
      ),
    },
  ],
});

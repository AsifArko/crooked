"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  RefreshCw,
  Cpu,
  HardDrive,
  Zap,
} from "lucide-react";
import {
  TopPagesCard,
  DevicesBrowsersCard,
  CountriesCard,
} from "./AnalyticsPanelCard";
import { TrafficChart } from "./TrafficChart";

type SystemMonitoringData = {
  overview: {
    totalPageViews: number;
    pageViewsToday: number;
    pageViewsChange: number;
    activeUsers: number;
    activeUsersChange: number;
    systemHealth: number;
    totalEvents: number;
    uniqueVisitorsInPeriod?: number;
  };
  topPages: { path: string; visitors: number }[];
  topCountries: {
    country: string;
    countryCode: string;
    visitors: number;
    percentage: number;
  }[];
  deviceBreakdown: { device: string; visitors: number; percentage: number }[];
  deviceCategoryBreakdown: {
    device: string;
    visitors: number;
    percentage: number;
  }[];
  dailyTrend: { date: string; visitors: number; pageViews: number }[];
  realtimeActivity: {
    activeUsersLast5Min: number;
    pageViewsLast5Min: number;
    eventsLast5Min: number;
  };
  activityLevel: string;
  systemHealth: {
    cpu: number | null;
    memory: number | null;
    disk: number | null;
    memoryHeapMB: number | null;
    memoryRssMB: number | null;
    status: string;
  };
};

const CACHE_KEY = "system-monitoring-dashboard";
const CACHE_TTL_MS = 30_000;

function loadCachedData(): SystemMonitoringData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as {
      data: SystemMonitoringData;
      ts: number;
    };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function saveDataCache(data: SystemMonitoringData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    /* ignore */
  }
}

export function SystemMonitoringDashboard() {
  const cached = loadCachedData();
  const [data, setData] = useState<SystemMonitoringData | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("7d");
  const [chartMetric, setChartMetric] = useState<"visitors" | "pageViews">("visitors");
  const dataRef = useRef(data);
  dataRef.current = data;

  const fetchData = useCallback(() => {
    const hasData = dataRef.current !== null;
    if (hasData) setIsRefreshing(true);
    return Promise.all([
      fetch(`/api/admin/analytics/system-monitoring?dateRange=${dateRange}`),
      fetch("/api/admin/analytics/record-system-metrics-sample", {
        method: "POST",
      }).catch(() => {}),
    ])
      .then(([res]) => res.json())
      .then((d: SystemMonitoringData) => {
        setData(d);
        saveDataCache(d);
      })
      .catch((err) => {
        console.error("System monitoring fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-600" />
      </div>
    );
  }

  const overview = data?.overview ?? null;
  const topPages = data?.topPages ?? [];
  const topCountries = data?.topCountries ?? [];
  const deviceBreakdown =
    data?.deviceCategoryBreakdown ?? data?.deviceBreakdown ?? [];
  const realtime = data?.realtimeActivity ?? null;
  const systemHealth = data?.systemHealth ?? null;
  const dailyTrend = data?.dailyTrend ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">
            System Monitoring
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[13px] text-zinc-600 bg-transparent border-none focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-[13px] text-zinc-600 hover:text-zinc-900 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-[13px] text-zinc-500 mb-0.5">Visitors</p>
            <p className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {overview?.uniqueVisitorsInPeriod ?? overview?.activeUsers ?? 0}
            </p>
            {overview?.activeUsersChange != null &&
              overview.activeUsersChange !== 0 && (
                <p
                  className={`text-[12px] mt-0.5 ${
                    overview.activeUsersChange >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {overview.activeUsersChange >= 0 ? "+" : ""}
                  {overview.activeUsersChange}%
                </p>
              )}
          </div>
          <div>
            <p className="text-[13px] text-zinc-500 mb-0.5">Page Views</p>
            <p className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {overview?.pageViewsToday ?? overview?.totalPageViews ?? 0}
            </p>
            {overview?.pageViewsChange != null &&
              overview.pageViewsChange !== 0 && (
                <p
                  className={`text-[12px] mt-0.5 ${
                    overview.pageViewsChange >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {overview.pageViewsChange >= 0 ? "+" : ""}
                  {overview.pageViewsChange}%
                </p>
              )}
          </div>
          <div>
            <p className="text-[13px] text-zinc-500 mb-0.5">Error Rate</p>
            <p className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {overview?.systemHealth ?? 0}
            </p>
            <p className="text-[12px] text-zinc-500 mt-0.5">
              Critical/High errors
            </p>
          </div>
        </div>

        {/* Traffic over time */}
        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-medium text-zinc-900">
              Traffic over time
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setChartMetric("visitors")}
                className={`text-[12px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                  chartMetric === "visitors"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Visitors
              </button>
              <button
                type="button"
                onClick={() => setChartMetric("pageViews")}
                className={`text-[12px] font-medium px-2.5 py-1 rounded-md transition-colors ${
                  chartMetric === "pageViews"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                Page Views
              </button>
            </div>
          </div>
          {dailyTrend.length > 0 ? (
            <TrafficChart data={dailyTrend} metric={chartMetric} />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[13px] text-zinc-400">
              No data for selected period
            </div>
          )}
        </div>

        {/* System Health + Real-time Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Health */}
          <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm p-5">
            <h2 className="text-[13px] font-medium text-zinc-900 flex items-center gap-2 mb-5">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              System Health
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-[13px] text-zinc-600">
                    <Cpu className="h-3.5 w-3.5 text-zinc-400" />
                    CPU Usage
                  </span>
                  <span className="text-[13px] font-medium text-zinc-900">
                    {systemHealth?.cpu != null ? `${systemHealth.cpu}%` : "N/A"}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-200 rounded-full"
                    style={{ width: `${systemHealth?.cpu ?? 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Status: Not available in serverless
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-[13px] text-zinc-600">
                    <Zap className="h-3.5 w-3.5 text-zinc-400" />
                    Memory Usage
                  </span>
                  <span className="text-[13px] font-medium text-zinc-900">
                    {systemHealth?.memory != null
                      ? `${systemHealth.memory}%`
                      : systemHealth?.memoryHeapMB != null
                        ? `${systemHealth.memoryHeapMB} MB`
                        : "N/A"}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, systemHealth?.memory ?? 0)}%`,
                      backgroundColor:
                        (systemHealth?.memory ?? 0) > 90
                          ? "#ef4444"
                          : (systemHealth?.memory ?? 0) > 70
                            ? "#f59e0b"
                            : "#22c55e",
                    }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Status: {systemHealth?.status ?? "Unknown"}
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="flex items-center gap-2 text-[13px] text-zinc-600">
                    <HardDrive className="h-3.5 w-3.5 text-zinc-400" />
                    Disk Usage
                  </span>
                  <span className="text-[13px] font-medium text-zinc-900">
                    {systemHealth?.disk != null
                      ? `${systemHealth.disk}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-200 rounded-full"
                    style={{ width: `${systemHealth?.disk ?? 0}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Status: Not available in serverless
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm p-5">
            <h2 className="text-[13px] font-medium text-zinc-900 flex items-center gap-2 mb-5">
              <Zap className="h-3.5 w-3.5 text-zinc-400" />
              Real-time Activity
            </h2>
            <div className="space-y-5">
              <div>
                <p className="text-[13px] text-zinc-500 mb-0.5">
                  Active Users
                </p>
                <p className="text-3xl font-semibold text-zinc-900 tracking-tight">
                  {realtime?.activeUsersLast5Min ?? 0}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Last 5 minutes · {data?.activityLevel ?? "Low"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[13px] text-zinc-500 mb-0.5">
                    Page Views
                  </p>
                  <p className="text-xl font-semibold text-zinc-900 tracking-tight">
                    {realtime?.pageViewsLast5Min ?? 0}
                  </p>
                  <p className="text-[11px] text-zinc-400">Last 5 minutes</p>
                </div>
                <div>
                  <p className="text-[13px] text-zinc-500 mb-0.5">
                    User Events
                  </p>
                  <p className="text-xl font-semibold text-zinc-900 tracking-tight">
                    {realtime?.eventsLast5Min ?? 0}
                  </p>
                  <p className="text-[11px] text-zinc-400">Last 5 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[12px] text-emerald-600 font-medium">
                  Live Data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Pages, Devices, Countries */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopPagesCard items={topPages} />
          <DevicesBrowsersCard deviceItems={deviceBreakdown} />
          <CountriesCard items={topCountries} />
        </div>
      </div>
    </div>
  );
}

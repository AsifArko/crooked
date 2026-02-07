"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Cpu, HardDrive, Activity, BarChart3 } from "lucide-react";

type Overview = {
  totalPageViews: number;
  activeUsers: number;
  systemHealth: number;
};

const CACHE_KEY = "system-monitoring-dashboard";
const CACHE_TTL_MS = 30_000;

function loadCachedOverview(): Overview | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { overview, ts } = JSON.parse(raw) as { overview: Overview; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return overview;
  } catch {
    return null;
  }
}

function saveOverviewCache(overview: Overview) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ overview, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function SystemMonitoringDashboard() {
  const cached = loadCachedOverview();
  const [overview, setOverview] = useState<Overview | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const overviewRef = useRef(overview);
  overviewRef.current = overview;

  const fetchData = useCallback(() => {
    const hasData = overviewRef.current !== null;
    if (hasData) setIsRefreshing(true);
    return fetch("/api/admin/analytics/overview")
      .then((res) => res.json())
      .then((o) => {
        setOverview(o);
        saveOverviewCache(o);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 mb-0.5">Monitoring Dashboard</p>
            <h1 className="text-2xl font-bold text-gray-900">System Monitoring Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time system health and traffic analytics
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border border-gray-200 bg-emerald-50/70 p-4">
            <span className="text-sm text-gray-600">Uptime</span>
            <p className="text-2xl font-bold mt-1">0.14%</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-amber-50/70 p-4">
            <span className="text-sm text-gray-600">Active Users</span>
            <p className="text-2xl font-bold mt-1">{overview?.activeUsers ?? 0}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-blue-50/70 p-4">
            <span className="text-sm text-gray-600">Total Requests</span>
            <p className="text-2xl font-bold mt-1">{overview?.totalPageViews ?? 0}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-red-50/70 p-4">
            <span className="text-sm text-gray-600">Error Rate</span>
            <p className="text-2xl font-bold mt-1">0%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Health */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4" />
              System Health
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-gray-400" /> CPU Usage
                  </span>
                  <span>0.0%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: Good</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-gray-400" /> Memory Usage
                  </span>
                  <span>0.0%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: Good</p>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-400" /> Disk Usage
                  </span>
                  <span>0.0%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-0" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Status: Good</p>
              </div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4" />
              Real-time Activity
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Active Users</span>
                <p className="text-2xl font-bold">{overview?.activeUsers ?? 0}</p>
                <p className="text-xs text-gray-500">Last 5 minutes · Low</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-gray-600">Page Views</span>
                  <p className="text-lg font-semibold">0</p>
                  <p className="text-xs text-gray-500">Last 5 minutes</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">User Events</span>
                  <p className="text-lg font-semibold">0</p>
                  <p className="text-xs text-gray-500">Last 5 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm text-emerald-600 font-medium">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4" />
            Traffic Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg bg-blue-50/70 p-4">
              <span className="text-sm text-gray-600">Page Views</span>
              <p className="text-2xl font-bold">{overview?.totalPageViews ?? 0}</p>
            </div>
            <div className="rounded-lg bg-amber-50/70 p-4">
              <span className="text-sm text-gray-600">Unique Visitors</span>
              <p className="text-2xl font-bold">{overview?.activeUsers ?? 0}</p>
            </div>
            <div className="rounded-lg bg-emerald-50/70 p-4">
              <span className="text-sm text-gray-600">Avg Session</span>
              <p className="text-2xl font-bold">0m 0s</p>
            </div>
            <div className="rounded-lg bg-red-50/70 p-4">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <p className="text-2xl font-bold">0.0%</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 min-h-[100px]">
              <p className="text-sm font-medium text-gray-600 mb-2">Top Pages</p>
              <p className="text-sm text-gray-400">No data</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 min-h-[100px]">
              <p className="text-sm font-medium text-gray-600 mb-2">Device Breakdown</p>
              <p className="text-sm text-gray-400">No data</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 min-h-[100px]">
              <p className="text-sm font-medium text-gray-600 mb-2">Top Countries</p>
              <p className="text-sm text-gray-400">No data</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4" />
            Performance Metrics
          </h2>
          <p className="text-sm text-gray-500 mb-4">Core Web Vitals</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2">
              <span className="text-sm text-gray-600">Largest Contentful Paint</span>
              <span className="font-semibold">0ms</span>
              <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">Good</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2">
              <span className="text-sm text-gray-600">First Input Delay</span>
              <span className="font-semibold">0ms</span>
              <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">Good</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2">
              <span className="text-sm text-gray-600">Cumulative Layout Shift</span>
              <span className="font-semibold">0.000</span>
              <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">Good</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

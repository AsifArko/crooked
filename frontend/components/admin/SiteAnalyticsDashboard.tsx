"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

type Overview = {
  totalPageViews: number;
  pageViewsChange?: number;
  activeUsers: number;
  systemHealth: number;
  conversions: number;
};

type PageView = {
  _id: string;
  url?: string;
  sessionId?: string;
  recordedAt: string;
  loadTimeMs?: number;
  userAgent?: string;
};

type UserEvent = {
  _id: string;
  eventType?: string;
  eventName?: string;
  url?: string;
  sessionId?: string;
  recordedAt: string;
};

type ErrorLog = {
  _id: string;
  errorType?: string;
  message?: string;
  severity?: string;
  url?: string;
  recordedAt: string;
  status?: string;
};

type SystemMetric = {
  _id: string;
  metricType?: string;
  value?: number;
  unit?: string;
  status?: string;
  recordedAt: string;
};

type PerformanceMetric = {
  _id: string;
  metric?: string;
  value?: number;
  url?: string;
  sessionId?: string;
  recordedAt: string;
};

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
};

const CACHE_KEY = "site-analytics-dashboard";
const CACHE_TTL_MS = 30_000;

function loadOverviewCache(): Overview | null {
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

export function SiteAnalyticsDashboard() {
  const cachedOverview = loadOverviewCache();
  const [overview, setOverview] = useState<Overview | null>(cachedOverview);
  const [pageViews, setPageViews] = useState<{ items: PageView[]; total: number; page: number } | null>(null);
  const [events, setEvents] = useState<{ items: UserEvent[]; total: number; page: number } | null>(null);
  const [errorLogs, setErrorLogs] = useState<{ items: ErrorLog[]; total: number; page: number } | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<{ items: SystemMetric[]; total: number; page: number } | null>(null);
  const [performance, setPerformance] = useState<{ items: PerformanceMetric[]; total: number; page: number } | null>(null);
  const [loading, setLoading] = useState(!cachedOverview);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [metricType, setMetricType] = useState("all");
  const [performanceMetric, setPerformanceMetric] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const buildParams = useCallback(
    (page: number, extra?: Record<string, string>) => {
      const p = new URLSearchParams();
      p.set("page", String(page));
      p.set("limit", String(PAGE_SIZE));
      p.set("dateRange", dateRange);
      if (searchDebounced) p.set("search", searchDebounced);
      Object.entries(extra ?? {}).forEach(([k, v]) => v && v !== "all" && p.set(k, v));
      return p.toString();
    },
    [dateRange, searchDebounced]
  );

  const fetchOverview = useCallback(() => {
    return fetch("/api/admin/analytics/overview")
      .then((res) => res.json())
      .then((o) => {
        setOverview(o);
        saveOverviewCache(o);
      });
  }, []);

  const fetchPageViews = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/page-views?${buildParams(page)}`)
        .then((res) => res.json())
        .then(setPageViews);
    },
    [buildParams]
  );

  const fetchEvents = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/events?${buildParams(page, { eventType })}`)
        .then((res) => res.json())
        .then(setEvents);
    },
    [buildParams, eventType]
  );

  const fetchErrorLogs = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/error-logs?${buildParams(page, { severity, status })}`)
        .then((res) => res.json())
        .then(setErrorLogs);
    },
    [buildParams, severity, status]
  );

  const fetchSystemMetrics = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/system-metrics?${buildParams(page, { metricType, status })}`)
        .then((res) => res.json())
        .then(setSystemMetrics);
    },
    [buildParams, metricType, status]
  );

  const fetchPerformance = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/performance?${buildParams(page, { metric: performanceMetric })}`)
        .then((res) => res.json())
        .then(setPerformance);
    },
    [buildParams, performanceMetric]
  );

  const refresh = useCallback(() => {
    const hasData = overview !== null;
    if (hasData) setIsRefreshing(true);
    Promise.all([
      fetchOverview(),
      activeTab === "page-views" ? fetchPageViews(pageViews?.page ?? 1) : Promise.resolve(),
      activeTab === "events" ? fetchEvents(events?.page ?? 1) : Promise.resolve(),
      activeTab === "error-logs" ? fetchErrorLogs(errorLogs?.page ?? 1) : Promise.resolve(),
      activeTab === "system-metrics" ? fetchSystemMetrics(systemMetrics?.page ?? 1) : Promise.resolve(),
      activeTab === "performance" ? fetchPerformance(performance?.page ?? 1) : Promise.resolve(),
    ]).finally(() => {
      setLoading(false);
      setIsRefreshing(false);
    });
  }, [activeTab, fetchOverview, fetchPageViews, fetchEvents, fetchErrorLogs, fetchSystemMetrics, fetchPerformance, pageViews?.page, events?.page, errorLogs?.page, systemMetrics?.page, performance?.page, overview]);

  useEffect(() => {
    fetchOverview().finally(() => setLoading(false));
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === "page-views") fetchPageViews(1);
    if (activeTab === "events") fetchEvents(1);
    if (activeTab === "error-logs") fetchErrorLogs(1);
    if (activeTab === "system-metrics") fetchSystemMetrics(1);
    if (activeTab === "performance") fetchPerformance(1);
  }, [
    activeTab,
    searchDebounced,
    dateRange,
    severity,
    status,
    eventType,
    metricType,
    performanceMetric,
    fetchPageViews,
    fetchEvents,
    fetchErrorLogs,
    fetchSystemMetrics,
    fetchPerformance,
  ]);

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  const TablePagination = ({
    page,
    total,
    limit = PAGE_SIZE,
    onPageChange,
  }: {
    page: number;
    total: number;
    limit?: number;
    onPageChange: (p: number) => void;
  }) => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{start}</span>–<span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{total}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="h-9 gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600 min-w-[100px] text-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="h-9 gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Monitor your application&apos;s performance, user behavior, and system health
            </p>
          </div>
          <Button
            onClick={refresh}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 shrink-0" />
              <Input
                placeholder="Search URL, session ID, event type, error message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="scroll">Scroll</SelectItem>
                  <SelectItem value="navigation">Navigation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="w-[150px] h-10 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={performanceMetric} onValueChange={setPerformanceMetric}>
                <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="LCP">LCP</SelectItem>
                  <SelectItem value="FID">FID</SelectItem>
                  <SelectItem value="CLS">CLS</SelectItem>
                  <SelectItem value="FCP">FCP</SelectItem>
                  <SelectItem value="TTFB">TTFB</SelectItem>
                </SelectContent>
              </Select>
              {activeTab === "error-logs" && (
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[120px] h-10 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {activeTab === "system-metrics" && (
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[120px] h-10 bg-gray-50 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - full-width segmented control */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-0 w-full">
            <TabsList className="flex h-11 w-full gap-1 rounded-lg bg-white p-1">
              {[
                { value: "overview", label: "Overview" },
                { value: "page-views", label: "Page Views" },
                { value: "events", label: "User Events" },
                { value: "system-metrics", label: "System Metrics" },
                { value: "error-logs", label: "Error Logs" },
                { value: "performance", label: "Performance" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">

          {/* Overview */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-gray-200 bg-blue-50/50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Page Views</span>
                </div>
                <p className="text-2xl font-bold mt-1">{overview?.totalPageViews ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">+{overview?.pageViewsChange ?? 0}% from last month</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-amber-50/50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                </div>
                <p className="text-2xl font-bold mt-1">{overview?.activeUsers ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Unique sessions today</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-emerald-50/50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">System Health</span>
                </div>
                <p className="text-2xl font-bold mt-1">{overview?.systemHealth ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Critical/High errors</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conversions</span>
                </div>
                <p className="text-2xl font-bold mt-1">{overview?.conversions ?? 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total conversions</p>
              </div>
            </div>
          </TabsContent>

          {/* Page Views */}
          <TabsContent value="page-views" className="mt-0">
            <h2 className="text-lg font-semibold mb-1">Page Views</h2>
            <p className="text-sm text-gray-500 mb-4">Track user page navigation and engagement</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[18%]" />
                  <col className="w-[16%]" />
                  <col className="w-[10%]" />
                  <col className="w-[34%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Session ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric (ms)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {(pageViews?.items ?? []).map((row) => (
                    <tr key={row._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.url ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700">
                          {row.url ?? "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.sessionId ?? ""} className="inline-block max-w-full truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                          {row.sessionId ?? "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          {formatDate(row.recordedAt)}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          {row.loadTimeMs != null ? `${row.loadTimeMs}` : "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.userAgent ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                          {row.userAgent ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={pageViews?.page ?? 1}
              total={pageViews?.total ?? 0}
              limit={PAGE_SIZE}
              onPageChange={fetchPageViews}
            />
          </TabsContent>

          {/* User Events */}
          <TabsContent value="events" className="mt-0">
            <h2 className="text-lg font-semibold mb-1">User Events</h2>
            <p className="text-sm text-gray-500 mb-4">Monitor user interactions and behavior patterns</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[14%]" />
                  <col className="w-[18%]" />
                  <col className="w-[28%]" />
                  <col className="w-[22%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Session ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(events?.items ?? []).map((row) => (
                    <tr key={row._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{row.eventType ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">{row.eventName ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.url ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700">{row.url ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.sessionId ?? ""} className="inline-block max-w-full truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">{row.sessionId ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{formatDate(row.recordedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={events?.page ?? 1}
              total={events?.total ?? 0}
              limit={PAGE_SIZE}
              onPageChange={fetchEvents}
            />
          </TabsContent>

          {/* System Metrics */}
          <TabsContent value="system-metrics" className="mt-0">
            <h2 className="text-lg font-semibold mb-1">System Metrics</h2>
            <p className="text-sm text-gray-500 mb-4">Monitor server performance and resource utilization</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[20%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[12%]" />
                  <col className="w-[26%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(systemMetrics?.items ?? []).map((row) => (
                    <tr key={row._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{row.metricType ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{row.value != null ? row.value.toFixed(2) : "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{row.unit ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <Badge variant={row.status === "Critical" ? "destructive" : "secondary"} className="rounded-full text-xs">
                          {row.status ?? "Normal"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{formatDate(row.recordedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={systemMetrics?.page ?? 1}
              total={systemMetrics?.total ?? 0}
              limit={PAGE_SIZE}
              onPageChange={fetchSystemMetrics}
            />
          </TabsContent>

          {/* Error Logs */}
          <TabsContent value="error-logs" className="mt-0">
            <h2 className="text-lg font-semibold mb-1">Error Logs</h2>
            <p className="text-sm text-gray-500 mb-4">Track and monitor application errors and issues</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[12%]" />
                  <col className="w-[28%]" />
                  <col className="w-[10%]" />
                  <col className="w-[20%]" />
                  <col className="w-[16%]" />
                  <col className="w-[14%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Error Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Message</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(errorLogs?.items ?? []).map((row) => (
                    <tr key={row._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{row.errorType ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.message ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-700">{row.message ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <Badge variant={row.severity === "critical" || row.severity === "high" ? "destructive" : "secondary"} className="rounded-full text-xs">
                          {row.severity ?? "—"}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.url ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700">{row.url ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{formatDate(row.recordedAt)}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <Badge variant={row.status === "Open" ? "destructive" : "secondary"} className="rounded-full text-xs">
                          {row.status ?? "Open"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={errorLogs?.page ?? 1}
              total={errorLogs?.total ?? 0}
              limit={PAGE_SIZE}
              onPageChange={fetchErrorLogs}
            />
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="mt-0">
            <h2 className="text-lg font-semibold mb-1">Performance Metrics</h2>
            <p className="text-sm text-gray-500 mb-4">Core Web Vitals and performance indicators</p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[30%]" />
                  <col className="w-[22%]" />
                  <col className="w-[26%]" />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Value (ms)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Session ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {(performance?.items ?? []).map((row) => (
                    <tr key={row._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">{row.metric ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{row.value != null ? String(row.value) : "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.url ?? ""} className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700">{row.url ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span title={row.sessionId ?? ""} className="inline-block max-w-full truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">{row.sessionId ?? "—"}</span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">{formatDate(row.recordedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={performance?.page ?? 1}
              total={performance?.total ?? 0}
              limit={PAGE_SIZE}
              onPageChange={fetchPerformance}
            />
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

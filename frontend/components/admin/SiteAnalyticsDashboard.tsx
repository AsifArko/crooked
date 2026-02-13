"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useSessionId } from "@/lib/useSessionId";
import {
  PAGE_SIZE,
  getMySessionIds,
  loadOverviewCache,
  saveOverviewCache,
  AnalyticsFilters,
  OverviewTab,
  PageViewsTab,
  EventsTab,
  SystemMetricsTab,
  ErrorLogsTab,
  PerformanceTab,
} from "./SiteAnalyticsDashboardComponents";
import type {
  Overview,
  PageView,
  UserEvent,
  ErrorLog,
  SystemMetric,
  PerformanceMetric,
} from "./SiteAnalyticsDashboardComponents";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "page-views", label: "Page Views" },
  { value: "events", label: "User Events" },
  { value: "system-metrics", label: "System Metrics" },
  { value: "error-logs", label: "Error Logs" },
  { value: "performance", label: "Performance" },
] as const;

export function SiteAnalyticsDashboard() {
  const currentSessionId = useSessionId();
  const cachedOverview = loadOverviewCache();
  const [overview, setOverview] = useState<Overview | null>(cachedOverview);
  const [pageViews, setPageViews] = useState<{
    items: PageView[];
    total: number;
    page: number;
  } | null>(null);
  const [events, setEvents] = useState<{
    items: UserEvent[];
    total: number;
    page: number;
  } | null>(null);
  const [errorLogs, setErrorLogs] = useState<{
    items: ErrorLog[];
    total: number;
    page: number;
  } | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<{
    items: SystemMetric[];
    total: number;
    page: number;
  } | null>(null);
  const [performance, setPerformance] = useState<{
    items: PerformanceMetric[];
    total: number;
    page: number;
  } | null>(null);
  const [loading, setLoading] = useState(!cachedOverview);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [requestSource, setRequestSource] = useState<"all" | "me" | "others">(
    "all",
  );
  const [mySessionIdsVersion, setMySessionIdsVersion] = useState(0);
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [eventType, setEventType] = useState("all");
  const [metricType, setMetricType] = useState("all");
  const [performanceMetric, setPerformanceMetric] = useState("all");

  const mySessionIds = useMemo(
    () =>
      typeof window !== "undefined" ? getMySessionIds(currentSessionId) : [],
    [currentSessionId, mySessionIdsVersion],
  );
  const systemMetricsSampleRequested = useRef(false);

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
      if (requestSource === "me" && mySessionIds.length > 0) {
        p.set("sessionId", mySessionIds.join(","));
      } else if (requestSource === "others" && mySessionIds.length > 0) {
        p.set("excludeSessionId", mySessionIds.join(","));
      }
      Object.entries(extra ?? {}).forEach(
        ([k, v]) => v && v !== "all" && p.set(k, v),
      );
      return p.toString();
    },
    [dateRange, searchDebounced, requestSource, mySessionIds],
  );

  const fetchOverview = useCallback(() => {
    return fetch("/api/admin/analytics/overview")
      .then((res) => res.json())
      .then((o: Overview) => {
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
    [buildParams],
  );

  const fetchEvents = useCallback(
    (page = 1) => {
      fetch(`/api/admin/analytics/events?${buildParams(page, { eventType })}`)
        .then((res) => res.json())
        .then(setEvents);
    },
    [buildParams, eventType],
  );

  const fetchErrorLogs = useCallback(
    (page = 1) => {
      fetch(
        `/api/admin/analytics/error-logs?${buildParams(page, { severity, status })}`,
      )
        .then((res) => res.json())
        .then(setErrorLogs);
    },
    [buildParams, severity, status],
  );

  const fetchSystemMetrics = useCallback(
    (page = 1) => {
      fetch(
        `/api/admin/analytics/system-metrics?${buildParams(page, { metricType, status })}`,
      )
        .then((res) => res.json())
        .then(setSystemMetrics);
    },
    [buildParams, metricType, status],
  );

  const fetchPerformance = useCallback(
    (page = 1) => {
      fetch(
        `/api/admin/analytics/performance?${buildParams(page, { metric: performanceMetric })}`,
      )
        .then((res) => res.json())
        .then(setPerformance);
    },
    [buildParams, performanceMetric],
  );

  const refresh = useCallback(() => {
    if (overview !== null) setIsRefreshing(true);
    Promise.all([
      fetchOverview(),
      activeTab === "page-views"
        ? fetchPageViews(pageViews?.page ?? 1)
        : Promise.resolve(),
      activeTab === "events"
        ? fetchEvents(events?.page ?? 1)
        : Promise.resolve(),
      activeTab === "error-logs"
        ? fetchErrorLogs(errorLogs?.page ?? 1)
        : Promise.resolve(),
      activeTab === "system-metrics"
        ? fetchSystemMetrics(systemMetrics?.page ?? 1)
        : Promise.resolve(),
      activeTab === "performance"
        ? fetchPerformance(performance?.page ?? 1)
        : Promise.resolve(),
    ]).finally(() => {
      setLoading(false);
      setIsRefreshing(false);
    });
  }, [
    activeTab,
    fetchOverview,
    fetchPageViews,
    fetchEvents,
    fetchErrorLogs,
    fetchSystemMetrics,
    fetchPerformance,
    pageViews?.page,
    events?.page,
    errorLogs?.page,
    systemMetrics?.page,
    performance?.page,
    overview,
  ]);

  useEffect(() => {
    fetchOverview().finally(() => setLoading(false));
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === "page-views") fetchPageViews(1);
    if (activeTab === "events") fetchEvents(1);
    if (activeTab === "error-logs") fetchErrorLogs(1);
    if (activeTab === "system-metrics") {
      fetchSystemMetrics(1);
      if (!systemMetricsSampleRequested.current) {
        systemMetricsSampleRequested.current = true;
        fetch("/api/admin/analytics/record-system-metrics-sample", {
          method: "POST",
        })
          .then(() => fetchSystemMetrics(1))
          .catch(() => {});
      }
    }
    if (activeTab === "performance") fetchPerformance(1);
  }, [
    activeTab,
    searchDebounced,
    dateRange,
    requestSource,
    mySessionIdsVersion,
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <Button
            onClick={refresh}
            variant="default"
            size="sm"
            className="ml-auto flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <AnalyticsFilters
          search={search}
          onSearchChange={setSearch}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          eventType={eventType}
          onEventTypeChange={setEventType}
          severity={severity}
          onSeverityChange={setSeverity}
          performanceMetric={performanceMetric}
          onPerformanceMetricChange={setPerformanceMetric}
          status={status}
          onStatusChange={setStatus}
          requestSource={requestSource}
          onRequestSourceChange={setRequestSource}
          activeTab={activeTab}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-0 w-full">
            <TabsList className="flex h-11 w-full gap-1 rounded-lg bg-white p-1">
              {TABS.map((tab) => (
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
            <TabsContent value="overview" className="mt-0">
              <OverviewTab overview={overview} />
            </TabsContent>

            <TabsContent value="page-views" className="mt-0">
              <PageViewsTab
                pageViews={pageViews}
                mySessionIds={mySessionIds}
                onPageChange={fetchPageViews}
              />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <EventsTab events={events} onPageChange={fetchEvents} />
            </TabsContent>

            <TabsContent value="system-metrics" className="mt-0">
              <SystemMetricsTab
                systemMetrics={systemMetrics}
                onPageChange={fetchSystemMetrics}
              />
            </TabsContent>

            <TabsContent value="error-logs" className="mt-0">
              <ErrorLogsTab
                errorLogs={errorLogs}
                onPageChange={fetchErrorLogs}
              />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <PerformanceTab
                performance={performance}
                onPageChange={fetchPerformance}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

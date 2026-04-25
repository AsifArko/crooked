"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
} from "./SiteAnalyticsDashboardComponents";
import { UserDownloadsDashboard } from "./UserDownloadsDashboard";
import type {
  Overview,
  PageView,
  UserEvent,
} from "./SiteAnalyticsDashboardComponents";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "page-views", label: "Page Views" },
  { value: "events", label: "User Events" },
  { value: "resume-download", label: "Resume Download" },
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
  const [eventType, setEventType] = useState("all");

  const mySessionIds = useMemo(
    () =>
      typeof window !== "undefined" ? getMySessionIds(currentSessionId) : [],
    [currentSessionId, mySessionIdsVersion],
  );
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
    ]).finally(() => {
      setLoading(false);
      setIsRefreshing(false);
    });
  }, [
    activeTab,
    fetchOverview,
    fetchPageViews,
    fetchEvents,
    pageViews?.page,
    events?.page,
    overview,
  ]);

  useEffect(() => {
    fetchOverview().finally(() => setLoading(false));
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === "page-views") fetchPageViews(1);
    if (activeTab === "events") fetchEvents(1);
  }, [
    activeTab,
    searchDebounced,
    dateRange,
    requestSource,
    mySessionIdsVersion,
    eventType,
    fetchPageViews,
    fetchEvents,
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
        {activeTab !== "resume-download" && (
          <AnalyticsFilters
            search={search}
            onSearchChange={setSearch}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            eventType={eventType}
            onEventTypeChange={setEventType}
            requestSource={requestSource}
            onRequestSourceChange={setRequestSource}
            activeTab={activeTab}
            onRefresh={refresh}
            isRefreshing={isRefreshing}
          />
        )}

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

            <TabsContent value="resume-download" className="mt-0">
              <UserDownloadsDashboard embedded />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

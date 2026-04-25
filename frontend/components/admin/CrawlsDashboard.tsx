"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Database, CheckCircle, XCircle, Loader2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "./SiteAnalyticsDashboardComponents";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PAGE_SIZE = 15;
const SOURCE_STATS_PAGE_SIZE = 10;

type SourceStat = {
  source: string;
  fetched: number;
  created: number;
  updated: number;
  errors: number;
};

type LocationStat = {
  city: string;
  country: string;
  queries: number;
  jobsFound: number;
  created: number;
  updated: number;
};

type CrawlRun = {
  _id: string;
  type: "jobs" | "companies" | "geography";
  typeLabel: string;
  startedAt: string;
  finishedAt: string;
  status: string;
  trigger?: string;
  params?: { search?: string; countryCode?: string; location?: string; source?: string };
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalErrors: number;
  sourcesCount: number;
  durationMs?: number;
  sourceStats: SourceStat[];
  locationStats?: LocationStat[];
  errorLog?: string;
  log?: string[];
};

type CrawlsResponse = {
  items: CrawlRun[];
  total: number;
  page: number;
  limit: number;
};

function formatISO(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toISOString();
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        <CheckCircle className="h-3 w-3" />
        Completed
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-700">
        <XCircle className="h-3 w-3" />
        Failed
      </span>
    );
  }
  if (status === "skipped") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
        Skipped
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
      <Loader2 className="h-3 w-3 animate-spin" />
      Running
    </span>
  );
}

function formatDuration(ms: number | undefined): string {
  if (ms == null || ms < 0) return "—";
  if (ms < 1000) return `${ms}ms`;
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${min}m ${s}s` : `${min}m`;
}

export function CrawlsDashboard() {
  const [data, setData] = useState<CrawlsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sourceStatsPage, setSourceStatsPage] = useState(1);

  const [typeFilter, setTypeFilter] = useState<string>("");

  const fetchData = useCallback((p = 1) => {
    setIsRefreshing(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("limit", String(PAGE_SIZE));
    if (typeFilter) params.set("type", typeFilter);
    return fetch(`/api/admin/crawls?${params}`)
      .then((res) => res.json())
      .then((d: CrawlsResponse) => {
        setData(d);
        setPage(d.page ?? p);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, [typeFilter]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData, typeFilter]);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  const items = data?.items ?? [];
  const selectedRun = selectedId ? items.find((r) => r._id === selectedId) : null;

  useEffect(() => {
    setSourceStatsPage(1);
  }, [selectedId]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="h-7 w-7 text-zinc-600" />
              Crawls
            </h1>
            <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              Crawling sessions, metadata & stats
            </p>
          </div>
          <Button
            onClick={refresh}
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("h-4 w-4", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-4 flex-wrap">
          <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
            Total sessions:{" "}
            <span className="font-normal text-zinc-600 normal-case">
              {data?.total ?? 0}
            </span>
          </span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
          >
            <option value="">All types</option>
            <option value="jobs">Jobs</option>
            <option value="companies">Companies</option>
            <option value="geography">Geography</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Started
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Crawl Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Trigger
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Fetched
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Created
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Updated
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Sources
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Errors
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Finished
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="py-8 text-center text-zinc-500 text-[11px]"
                  >
                    No crawl runs yet. Trigger a crawl from Jobs, Companies, RSS Feeds, Sources, or Geography Seed.
                  </td>
                </tr>
              ) : (
                items.map((run) => (
                  <tr
                    key={run._id}
                    onClick={() => setSelectedId(selectedId === run._id ? null : run._id)}
                    className={cn(
                      "border-b border-gray-100 last:border-0 cursor-pointer transition-colors",
                      selectedId === run._id ? "bg-blue-50/80" : "hover:bg-gray-50/50"
                    )}
                  >
                      <td className="py-2.5 px-4">
                        <span
                          className="block max-w-[140px] truncate text-[9px] font-mono text-zinc-500"
                          title={formatISO(run.startedAt)}
                        >
                          {formatISO(run.startedAt)}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium",
                            run.type === "jobs" && "bg-blue-50 text-blue-700",
                            run.type === "companies" && "bg-violet-50 text-violet-700",
                            run.type === "geography" && "bg-emerald-50 text-emerald-700"
                          )}
                        >
                          {run.typeLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                        <span className="capitalize">{run.trigger ?? "manual"}</span>
                      </td>
                      <td className="py-2.5 px-4">
                        <StatusBadge status={run.status} />
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-zinc-600 font-mono">
                        {run.totalFetched}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-emerald-600 font-mono">
                        {run.totalCreated}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-blue-600 font-mono">
                        {run.totalUpdated}
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-zinc-600 font-mono">
                        {run.sourcesCount}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={cn(
                            "text-[11px] font-mono",
                            run.totalErrors > 0
                              ? "text-red-600"
                              : "text-zinc-500"
                          )}
                        >
                          {run.totalErrors}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-[11px] text-zinc-600 font-mono">
                        {formatDuration(run.durationMs)}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className="block max-w-[140px] truncate text-[9px] font-mono text-zinc-500"
                          title={formatISO(run.finishedAt)}
                        >
                          {formatISO(run.finishedAt)}
                        </span>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={data?.page ?? 1}
          total={data?.total ?? 0}
          limit={PAGE_SIZE}
          onPageChange={fetchData}
        />

        {selectedRun && (
          <SessionDetailsSection
            run={selectedRun}
            sourceStatsPage={sourceStatsPage}
            onSourceStatsPageChange={setSourceStatsPage}
          />
        )}
      </div>
    </div>
  );
}

function SessionDetailsSection({
  run,
  sourceStatsPage,
  onSourceStatsPageChange,
}: {
  run: CrawlRun;
  sourceStatsPage: number;
  onSourceStatsPageChange: (p: number) => void;
}) {
  const sourceStats = run.sourceStats ?? [];
  const totalSourcePages = Math.max(
    1,
    Math.ceil(sourceStats.length / SOURCE_STATS_PAGE_SIZE)
  );
  const paginatedSources = sourceStats.slice(
    (sourceStatsPage - 1) * SOURCE_STATS_PAGE_SIZE,
    sourceStatsPage * SOURCE_STATS_PAGE_SIZE
  );

  const chartData = sourceStats.map((s) => ({
    name: s.source,
    fetched: s.fetched,
    created: s.created,
    updated: s.updated,
    errors: s.errors,
  }));

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-zinc-500" />
        Session details — {formatISO(run.startedAt)}
      </h2>

      {run.params &&
        (run.params.search ||
          run.params.countryCode ||
          run.params.location ||
          run.params.source) && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-2">
              Params
            </div>
            <div className="flex flex-wrap gap-2">
              {run.params.search && (
                <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200 text-[11px]">
                  search: {run.params.search}
                </span>
              )}
              {run.params.countryCode && (
                <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200 text-[11px]">
                  country: {run.params.countryCode}
                </span>
              )}
              {run.params.location && (
                <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200 text-[11px]">
                  location: {run.params.location}
                </span>
              )}
              {run.params.source && (
                <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200 text-[11px]">
                  source: {run.params.source}
                </span>
              )}
            </div>
          </div>
        )}

      {sourceStats.length > 0 && (
        <>
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-3">
              Fetched per source (chart)
            </div>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 60, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={55}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 11 }}
                    labelFormatter={(label) => `Source: ${label}`}
                  />
                  <Bar dataKey="fetched" fill="#3b82f6" name="Fetched" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="created" fill="#10b981" name="Created" radius={[0, 2, 2, 0]} />
                  <Bar dataKey="updated" fill="#6366f1" name="Updated" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                Per-source stats
              </span>
              {totalSourcePages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px]"
                    disabled={sourceStatsPage <= 1}
                    onClick={() => onSourceStatsPageChange(sourceStatsPage - 1)}
                  >
                    ←
                  </Button>
                  <span className="text-[11px] text-zinc-500 px-2">
                    {sourceStatsPage} / {totalSourcePages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px]"
                    disabled={sourceStatsPage >= totalSourcePages}
                    onClick={() => onSourceStatsPageChange(sourceStatsPage + 1)}
                  >
                    →
                  </Button>
                </div>
              )}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200">
                  <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Source
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Fetched
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Created
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Updated
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                    Errors
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSources.map((s) => (
                  <tr
                    key={s.source}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50"
                  >
                    <td className="py-2 px-4 font-mono text-[11px] text-zinc-700 capitalize">
                      {s.source}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-[11px] text-zinc-600">
                      {s.fetched}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-[11px] text-emerald-600">
                      {s.created}
                    </td>
                    <td className="py-2 px-4 text-right font-mono text-[11px] text-blue-600">
                      {s.updated}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <span
                        className={cn(
                          "font-mono text-[11px]",
                          s.errors > 0 ? "text-red-600" : "text-zinc-400"
                        )}
                      >
                        {s.errors}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {run.locationStats && run.locationStats.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100">
            <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
              Per-location stats
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  City
                </th>
                <th className="text-left py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  Country
                </th>
                <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  Queries
                </th>
                <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  Found
                </th>
                <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  Created
                </th>
                <th className="text-right py-2 px-4 font-medium text-zinc-600 text-[11px]">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {run.locationStats.map((s, i) => (
                <tr
                  key={`${s.city}-${s.country}-${i}`}
                  className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50"
                >
                  <td className="py-2 px-4 font-mono text-[11px] text-zinc-700">
                    {s.city}
                  </td>
                  <td className="py-2 px-4 font-mono text-[11px] text-zinc-600">
                    {s.country}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-[11px] text-zinc-600">
                    {s.queries}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-[11px] text-zinc-600">
                    {s.jobsFound}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-[11px] text-emerald-600">
                    {s.created}
                  </td>
                  <td className="py-2 px-4 text-right font-mono text-[11px] text-blue-600">
                    {s.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {run.log && run.log.length > 0 && run.type === "geography" && (
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100">
            <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
              Geography seed log
            </span>
          </div>
          <pre className="whitespace-pre-wrap p-4 font-mono text-zinc-600 text-[10px] max-h-48 overflow-y-auto">
            {run.log.join("\n")}
          </pre>
        </div>
      )}

      {run.errorLog && (
        <div className="rounded-lg border border-red-200 bg-red-50/30 overflow-hidden">
          <div className="px-4 py-3 border-b border-red-100">
            <span className="text-[11px] font-medium text-red-700 uppercase tracking-wider">
              Error log
            </span>
          </div>
          <pre className="whitespace-pre-wrap p-4 font-mono text-red-600 text-[10px] max-h-48 overflow-y-auto">
            {run.errorLog}
          </pre>
        </div>
      )}
    </div>
  );
}

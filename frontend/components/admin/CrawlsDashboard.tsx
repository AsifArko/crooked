"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "./SiteAnalyticsDashboardComponents";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 15;

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
  startedAt: string;
  finishedAt: string;
  status: string;
  crawlType?: string;
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchData = useCallback((p = 1) => {
    setIsRefreshing(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("limit", String(PAGE_SIZE));
    return fetch(`/api/admin/jobs/crawls?${params}`)
      .then((res) => res.json())
      .then((d: CrawlsResponse) => {
        setData(d);
        setPage(d.page ?? p);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  const items = data?.items ?? [];

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

        <div className="mb-4 flex items-center gap-3 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
          <span>
            Total sessions:{" "}
            <span className="font-normal text-zinc-600 normal-case">
              {data?.total ?? 0}
            </span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Started
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Finished
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Type
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
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="py-8 text-center text-zinc-500 text-[11px]"
                  >
                    No crawl runs yet. Trigger a crawl from the Jobs dashboard.
                  </td>
                </tr>
              ) : (
                items.map((run) => (
                  <React.Fragment key={run._id}>
                    <tr
                      key={run._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
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
                          className="block max-w-[140px] truncate text-[9px] font-mono text-zinc-500"
                          title={formatISO(run.finishedAt)}
                        >
                          {formatISO(run.finishedAt)}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                        <span className="capitalize">{run.crawlType ?? "jobs"}</span>
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
                        {(run.sourceStats?.length > 0 ||
                          run.locationStats?.length > 0 ||
                          run.params ||
                          run.errorLog) && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(
                                expandedId === run._id ? null : run._id
                              )
                            }
                            className="text-[11px] text-zinc-500 hover:text-zinc-700"
                          >
                            {expandedId === run._id ? "−" : "+"}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedId === run._id && (
                      <tr>
                        <td
                          colSpan={12}
                          className="bg-zinc-50/80 py-3 px-4 border-b border-gray-100"
                        >
                          <div className="space-y-2 text-[11px]">
                            {run.params &&
                              (run.params.search ||
                                run.params.countryCode ||
                                run.params.location ||
                                run.params.source) && (
                              <div>
                                <div className="font-medium text-zinc-600 uppercase tracking-wider mb-1.5">
                                  Params
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {run.params.search && (
                                    <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200">
                                      search: {run.params.search}
                                    </span>
                                  )}
                                  {run.params.countryCode && (
                                    <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200">
                                      country: {run.params.countryCode}
                                    </span>
                                  )}
                                  {run.params.location && (
                                    <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200">
                                      location: {run.params.location}
                                    </span>
                                  )}
                                  {run.params.source && (
                                    <span className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200">
                                      source: {run.params.source}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                            {run.sourceStats && run.sourceStats.length > 0 && (
                              <div>
                                <div className="font-medium text-zinc-600 uppercase tracking-wider mb-1.5">
                                  Per-source stats
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {run.sourceStats.map((s) => (
                                    <span
                                      key={s.source}
                                      className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200"
                                    >
                                      {s.source}: fetched {s.fetched}, created{" "}
                                      {s.created}, updated {s.updated}
                                      {s.errors > 0 && `, errors ${s.errors}`}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {run.locationStats && run.locationStats.length > 0 && (
                              <div>
                                <div className="font-medium text-zinc-600 uppercase tracking-wider mb-1.5">
                                  Per-location stats
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {run.locationStats.map((s, i) => (
                                    <span
                                      key={`${s.city}-${s.country}-${i}`}
                                      className="inline-block rounded bg-white px-2 py-1 font-mono text-zinc-600 border border-zinc-200"
                                    >
                                      {s.city}, {s.country}: {s.jobsFound} found,
                                      created {s.created}, updated {s.updated}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {run.errorLog && (
                              <div>
                                <div className="font-medium text-zinc-600 uppercase tracking-wider mb-1.5">
                                  Error log
                                </div>
                                <pre className="whitespace-pre-wrap rounded bg-white p-2 font-mono text-red-600 text-[10px] border border-zinc-200 max-h-32 overflow-y-auto">
                                  {run.errorLog}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
      </div>
    </div>
  );
}

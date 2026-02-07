"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";

type Download = {
  _id: string;
  ipAddress?: string;
  hostname?: string;
  userAgent?: string;
  referrer?: string;
  recordedAt: string;
};

type Response = {
  items: Download[];
  total: number;
  page: number;
  limit: number;
  summary: { totalDownloads: number };
};

const CACHE_KEY = "user-downloads-dashboard";
const CACHE_TTL_MS = 30_000;

const formatDate = (s: string) => {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
};

function loadCached(): { data: Response; page: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, page, ts } = JSON.parse(raw) as { data: Response; page: number; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return { data, page };
  } catch {
    return null;
  }
}

function saveCache(data: Response, page: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, page, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function UserDownloadsDashboard() {
  const cached = loadCached();
  const [data, setData] = useState<Response | null>(cached?.data ?? null);
  const [page, setPage] = useState(cached?.page ?? 1);
  const [loading, setLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  const fetchData = useCallback((p = 1) => {
    const hasData = dataRef.current !== null;
    if (hasData) setIsRefreshing(true);
    return fetch(`/api/admin/downloads?page=${p}&limit=20`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setPage(d.page ?? p);
        saveCache(d, d.page ?? p);
      })
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const totalPages = data ? Math.ceil(data.total / (data.limit || 20)) : 1;
  const from = data ? (page - 1) * (data.limit || 20) + 1 : 0;
  const to = data ? Math.min(page * (data.limit || 20), data.total) : 0;

  if (loading && !data) {
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
            <h1 className="text-2xl font-bold text-gray-900">User Download Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">User Downloads</p>
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

        {/* Summary */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{data?.summary?.totalDownloads ?? 0}</span>
            <span className="text-sm text-gray-500">downloads</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">0</span>
            <span className="text-sm text-gray-500">active tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">0</span>
            <span className="text-sm text-gray-500">active sessions</span>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by email or session ID..."
              className="pl-9 bg-white"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" className="w-[160px] bg-white" placeholder="Select date" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">IP ADDRESS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">HOSTNAME</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">USER AGENT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">REFERRER</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">CREATED</th>
                </tr>
              </thead>
              <tbody>
                {(data?.items ?? []).map((row) => (
                  <tr key={row._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs">{row.ipAddress ?? "—"}</td>
                    <td className="py-3 px-4">{row.hostname ?? "—"}</td>
                    <td className="py-3 px-4 max-w-[300px] truncate text-gray-600">{row.userAgent ?? "—"}</td>
                    <td className="py-3 px-4 max-w-[200px] truncate text-gray-600">{row.referrer ?? "—"}</td>
                    <td className="py-3 px-4">{formatDate(row.recordedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {data?.total ? `${from} to ${to}` : "0"} of {data?.total ?? 0} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="w-9"
                    onClick={() => fetchData(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

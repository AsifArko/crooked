"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Rss, CheckCircle, XCircle, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TablePagination } from "./SiteAnalyticsDashboardComponents";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const FEED_TYPES = ["rss", "atom", "greenhouse_rss", "lever_rss", "workable_rss"];

type FeedItem = {
  _id: string;
  url: string;
  category?: string;
  feedType?: string;
  enabled: boolean;
  lastCrawledAt?: string;
  lastError?: string;
  source: { _id: string; slug?: string; name?: string } | null;
};

type SourceOption = { _id: string; slug: string; name?: string };

type FeedsResponse = {
  items: FeedItem[];
  total: number;
  page: number;
  limit: number;
};

function formatDate(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function RSSFeedsDashboard() {
  const [data, setData] = useState<FeedsResponse | null>(null);
  const [sources, setSources] = useState<SourceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [enabledFilter, setEnabledFilter] = useState<string>("all");
  const [editingFeed, setEditingFeed] = useState<FeedItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ url: "", source: "", category: "", feedType: "rss", enabled: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    (p = 1) => {
      setIsRefreshing(true);
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (enabledFilter !== "all") params.set("enabled", enabledFilter);
      return fetch(`/api/admin/jobs/feeds?${params}`)
        .then((res) => res.json())
        .then((d: FeedsResponse) => {
          setData(d);
          setPage(d.page ?? p);
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    },
    [enabledFilter]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    fetch("/api/admin/jobs/sources?limit=100")
      .then((res) => res.json())
      .then((d: { items?: SourceOption[] }) => {
        if (d?.items?.length) setSources(d.items);
      })
      .catch(() => {});
  }, []);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  const items = data?.items ?? [];

  const openEdit = (feed: FeedItem) => {
    setEditingFeed(feed);
    setFormData({
      url: feed.url,
      source: feed.source?._id ?? "",
      category: feed.category ?? "",
      feedType: feed.feedType ?? "rss",
      enabled: feed.enabled,
    });
    setError(null);
  };

  const openAdd = () => {
    setEditingFeed(null);
    setIsAddOpen(true);
    setFormData({ url: "", source: sources[0]?._id ?? "", category: "", feedType: "rss", enabled: true });
    setError(null);
  };

  const closeModal = () => {
    setEditingFeed(null);
    setIsAddOpen(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!formData.url?.trim()) {
      setError("URL is required");
      return;
    }
    if (!formData.source) {
      setError("Source is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingFeed) {
        const res = await fetch(`/api/admin/jobs/feeds/${editingFeed._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: formData.url.trim(),
            source: formData.source,
            category: formData.category.trim() || null,
            feedType: formData.feedType,
            enabled: formData.enabled,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
      } else {
        const res = await fetch("/api/admin/jobs/feeds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: formData.url.trim(),
            source: formData.source,
            category: formData.category.trim() || undefined,
            feedType: formData.feedType,
            enabled: formData.enabled,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create");
      }
      closeModal();
      fetchData(page);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const isModalOpen = !!editingFeed || isAddOpen;

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
              <Rss className="h-7 w-7 text-zinc-600" />
              RSS Feeds
            </h1>
            <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              RSS/Atom feeds used for job crawling
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={enabledFilter}
              onChange={(e) => setEnabledFilter(e.target.value)}
              className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
            >
              <option value="all">All feeds</option>
              <option value="true">Enabled only</option>
              <option value="false">Disabled only</option>
            </select>
            <Button
              onClick={openAdd}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Feed
            </Button>
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
        </div>

        <div className="mb-4 flex items-center gap-3 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
          <span>
            Total feeds:{" "}
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
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  URL
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Last Crawled
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Last Error
                </th>
                <th className="w-12 py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-zinc-500 text-[11px]"
                  >
                    No RSS feeds yet. Add feeds in Studio or run the seed script.
                  </td>
                </tr>
              ) : (
                items.map((feed) => (
                  <tr
                    key={feed._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2.5 px-4">
                      {feed.enabled ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                          <XCircle className="h-3 w-3" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-xs text-zinc-600">
                        {feed.source?.slug ?? feed.source?.name ?? "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 max-w-[280px]">
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-zinc-500 hover:text-zinc-700 hover:underline truncate block font-mono"
                      >
                        {feed.url}
                      </a>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                      {feed.category ?? "—"}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-zinc-600 uppercase">
                      {feed.feedType ?? "rss"}
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-zinc-500">
                      {formatDate(feed.lastCrawledAt)}
                    </td>
                    <td className="py-2.5 px-4 max-w-[200px]">
                      {feed.lastError ? (
                        <span
                          className="text-[11px] text-red-600 truncate block"
                          title={feed.lastError}
                        >
                          {feed.lastError}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEdit(feed)}
                      >
                        <Pencil className="h-4 w-4 text-zinc-500" />
                      </Button>
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

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingFeed ? "Edit Feed" : "Add Feed"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="feed-url">URL</Label>
                <Input
                  id="feed-url"
                  value={formData.url}
                  onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://example.com/jobs.rss"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feed-source">Source</Label>
                <select
                  id="feed-source"
                  value={formData.source}
                  onChange={(e) => setFormData((p) => ({ ...p, source: e.target.value }))}
                  className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                >
                  <option value="">Select source...</option>
                  {sources.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name || s.slug}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feed-category">Category</Label>
                <Input
                  id="feed-category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g. programming, design"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feed-type">Feed Type</Label>
                <select
                  id="feed-type"
                  value={formData.feedType}
                  onChange={(e) => setFormData((p) => ({ ...p, feedType: e.target.value }))}
                  className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                >
                  {FEED_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="feed-enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData((p) => ({ ...p, enabled: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <Label htmlFor="feed-enabled">Enabled</Label>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeModal} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingFeed ? "Save" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

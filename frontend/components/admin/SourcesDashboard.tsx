"use client";

import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Globe, CheckCircle, XCircle, Pencil, Plus, Play } from "lucide-react";
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
const SOURCE_TYPES = ["api", "rss", "greenhouse"];

type SourceItem = {
  _id: string;
  slug: string;
  name?: string;
  url?: string;
  attribution?: string;
  sourceType?: string;
  enabled: boolean;
  rateLimitPerMinute?: number;
};

type SourcesResponse = {
  items: SourceItem[];
  total: number;
  page: number;
  limit: number;
};

export function SourcesDashboard() {
  const [data, setData] = useState<SourcesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [enabledFilter, setEnabledFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingSource, setEditingSource] = useState<SourceItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    url: "",
    attribution: "",
    sourceType: "",
    enabled: true,
    rateLimitPerMinute: "" as string | number,
  });
  const [saving, setSaving] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    (p = 1) => {
      setIsRefreshing(true);
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (enabledFilter !== "all") params.set("enabled", enabledFilter);
      if (typeFilter !== "all") params.set("sourceType", typeFilter);
      return fetch(`/api/admin/jobs/sources?${params}`)
        .then((res) => res.json())
        .then((d: SourcesResponse) => {
          setData(d);
          setPage(d.page ?? p);
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    },
    [enabledFilter, typeFilter]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData(page);
  }, [fetchData, page]);

  const handleCrawl = useCallback(async () => {
    setIsCrawling(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Crawl failed");
      fetchData(1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsCrawling(false);
    }
  }, [fetchData]);

  const items = data?.items ?? [];

  const openEdit = (src: SourceItem) => {
    setEditingSource(src);
    setIsAddOpen(false);
    setFormData({
      slug: src.slug,
      name: src.name ?? "",
      url: src.url ?? "",
      attribution: src.attribution ?? "",
      sourceType: src.sourceType ?? "",
      enabled: src.enabled,
      rateLimitPerMinute: src.rateLimitPerMinute ?? "",
    });
    setError(null);
  };

  const openAdd = () => {
    setEditingSource(null);
    setIsAddOpen(true);
    setFormData({
      slug: "",
      name: "",
      url: "",
      attribution: "",
      sourceType: "",
      enabled: true,
      rateLimitPerMinute: "",
    });
    setError(null);
  };

  const closeModal = () => {
    setEditingSource(null);
    setIsAddOpen(false);
    setError(null);
  };

  const handleSave = async () => {
    const slug = formData.slug?.trim();
    if (!slug) {
      setError("Slug is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingSource) {
        const res = await fetch(`/api/admin/jobs/sources/${editingSource._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            name: formData.name.trim() || null,
            url: formData.url.trim() || null,
            attribution: formData.attribution.trim() || null,
            sourceType: formData.sourceType || null,
            enabled: formData.enabled,
            rateLimitPerMinute: formData.rateLimitPerMinute === "" ? null : Number(formData.rateLimitPerMinute),
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
      } else {
        const res = await fetch("/api/admin/jobs/sources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            name: formData.name.trim() || undefined,
            url: formData.url.trim() || undefined,
            attribution: formData.attribution.trim() || undefined,
            sourceType: formData.sourceType || undefined,
            enabled: formData.enabled,
            rateLimitPerMinute: formData.rateLimitPerMinute === "" ? undefined : Number(formData.rateLimitPerMinute),
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

  const isModalOpen = !!editingSource || isAddOpen;

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
              <Globe className="h-7 w-7 text-zinc-600" />
              Sources
            </h1>
            <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              Job sources (APIs, RSS feeds, Greenhouse)
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
            >
              <option value="all">All types</option>
              <option value="api">API</option>
              <option value="rss">RSS / Atom</option>
              <option value="greenhouse">Greenhouse</option>
            </select>
            <select
              value={enabledFilter}
              onChange={(e) => setEnabledFilter(e.target.value)}
              className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
            >
              <option value="all">All</option>
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
              Add Source
            </Button>
            <Button
              onClick={handleCrawl}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isCrawling}
            >
              <Play className={cn("h-4 w-4", isCrawling && "animate-pulse")} />
              Crawl
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
            Total sources:{" "}
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
                  Slug
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  URL
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Attribution
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                  Rate Limit
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
                    No sources yet. Run the ensure-sources seed script.
                  </td>
                </tr>
              ) : (
                items.map((src) => (
                  <tr
                    key={src._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2.5 px-4">
                      {src.enabled ? (
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
                      <span className="font-mono text-xs text-zinc-700">
                        {src.slug}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                      {src.name ?? "—"}
                    </td>
                    <td className="py-2.5 px-4 max-w-[200px]">
                      {src.url ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-zinc-500 hover:text-zinc-700 hover:underline truncate block font-mono"
                        >
                          {src.url}
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 capitalize">
                        {src.sourceType ?? "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-[11px] text-zinc-500 max-w-[180px] truncate">
                      {src.attribution ?? "—"}
                    </td>
                    <td className="py-2.5 px-4 text-right text-[11px] text-zinc-600 font-mono">
                      {src.rateLimitPerMinute ?? "—"}
                    </td>
                    <td className="py-2.5 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEdit(src)}
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
              <DialogTitle>{editingSource ? "Edit Source" : "Add Source"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="source-slug">Slug</Label>
                <Input
                  id="source-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="e.g. remotive"
                  disabled={!!editingSource}
                  className={editingSource ? "bg-zinc-50" : ""}
                />
                {editingSource && (
                  <p className="text-xs text-zinc-500">Slug cannot be changed after creation.</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-name">Name</Label>
                <Input
                  id="source-name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Remotive"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-url">URL</Label>
                <Input
                  id="source-url"
                  value={formData.url}
                  onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://remotive.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-attribution">Attribution</Label>
                <Input
                  id="source-attribution"
                  value={formData.attribution}
                  onChange={(e) => setFormData((p) => ({ ...p, attribution: e.target.value }))}
                  placeholder="Jobs by Remotive"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-type">Source Type</Label>
                <select
                  id="source-type"
                  value={formData.sourceType}
                  onChange={(e) => setFormData((p) => ({ ...p, sourceType: e.target.value }))}
                  className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                >
                  <option value="">—</option>
                  {SOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source-ratelimit">Rate Limit (per min)</Label>
                <Input
                  id="source-ratelimit"
                  type="number"
                  min={0}
                  value={formData.rateLimitPerMinute}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      rateLimitPerMinute: e.target.value === "" ? "" : e.target.value,
                    }))
                  }
                  placeholder="—"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="source-enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData((p) => ({ ...p, enabled: e.target.checked }))}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <Label htmlFor="source-enabled">Enabled</Label>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeModal} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingSource ? "Save" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

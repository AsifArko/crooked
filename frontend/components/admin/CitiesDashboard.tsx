"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Building2,
  Pencil,
  Plus,
  CheckCircle,
  XCircle,
  Search,
  MapPin,
  Globe,
  BarChart3,
  Play,
} from "lucide-react";
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

const PAGE_SIZE = 25;

type CityItem = {
  _id: string;
  name: string;
  countryCode?: string;
  country?: { _id: string; name?: string } | null;
  state?: string;
  postcode?: string;
  geolocation?: { lat?: number; lng?: number } | null;
  population?: number;
  timezone?: string;
  companiesCount?: number;
  lastCrawledAt?: string;
  crawlEnabled: boolean;
};

type CountryItem = {
  _id: string;
  name: string;
  countryCode: string;
};

type Stats = {
  total: number;
  crawlEnabled: number;
};

export function CitiesDashboard() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [countryCodeFilter, setCountryCodeFilter] = useState("");
  const [crawlEnabledFilter, setCrawlEnabledFilter] = useState<string>("all");
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cityForm, setCityForm] = useState({
    name: "",
    countryId: "",
    countryCode: "",
    state: "",
    postcode: "",
    lat: "" as string | number,
    lng: "" as string | number,
    population: "" as string | number,
    timezone: "",
    crawlEnabled: true,
  });
  const [saving, setSaving] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryOptions, setCountryOptions] = useState<CountryItem[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCities = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (searchDebounced) params.set("search", searchDebounced);
      if (countryCodeFilter) params.set("countryCode", countryCodeFilter);
      if (crawlEnabledFilter !== "all") params.set("crawlEnabled", crawlEnabledFilter);
      return fetch(`/api/admin/cities?${params}`)
        .then((res) => res.json())
        .then((d: { items: CityItem[]; total: number; page: number }) => {
          setCities(d.items);
          setTotal(d.total);
          setPage(d.page ?? p);
        });
    },
    [searchDebounced, countryCodeFilter, crawlEnabledFilter]
  );

  const fetchStats = useCallback(() => {
    return fetch("/api/admin/cities/stats")
      .then((res) => res.json())
      .then((s: Stats) => setStats(s));
  }, []);

  const fetchCountryOptions = useCallback(() => {
    return fetch("/api/admin/countries?limit=500")
      .then((res) => res.json())
      .then((d: { items: CountryItem[] }) => setCountryOptions(d.items || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCities(page),
      fetchStats(),
      fetchCountryOptions(),
    ]).finally(() => setLoading(false));
  }, [
    page,
    searchDebounced,
    countryCodeFilter,
    crawlEnabledFilter,
    fetchCities,
    fetchStats,
    fetchCountryOptions,
  ]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Promise.all([
      fetchCities(page),
      fetchStats(),
      fetchCountryOptions(),
    ]).finally(() => setIsRefreshing(false));
  }, [fetchCities, fetchStats, fetchCountryOptions, page]);

  const handleSeed = useCallback(async () => {
    setIsSeeding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/geography/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "cities_all", batchSize: 10 }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Seed failed");
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSeeding(false);
    }
  }, [refresh]);

  const openEditCity = (c: CityItem) => {
    setEditingCity(c);
    setIsAddOpen(false);
    setCityForm({
      name: c.name,
      countryId: c.country?._id ?? "",
      countryCode: c.countryCode ?? "",
      state: c.state ?? "",
      postcode: c.postcode ?? "",
      lat: c.geolocation?.lat ?? "",
      lng: c.geolocation?.lng ?? "",
      population: c.population ?? "",
      timezone: c.timezone ?? "",
      crawlEnabled: c.crawlEnabled,
    });
    setError(null);
  };

  const openAdd = () => {
    setEditingCity(null);
    setIsAddOpen(true);
    setCityForm({
      name: "",
      countryId: "",
      countryCode: "",
      state: "",
      postcode: "",
      lat: "",
      lng: "",
      population: "",
      timezone: "",
      crawlEnabled: true,
    });
    setError(null);
  };

  const closeModal = () => {
    setEditingCity(null);
    setIsAddOpen(false);
    setError(null);
  };

  const handleSaveCity = async () => {
    const name = cityForm.name.trim();
    if (!name) {
      setError("City name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        countryId: cityForm.countryId || undefined,
        countryCode: cityForm.countryCode.trim() || undefined,
        state: cityForm.state.trim() || undefined,
        postcode: cityForm.postcode.trim() || undefined,
        lat: cityForm.lat === "" ? undefined : Number(cityForm.lat),
        lng: cityForm.lng === "" ? undefined : Number(cityForm.lng),
        population: cityForm.population === "" ? undefined : Number(cityForm.population),
        timezone: cityForm.timezone.trim() || undefined,
        crawlEnabled: cityForm.crawlEnabled,
      };
      if (editingCity) {
        const res = await fetch(`/api/admin/cities/${editingCity._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
      } else {
        const res = await fetch("/api/admin/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create");
      }
      closeModal();
      fetchCities(page);
      fetchStats();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const isModalOpen = !!editingCity || isAddOpen;

  if (loading && cities.length === 0 && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[320px] p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-2 border-slate-200 border-t-slate-600 rounded-full" />
          <p className="text-sm text-slate-500 font-medium">Loading cities…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white">
                <Building2 className="h-5 w-5" />
              </span>
              Cities
            </h1>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Manage city records with geolocation for company crawls and location-based search.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSeed}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-200"
              disabled={isSeeding}
            >
              <Play className={cn("h-4 w-4", isSeeding && "animate-pulse")} />
              Seed Cities
            </Button>
            <Button
              onClick={refresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-slate-200"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
              Refresh
            </Button>
            <Button
              onClick={openAdd}
              size="sm"
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add City
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-600">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Cities
                </p>
                <p className="text-2xl font-semibold text-slate-900 tabular-nums">
                  {stats?.total?.toLocaleString() ?? "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Crawl Enabled
                </p>
                <p className="text-2xl font-semibold text-slate-900 tabular-nums">
                  {stats?.crawlEnabled?.toLocaleString() ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search cities or country code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white border-slate-200 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Country (e.g. US)"
              value={countryCodeFilter}
              onChange={(e) => setCountryCodeFilter(e.target.value.toUpperCase())}
              className="h-10 w-28 text-sm bg-white border-slate-200 rounded-lg font-mono"
            />
            <select
              value={crawlEnabledFilter}
              onChange={(e) => setCrawlEnabledFilter(e.target.value)}
              className="h-10 px-4 text-sm border border-slate-200 rounded-lg bg-white text-slate-700"
            >
              <option value="all">All crawl status</option>
              <option value="true">Crawl enabled only</option>
              <option value="false">Crawl disabled only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    City
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    Country
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    Coordinates
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    Population
                  </th>
                  <th className="text-left py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    Crawl
                  </th>
                  <th className="text-right py-4 px-5 font-medium text-slate-600 text-xs uppercase tracking-wider">
                    Companies
                  </th>
                  <th className="w-14 py-4 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {cities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400">
                          <Globe className="h-6 w-6" />
                        </span>
                        <p className="text-sm font-medium text-slate-600">
                          No cities found
                        </p>
                        <p className="text-xs text-slate-500 max-w-xs">
                          {search || countryCodeFilter || crawlEnabledFilter !== "all"
                            ? "Try adjusting your filters."
                            : "Add a city or run the geography seed to populate."}
                        </p>
                        {!search && !countryCodeFilter && crawlEnabledFilter === "all" && (
                          <Button
                            onClick={openAdd}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add City
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  cities.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <span className="font-medium text-slate-900">{c.name}</span>
                        {c.state && (
                          <span className="ml-2 text-xs text-slate-500">· {c.state}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-sm text-slate-600">
                          {c.country?.name ?? c.countryCode ?? "—"}
                        </span>
                        {c.countryCode && (
                          <span className="ml-1.5 font-mono text-xs text-slate-400">
                            ({c.countryCode})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-slate-500">
                        {c.geolocation?.lat != null && c.geolocation?.lng != null
                          ? `${c.geolocation.lat.toFixed(4)}, ${c.geolocation.lng.toFixed(4)}`
                          : "—"}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="text-sm text-slate-600">
                          {c.population != null
                            ? c.population.toLocaleString()
                            : "—"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        {c.crawlEnabled ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            <XCircle className="h-3.5 w-3.5" />
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex items-center gap-1 font-mono text-sm text-slate-600">
                          <BarChart3 className="h-4 w-4 text-slate-400" />
                          {c.companiesCount ?? 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                          onClick={() => openEditCity(c)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {cities.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/30">
              <TablePagination
                page={page}
                total={total}
                limit={PAGE_SIZE}
                onPageChange={fetchCities}
              />
            </div>
          )}
        </div>

        {/* Edit/Add modal */}
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCity ? "Edit City" : "Add City"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="city-name">City Name *</Label>
                <Input
                  id="city-name"
                  value={cityForm.name}
                  onChange={(e) =>
                    setCityForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. New York"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city-country">Country</Label>
                <select
                  id="city-country"
                  value={cityForm.countryId}
                  onChange={(e) => {
                    const opt = countryOptions.find((c) => c._id === e.target.value);
                    setCityForm((p) => ({
                      ...p,
                      countryId: e.target.value,
                      countryCode: opt?.countryCode ?? "",
                    }));
                  }}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                >
                  <option value="">— Select country —</option>
                  {countryOptions.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.countryCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="city-state">State / Region</Label>
                  <Input
                    id="city-state"
                    value={cityForm.state}
                    onChange={(e) =>
                      setCityForm((p) => ({ ...p, state: e.target.value }))
                    }
                    placeholder="e.g. New York"
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city-postcode">Postcode</Label>
                  <Input
                    id="city-postcode"
                    value={cityForm.postcode}
                    onChange={(e) =>
                      setCityForm((p) => ({ ...p, postcode: e.target.value }))
                    }
                    placeholder="e.g. 10001"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="city-lat">Latitude</Label>
                  <Input
                    id="city-lat"
                    type="number"
                    step="any"
                    value={cityForm.lat}
                    onChange={(e) =>
                      setCityForm((p) => ({
                        ...p,
                        lat: e.target.value === "" ? "" : e.target.value,
                      }))
                    }
                    placeholder="e.g. 40.7128"
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city-lng">Longitude</Label>
                  <Input
                    id="city-lng"
                    type="number"
                    step="any"
                    value={cityForm.lng}
                    onChange={(e) =>
                      setCityForm((p) => ({
                        ...p,
                        lng: e.target.value === "" ? "" : e.target.value,
                      }))
                    }
                    placeholder="e.g. -74.0060"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="city-population">Population</Label>
                  <Input
                    id="city-population"
                    type="number"
                    value={cityForm.population}
                    onChange={(e) =>
                      setCityForm((p) => ({
                        ...p,
                        population: e.target.value === "" ? "" : e.target.value,
                      }))
                    }
                    placeholder="—"
                    className="rounded-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city-timezone">Timezone</Label>
                  <Input
                    id="city-timezone"
                    value={cityForm.timezone}
                    onChange={(e) =>
                      setCityForm((p) => ({ ...p, timezone: e.target.value }))
                    }
                    placeholder="e.g. America/New_York"
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="city-crawl"
                  checked={cityForm.crawlEnabled}
                  onChange={(e) =>
                    setCityForm((p) => ({ ...p, crawlEnabled: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                <Label htmlFor="city-crawl">Include in company crawls</Label>
              </div>
              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCity}
                  disabled={saving}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {saving ? "Saving…" : editingCity ? "Save" : "Add"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  MapPin,
  Pencil,
  Plus,
  CheckCircle,
  XCircle,
  Map,
  Building2,
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

const PAGE_SIZE = 20;

type CountryItem = {
  _id: string;
  name: string;
  countryCode: string;
  slug?: string;
  region?: string;
  population?: number;
  lastSyncedAt?: string;
};

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

type Tab = "countries" | "cities";

export function CountriesDashboard() {
  const [tab, setTab] = useState<Tab>("countries");
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [countriesTotal, setCountriesTotal] = useState(0);
  const [citiesTotal, setCitiesTotal] = useState(0);
  const [countriesPage, setCountriesPage] = useState(1);
  const [citiesPage, setCitiesPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [countryCodeFilter, setCountryCodeFilter] = useState("");
  const [crawlEnabledFilter, setCrawlEnabledFilter] = useState<string>("all");
  const [editingCountry, setEditingCountry] = useState<CountryItem | null>(null);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [countryForm, setCountryForm] = useState({
    name: "",
    countryCode: "",
    slug: "",
    region: "",
    population: "" as string | number,
  });
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

  const fetchCountries = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (search && tab === "countries") params.set("search", search);
      return fetch(`/api/admin/countries?${params}`)
        .then((res) => res.json())
        .then((d: { items: CountryItem[]; total: number; page: number }) => {
          setCountries(d.items);
          setCountriesTotal(d.total);
          setCountriesPage(d.page ?? p);
        });
    },
    [search, tab]
  );

  const fetchCities = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (search && tab === "cities") params.set("search", search);
      if (countryCodeFilter) params.set("countryCode", countryCodeFilter);
      if (crawlEnabledFilter !== "all") params.set("crawlEnabled", crawlEnabledFilter);
      return fetch(`/api/admin/cities?${params}`)
        .then((res) => res.json())
        .then((d: { items: CityItem[]; total: number; page: number }) => {
          setCities(d.items);
          setCitiesTotal(d.total);
          setCitiesPage(d.page ?? p);
        });
    },
    [search, tab, countryCodeFilter, crawlEnabledFilter]
  );

  const fetchCountryOptions = useCallback(() => {
    return fetch("/api/admin/countries?limit=500")
      .then((res) => res.json())
      .then((d: { items: CountryItem[] }) => setCountryOptions(d.items || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      tab === "countries" ? fetchCountries(countriesPage) : fetchCities(citiesPage),
      fetchCountryOptions(),
    ]).finally(() => setLoading(false));
  }, [
    tab,
    countriesPage,
    citiesPage,
    search,
    countryCodeFilter,
    crawlEnabledFilter,
    fetchCountries,
    fetchCities,
    fetchCountryOptions,
  ]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Promise.all([
      fetchCountries(countriesPage),
      fetchCities(citiesPage),
      fetchCountryOptions(),
    ]).finally(() => setIsRefreshing(false));
  }, [fetchCountries, fetchCities, fetchCountryOptions, countriesPage, citiesPage]);

  const handleSeed = useCallback(async () => {
    setIsSeeding(true);
    setError(null);
    try {
      const mode = tab === "countries" ? "countries" : "cities_all";
      const res = await fetch("/api/admin/geography/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, batchSize: 10 }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Seed failed");
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsSeeding(false);
    }
  }, [tab, refresh]);

  const openEditCountry = (c: CountryItem) => {
    setEditingCountry(c);
    setEditingCity(null);
    setIsAddOpen(false);
    setCountryForm({
      name: c.name,
      countryCode: c.countryCode,
      slug: c.slug ?? "",
      region: c.region ?? "",
      population: c.population ?? "",
    });
    setError(null);
  };

  const openEditCity = (c: CityItem) => {
    setEditingCity(c);
    setEditingCountry(null);
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
    setEditingCountry(null);
    setEditingCity(null);
    setIsAddOpen(true);
    if (tab === "countries") {
      setCountryForm({
        name: "",
        countryCode: "",
        slug: "",
        region: "",
        population: "",
      });
    } else {
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
    }
    setError(null);
  };

  const closeModal = () => {
    setEditingCountry(null);
    setEditingCity(null);
    setIsAddOpen(false);
    setError(null);
  };

  const handleSaveCountry = async () => {
    const name = countryForm.name.trim();
    const countryCode = countryForm.countryCode.trim().toUpperCase();
    if (!name || !countryCode) {
      setError("Name and country code are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingCountry) {
        const res = await fetch(`/api/admin/countries/${editingCountry._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            countryCode,
            slug: countryForm.slug.trim() || null,
            region: countryForm.region.trim() || null,
            population: countryForm.population === "" ? null : Number(countryForm.population),
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
      } else {
        const res = await fetch("/api/admin/countries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            countryCode,
            slug: countryForm.slug.trim() || undefined,
            region: countryForm.region.trim() || undefined,
            population: countryForm.population === "" ? undefined : Number(countryForm.population),
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create");
      }
      closeModal();
      fetchCountries(countriesPage);
      fetchCountryOptions();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
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
      fetchCities(citiesPage);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const isModalOpen = !!editingCountry || !!editingCity || isAddOpen;

  if (loading && countries.length === 0 && cities.length === 0) {
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
              <MapPin className="h-7 w-7 text-zinc-600" />
              Countries & Cities
            </h1>
            <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              Geographic data with city geolocation for company crawls
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleSeed}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isSeeding}
            >
              <Play className={cn("h-4 w-4", isSeeding && "animate-pulse")} />
              Seed {tab === "countries" ? "Countries" : "Cities"}
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
            <Button
              onClick={openAdd}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add {tab === "countries" ? "Country" : "City"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("countries")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === "countries"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Map className="h-4 w-4" />
            Countries ({countriesTotal})
          </button>
          <button
            onClick={() => setTab("cities")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === "cities"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Building2 className="h-4 w-4" />
            Cities ({citiesTotal})
          </button>
        </div>

        {tab === "countries" && (
          <>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <Input
                placeholder="Search countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-48 text-sm"
              />
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Code
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Region
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Population
                    </th>
                    <th className="w-12 py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {countries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500 text-[11px]">
                        No countries yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    countries.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                      >
                        <td className="py-2.5 px-4 font-medium text-zinc-800">{c.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="font-mono text-xs text-zinc-600">{c.countryCode}</span>
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-500">{c.region ?? "—"}</td>
                        <td className="py-2.5 px-4 text-right text-[11px] text-zinc-600 font-mono">
                          {c.population != null ? c.population.toLocaleString() : "—"}
                        </td>
                        <td className="py-2.5 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditCountry(c)}
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
              page={countriesPage}
              total={countriesTotal}
              limit={PAGE_SIZE}
              onPageChange={fetchCountries}
            />
          </>
        )}

        {tab === "cities" && (
          <>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <Input
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-48 text-sm"
              />
              <Input
                placeholder="Country code (e.g. US)"
                value={countryCodeFilter}
                onChange={(e) => setCountryCodeFilter(e.target.value)}
                className="h-9 w-36 text-sm"
              />
              <select
                value={crawlEnabledFilter}
                onChange={(e) => setCrawlEnabledFilter(e.target.value)}
                className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
              >
                <option value="all">All</option>
                <option value="true">Crawl enabled only</option>
                <option value="false">Crawl disabled only</option>
              </select>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Postcode
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Coordinates
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Crawl
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Companies
                    </th>
                    <th className="w-12 py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {cities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500 text-[11px]">
                        No cities yet. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    cities.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                      >
                        <td className="py-2.5 px-4 font-medium text-zinc-800">{c.name}</td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                          {c.country?.name ?? c.countryCode ?? "—"}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] font-mono text-zinc-500">
                          {c.postcode ?? "—"}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] font-mono text-zinc-500">
                          {c.geolocation?.lat != null && c.geolocation?.lng != null
                            ? `${c.geolocation.lat.toFixed(4)}, ${c.geolocation.lng.toFixed(4)}`
                            : "—"}
                        </td>
                        <td className="py-2.5 px-4">
                          {c.crawlEnabled ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              <CheckCircle className="h-3 w-3" />
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                              <XCircle className="h-3 w-3" />
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[11px] font-mono text-zinc-600">
                          {c.companiesCount ?? 0}
                        </td>
                        <td className="py-2.5 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditCity(c)}
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
              page={citiesPage}
              total={citiesTotal}
              limit={PAGE_SIZE}
              onPageChange={fetchCities}
            />
          </>
        )}

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCountry
                  ? "Edit Country"
                  : editingCity
                    ? "Edit City"
                    : `Add ${tab === "countries" ? "Country" : "City"}`}
              </DialogTitle>
            </DialogHeader>
            {tab === "countries" && (editingCountry || isAddOpen) && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="country-name">Name</Label>
                  <Input
                    id="country-name"
                    value={countryForm.name}
                    onChange={(e) =>
                      setCountryForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. United States"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country-code">Country Code (ISO)</Label>
                  <Input
                    id="country-code"
                    value={countryForm.countryCode}
                    onChange={(e) =>
                      setCountryForm((p) => ({
                        ...p,
                        countryCode: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="e.g. US"
                    maxLength={2}
                    disabled={!!editingCountry}
                    className={editingCountry ? "bg-zinc-50" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country-slug">Slug</Label>
                  <Input
                    id="country-slug"
                    value={countryForm.slug}
                    onChange={(e) =>
                      setCountryForm((p) => ({ ...p, slug: e.target.value }))
                    }
                    placeholder="e.g. us"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country-region">Region</Label>
                  <Input
                    id="country-region"
                    value={countryForm.region}
                    onChange={(e) =>
                      setCountryForm((p) => ({ ...p, region: e.target.value }))
                    }
                    placeholder="e.g. North America"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country-population">Population</Label>
                  <Input
                    id="country-population"
                    type="number"
                    value={countryForm.population}
                    onChange={(e) =>
                      setCountryForm((p) => ({
                        ...p,
                        population: e.target.value === "" ? "" : e.target.value,
                      }))
                    }
                    placeholder="—"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={closeModal} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCountry} disabled={saving}>
                    {saving ? "Saving..." : editingCountry ? "Save" : "Add"}
                  </Button>
                </DialogFooter>
              </div>
            )}
            {tab === "cities" && (editingCity || isAddOpen) && (
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
                    className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    <option value="">— Select country —</option>
                    {countryOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.countryCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="city-state">State / Region</Label>
                    <Input
                      id="city-state"
                      value={cityForm.state}
                      onChange={(e) =>
                        setCityForm((p) => ({ ...p, state: e.target.value }))
                      }
                      placeholder="e.g. New York"
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
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
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
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  <Label htmlFor="city-crawl">Include in company crawls</Label>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={closeModal} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCity} disabled={saving}>
                    {saving ? "Saving..." : editingCity ? "Save" : "Add"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

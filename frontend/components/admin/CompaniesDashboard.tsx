"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  RefreshCw,
  Building2,
  Pencil,
  Plus,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Database,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;
const CRAWLS_PAGE_SIZE = 15;

const INDUSTRY_OPTIONS = [
  { value: "software", label: "Software / SaaS" },
  { value: "it_services", label: "IT Services" },
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "gaming", label: "Gaming" },
  { value: "ai_ml", label: "AI / ML" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "other", label: "Other" },
];

type CompanyItem = {
  _id: string;
  name: string;
  slug?: string;
  website?: string;
  industry?: string;
  city?: { _id: string; name?: string } | null;
  country?: { _id: string; name?: string; countryCode?: string } | null;
  employeeCount?: string;
  foundedYear?: number;
  crawlSource?: string;
  lastCrawledAt?: string;
};

type CrawlRunItem = {
  _id: string;
  startedAt?: string;
  finishedAt?: string;
  status?: string;
  trigger?: string;
  params?: { cityId?: string; countryCode?: string; crawlSource?: string };
  totalFetched?: number;
  totalCreated?: number;
  totalUpdated?: number;
  totalErrors?: number;
  durationMs?: number;
  errorLog?: string;
};

type Tab = "companies" | "crawls";

function formatISO(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
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
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
        <Loader2 className="h-3 w-3 animate-spin" />
        Running
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
      {status || "—"}
    </span>
  );
}

export function CompaniesDashboard() {
  const [tab, setTab] = useState<Tab>("companies");
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [crawls, setCrawls] = useState<CrawlRunItem[]>([]);
  const [companiesTotal, setCompaniesTotal] = useState(0);
  const [crawlsTotal, setCrawlsTotal] = useState(0);
  const [companiesPage, setCompaniesPage] = useState(1);
  const [crawlsPage, setCrawlsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [countryCodeFilter, setCountryCodeFilter] = useState("");
  const [cityIdFilter, setCityIdFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingCompany, setEditingCompany] = useState<CompanyItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: "",
    slug: "",
    website: "",
    description: "",
    industry: "",
    cityId: "",
    countryId: "",
    addressRaw: "",
    employeeCount: "",
    foundedYear: "" as string | number,
    linkedInUrl: "",
    crawlSource: "",
  });
  const [saving, setSaving] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countryOptions, setCountryOptions] = useState<{ _id: string; name: string; countryCode: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ _id: string; name: string; countryCode?: string }[]>([]);

  const fetchCompanies = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (searchDebounced) params.set("search", searchDebounced);
      if (countryCodeFilter) params.set("countryCode", countryCodeFilter);
      if (cityIdFilter) params.set("cityId", cityIdFilter);
      if (industryFilter) params.set("industry", industryFilter);
      return fetch(`/api/admin/companies?${params}`)
        .then((res) => res.json())
        .then((d: { items: CompanyItem[]; total: number; page: number }) => {
          setCompanies(d.items);
          setCompaniesTotal(d.total);
          setCompaniesPage(d.page ?? p);
        });
    },
    [searchDebounced, countryCodeFilter, cityIdFilter, industryFilter]
  );

  const fetchCrawls = useCallback(
    (p = 1) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(CRAWLS_PAGE_SIZE));
      if (statusFilter) params.set("status", statusFilter);
      return fetch(`/api/admin/companies/crawls?${params}`)
        .then((res) => res.json())
        .then((d: { items: CrawlRunItem[]; total: number; page: number }) => {
          setCrawls(d.items);
          setCrawlsTotal(d.total);
          setCrawlsPage(d.page ?? p);
        });
    },
    [statusFilter]
  );

  const fetchOptions = useCallback(() => {
    return Promise.all([
      fetch("/api/admin/countries?limit=500")
        .then((r) => r.json())
        .then((d: { items: { _id: string; name: string; countryCode: string }[] }) =>
          setCountryOptions(d.items || [])
        ),
      fetch("/api/admin/cities?limit=500")
        .then((r) => r.json())
        .then((d: { items: { _id: string; name: string; countryCode?: string }[] }) =>
          setCityOptions(d.items || [])
        ),
    ]);
  }, []);

  useEffect(() => {
    setLoading(true);
    if (tab === "companies") {
      fetchCompanies(companiesPage).finally(() => setLoading(false));
    } else {
      fetchCrawls(crawlsPage).finally(() => setLoading(false));
    }
  }, [
    tab,
    companiesPage,
    crawlsPage,
    searchDebounced,
    countryCodeFilter,
    cityIdFilter,
    industryFilter,
    statusFilter,
    fetchCompanies,
    fetchCrawls,
  ]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (countryCodeFilter && cityIdFilter) {
      const city = cityOptions.find((c) => c._id === cityIdFilter);
      if (
        city?.countryCode &&
        city.countryCode.toUpperCase() !== countryCodeFilter.toUpperCase()
      ) {
        setCityIdFilter("");
      }
    }
  }, [countryCodeFilter, cityIdFilter, cityOptions]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Promise.all([
      fetchCompanies(companiesPage),
      fetchCrawls(crawlsPage),
      fetchOptions(),
    ]).finally(() => setIsRefreshing(false));
  }, [fetchCompanies, fetchCrawls, fetchOptions, companiesPage, crawlsPage]);

  const handleCrawl = useCallback(async () => {
    setIsCrawling(true);
    setError(null);
    try {
      const body: Record<string, string> = {};
      if (searchDebounced?.trim()) body.search = searchDebounced.trim();
      if (countryCodeFilter?.trim()) body.countryCode = countryCodeFilter.trim();
      if (cityIdFilter?.trim()) body.cityId = cityIdFilter.trim();
      if (industryFilter?.trim()) body.industry = industryFilter.trim();

      const res = await fetch("/api/admin/companies/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || "Crawl failed");
      fetchCrawls(1);
      if (tab === "companies") fetchCompanies(companiesPage);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsCrawling(false);
    }
  }, [
    searchDebounced,
    countryCodeFilter,
    cityIdFilter,
    industryFilter,
    fetchCrawls,
    fetchCompanies,
    tab,
    companiesPage,
  ]);

  const openEditCompany = (c: CompanyItem) => {
    setEditingCompany(c);
    setIsAddOpen(false);
    setCompanyForm({
      name: c.name,
      slug: c.slug ?? "",
      website: c.website ?? "",
      description: "",
      industry: c.industry ?? "",
      cityId: c.city?._id ?? "",
      countryId: c.country?._id ?? "",
      addressRaw: "",
      employeeCount: c.employeeCount ?? "",
      foundedYear: c.foundedYear ?? "",
      linkedInUrl: "",
      crawlSource: c.crawlSource ?? "",
    });
    setError(null);
  };

  const openAdd = () => {
    setEditingCompany(null);
    setIsAddOpen(true);
    setCompanyForm({
      name: "",
      slug: "",
      website: "",
      description: "",
      industry: "",
      cityId: "",
      countryId: "",
      addressRaw: "",
      employeeCount: "",
      foundedYear: "",
      linkedInUrl: "",
      crawlSource: "",
    });
    setError(null);
  };

  const closeModal = () => {
    setEditingCompany(null);
    setIsAddOpen(false);
    setError(null);
  };

  const handleSaveCompany = async () => {
    const name = companyForm.name.trim();
    if (!name) {
      setError("Company name is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        slug: companyForm.slug.trim() || undefined,
        website: companyForm.website.trim() || undefined,
        description: companyForm.description.trim() || undefined,
        industry: companyForm.industry || undefined,
        cityId: companyForm.cityId || undefined,
        countryId: companyForm.countryId || undefined,
        addressRaw: companyForm.addressRaw.trim() || undefined,
        employeeCount: companyForm.employeeCount.trim() || undefined,
        foundedYear: companyForm.foundedYear === "" ? undefined : Number(companyForm.foundedYear),
        linkedInUrl: companyForm.linkedInUrl.trim() || undefined,
        crawlSource: companyForm.crawlSource || undefined,
      };
      if (editingCompany) {
        const res = await fetch(`/api/admin/companies/${editingCompany._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update");
      } else {
        const res = await fetch("/api/admin/companies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create");
      }
      closeModal();
      fetchCompanies(companiesPage);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const isModalOpen = !!editingCompany || isAddOpen;

  if (loading && companies.length === 0 && crawls.length === 0) {
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
              <Building2 className="h-7 w-7 text-zinc-600" />
              Companies
            </h1>
            <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
              IT / Software companies by city — crawler-managed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCrawl}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isCrawling}
              title="Uses country/city filters above for geo-targeting. Select country to crawl companies in that region."
            >
              <Play className={cn("h-4 w-4", isCrawling && "animate-pulse")} />
              Crawl
            </Button>
            <span className="text-[10px] text-zinc-500">
              Uses country/city filters for geo-targeting
            </span>
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
            {tab === "companies" && (
              <Button
                onClick={openAdd}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            )}
          </div>
        </div>

        {error && !isModalOpen && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("companies")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === "companies"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Building2 className="h-4 w-4" />
            Companies ({companiesTotal})
          </button>
          <button
            onClick={() => setTab("crawls")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === "crawls"
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            <Database className="h-4 w-4" />
            Crawl Runs ({crawlsTotal})
          </button>
        </div>

        {tab === "companies" && (
          <>
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Search companies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 w-56 rounded-lg border-zinc-200 bg-white shadow-sm focus:ring-2 focus:ring-zinc-200"
                />
              </div>
              <Select
                value={countryCodeFilter || "all"}
                onValueChange={(v) => setCountryCodeFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-10 w-[180px] rounded-lg border-zinc-200 bg-white shadow-sm focus:ring-2 focus:ring-zinc-200">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {countryOptions.map((c) => (
                    <SelectItem key={c._id} value={c.countryCode}>
                      {c.name} ({c.countryCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={cityIdFilter || "all"}
                onValueChange={(v) => {
                  setCityIdFilter(v === "all" ? "" : v);
                }}
              >
                <SelectTrigger className="h-10 w-[180px] rounded-lg border-zinc-200 bg-white shadow-sm focus:ring-2 focus:ring-zinc-200">
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cities</SelectItem>
                  {(countryCodeFilter
                    ? cityOptions.filter(
                        (c) =>
                          c.countryCode?.toUpperCase() ===
                          countryCodeFilter.toUpperCase()
                      )
                    : cityOptions
                  ).map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                      {c.countryCode ? ` (${c.countryCode})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={industryFilter || "all"}
                onValueChange={(v) => setIndustryFilter(v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-10 w-[180px] rounded-lg border-zinc-200 bg-white shadow-sm focus:ring-2 focus:ring-zinc-200">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All industries</SelectItem>
                  {INDUSTRY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      City
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Country
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Website
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Source
                    </th>
                    <th className="w-12 py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500 text-[11px]">
                        No companies yet. Add one or run a company crawl.
                      </td>
                    </tr>
                  ) : (
                    companies.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                      >
                        <td className="py-2.5 px-4 font-medium text-zinc-800">{c.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 capitalize">
                            {c.industry?.replace("_", " ") ?? "—"}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                          {c.city?.name ?? "—"}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-600">
                          {c.country?.name ?? c.country?.countryCode ?? "—"}
                        </td>
                        <td className="py-2.5 px-4 max-w-[180px]">
                          {c.website ? (
                            <a
                              href={c.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline truncate"
                            >
                              {c.website.replace(/^https?:\/\//, "").slice(0, 30)}…
                              <ExternalLink className="h-3 w-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-500 capitalize">
                          {c.crawlSource?.replace("_", " ") ?? "—"}
                        </td>
                        <td className="py-2.5 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditCompany(c)}
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
              page={companiesPage}
              total={companiesTotal}
              limit={PAGE_SIZE}
              onPageChange={fetchCompanies}
            />
          </>
        )}

        {tab === "crawls" && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 text-[13px] border border-zinc-200 rounded-md bg-white"
              >
                <option value="">All statuses</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="skipped">Skipped</option>
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
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Trigger
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
                      Errors
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-[11px] uppercase tracking-wider">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {crawls.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-500 text-[11px]">
                        No company crawl runs yet. Implement a company crawler to populate this.
                      </td>
                    </tr>
                  ) : (
                    crawls.map((r) => (
                      <tr
                        key={r._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                      >
                        <td className="py-2.5 px-4 text-[11px] font-mono text-zinc-600">
                          {formatISO(r.startedAt)}
                        </td>
                        <td className="py-2.5 px-4">
                          <StatusBadge status={r.status ?? ""} />
                        </td>
                        <td className="py-2.5 px-4 text-[11px] text-zinc-600 capitalize">
                          {r.trigger ?? "—"}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[11px] text-zinc-600">
                          {r.totalFetched ?? 0}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[11px] text-emerald-600">
                          {r.totalCreated ?? 0}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[11px] text-blue-600">
                          {r.totalUpdated ?? 0}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span
                            className={cn(
                              "font-mono text-[11px]",
                              (r.totalErrors ?? 0) > 0 ? "text-red-600" : "text-zinc-500"
                            )}
                          >
                            {r.totalErrors ?? 0}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-[11px] text-zinc-600">
                          {formatDuration(r.durationMs)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination
              page={crawlsPage}
              total={crawlsTotal}
              limit={CRAWLS_PAGE_SIZE}
              onPageChange={fetchCrawls}
            />
          </>
        )}

        <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCompany ? "Edit Company" : "Add Company"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  value={companyForm.name}
                  onChange={(e) =>
                    setCompanyForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Acme Inc"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="company-industry">Industry</Label>
                  <select
                    id="company-industry"
                    value={companyForm.industry}
                    onChange={(e) =>
                      setCompanyForm((p) => ({ ...p, industry: e.target.value }))
                    }
                    className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    <option value="">—</option>
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-crawl-source">Crawl Source</Label>
                  <select
                    id="company-crawl-source"
                    value={companyForm.crawlSource}
                    onChange={(e) =>
                      setCompanyForm((p) => ({ ...p, crawlSource: e.target.value }))
                    }
                    className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    <option value="">—</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="google_maps">Google Maps</option>
                    <option value="crunchbase">Crunchbase</option>
                    <option value="manual">Manual</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="company-country">Country</Label>
                  <select
                    id="company-country"
                    value={companyForm.countryId}
                    onChange={(e) =>
                      setCompanyForm((p) => ({ ...p, countryId: e.target.value }))
                    }
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
                <div className="grid gap-2">
                  <Label htmlFor="company-city">City</Label>
                  <select
                    id="company-city"
                    value={companyForm.cityId}
                    onChange={(e) =>
                      setCompanyForm((p) => ({ ...p, cityId: e.target.value }))
                    }
                    className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm"
                  >
                    <option value="">— Select city —</option>
                    {cityOptions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} {c.countryCode ? `(${c.countryCode})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-website">Website</Label>
                <Input
                  id="company-website"
                  type="url"
                  value={companyForm.website}
                  onChange={(e) =>
                    setCompanyForm((p) => ({ ...p, website: e.target.value }))
                  }
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-description">Description</Label>
                <textarea
                  id="company-description"
                  value={companyForm.description}
                  onChange={(e) =>
                    setCompanyForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Brief company description"
                  rows={3}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="company-employees">Employee Count</Label>
                  <Input
                    id="company-employees"
                    value={companyForm.employeeCount}
                    onChange={(e) =>
                      setCompanyForm((p) => ({ ...p, employeeCount: e.target.value }))
                    }
                    placeholder="e.g. 11-50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-founded">Founded Year</Label>
                  <Input
                    id="company-founded"
                    type="number"
                    value={companyForm.foundedYear}
                    onChange={(e) =>
                      setCompanyForm((p) => ({
                        ...p,
                        foundedYear: e.target.value === "" ? "" : e.target.value,
                      }))
                    }
                    placeholder="e.g. 2020"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={closeModal} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveCompany} disabled={saving}>
                  {saving ? "Saving..." : editingCompany ? "Save" : "Add"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  Filter,
  X,
  ExternalLink,
  Briefcase,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { TablePagination } from "./SiteAnalyticsDashboardComponents";
import { COUNTRIES, countryFlag } from "@/lib/countries";
import { parseContactFromText } from "@/lib/jobs/parse-contact";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const PAGE_SIZE = 10;

type JobItem = {
  _id: string;
  title: string;
  companyName: string;
  description?: string;
  url: string;
  locationRaw: string;
  remote: boolean;
  postedAt: string;
  jobType?: string;
  category?: string;
  tags?: string[];
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  urlDomain?: string;
  source: { name?: string; slug?: string } | null;
  place: { name?: string; displayName?: string; country?: string; countryCode?: string } | null;
};

type JobsResponse = {
  items: JobItem[];
  total: number;
  page: number;
  limit: number;
};

type OverviewResponse = {
  totalJobs: number;
  jobsToday: number;
  topSources: { source: string; count: number }[];
  topCountries: { countryCode: string; country: string; count: number }[];
  lastCrawledAt?: string;
};

const SOURCE_OPTIONS_FALLBACK = [
  { value: "all", label: "All sources" },
  { value: "remotive", label: "Remotive" },
  { value: "arbeitnow", label: "Arbeitnow" },
  { value: "adzuna", label: "Adzuna" },
  { value: "themuse", label: "The Muse" },
  { value: "usajobs", label: "USAJOBS" },
];

const REMOTE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "true", label: "Remote only" },
  { value: "false", label: "On-site only" },
];

const FILTER_SELECT_CLASS =
  "h-9 w-full min-w-0 appearance-none bg-white border border-zinc-200 rounded-md pl-3 pr-8 py-2 text-[13px] text-zinc-700 focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-200 cursor-pointer";

function FilterDropdown({
  value,
  onChange,
  options,
  searchPlaceholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const label =
    options.find((o) => o.value === value)?.label ?? options[0]?.label ?? "";
  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase().trim();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            FILTER_SELECT_CLASS,
            "text-left flex items-center justify-between gap-1",
          )}
        >
          <span className="truncate min-w-0">{label}</span>
          <span className="text-zinc-400 shrink-0">▾</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[220px] p-0 overflow-hidden border border-zinc-200/90 bg-white shadow-xl rounded-xl"
      >
        <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-zinc-200 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            />
          </div>
        </div>
        <div className="max-h-[260px] overflow-y-auto py-1">
          {filteredOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
                setQuery("");
              }}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] rounded-md mx-1",
                value === o.value
                  ? "bg-zinc-100 text-zinc-900 font-medium"
                  : "text-zinc-700 hover:bg-zinc-50",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatSalary(min?: number, max?: number, currency?: string): string {
  if (!min && !max) return "—";
  const c = currency || "USD";
  if (min && max) return `${min.toLocaleString()}–${max.toLocaleString()} ${c}`;
  if (min) return `${min.toLocaleString()}+ ${c}`;
  return `${max?.toLocaleString()} ${c}`;
}

export function JobsDashboard() {
  const [data, setData] = useState<JobsResponse | null>(null);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [sourceOptions, setSourceOptions] = useState<{ value: string; label: string }[]>(SOURCE_OPTIONS_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [source, setSource] = useState("all");
  const [remote, setRemote] = useState("all");
  const [countryCode, setCountryCode] = useState("all");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const dataRef = useRef(data);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const buildQueryParams = useCallback(
    (p: number) => {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(PAGE_SIZE));
      if (searchDebounced) params.set("search", searchDebounced);
      if (source !== "all") params.set("source", source);
      if (remote !== "all") params.set("remote", remote);
      if (countryCode !== "all") params.set("countryCode", countryCode);
      if (location) params.set("location", location);
      if (dateRange?.from)
        params.set("dateFrom", dateRange.from.toISOString().slice(0, 10));
      if (dateRange?.to)
        params.set("dateTo", dateRange.to.toISOString().slice(0, 10));
      return params.toString();
    },
    [searchDebounced, source, remote, countryCode, location, dateRange],
  );

  const fetchData = useCallback(
    (p = 1) => {
      const hasData = dataRef.current !== null;
      if (hasData) setIsRefreshing(true);
      const qs = buildQueryParams(p);
      return fetch(`/api/admin/jobs?${qs}`)
        .then((res) => res.json())
        .then((d: JobsResponse) => {
          setData(d);
          setPage(d.page ?? p);
        })
        .finally(() => {
          setLoading(false);
          setIsRefreshing(false);
        });
    },
    [buildQueryParams],
  );

  const fetchOverview = useCallback(() => {
    return fetch("/api/admin/jobs/overview")
      .then((res) => res.json())
      .then((d: OverviewResponse) => setOverview(d))
      .catch((err) => console.error("Overview fetch error:", err));
  }, []);

  const triggerCrawl = useCallback(() => {
    setIsCrawling(true);
    const body: Record<string, string> = {};
    if (searchDebounced) body.search = searchDebounced;
    if (countryCode !== "all") body.countryCode = countryCode;
    if (location) body.location = location;
    if (source !== "all") body.source = source;

    return fetch("/api/admin/jobs/crawl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    })
      .then((res) => res.json())
      .then(() => {
        fetchData(1);
        fetchOverview();
      })
      .catch((err) => console.error("Crawl error:", err))
      .finally(() => setIsCrawling(false));
  }, [
    fetchData,
    fetchOverview,
    searchDebounced,
    countryCode,
    location,
    source,
  ]);

  const refresh = useCallback(() => {
    fetchData(page);
    fetchOverview();
  }, [fetchData, page, fetchOverview]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    fetch("/api/admin/jobs/sources?limit=100")
      .then((res) => res.json())
      .then((d: { items?: Array<{ slug: string; name?: string }> }) => {
        if (d?.items?.length) {
          setSourceOptions([
            { value: "all", label: "All sources" },
            ...d.items.map((s) => ({
              value: s.slug,
              label: s.name || s.slug,
            })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const hasFilters =
    searchDebounced ||
    source !== "all" ||
    remote !== "all" ||
    countryCode !== "all" ||
    location ||
    dateRange?.from;

  const clearFilters = () => {
    setSearch("");
    setSearchDebounced("");
    setSource("all");
    setRemote("all");
    setCountryCode("all");
    setLocation("");
    setDateRange(undefined);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-zinc-600" />
              Jobs
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={triggerCrawl}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={isCrawling}
            >
              <RefreshCw
                className={cn("h-4 w-4", isCrawling && "animate-spin")}
              />
              {isCrawling ? "Crawling..." : "Crawl Jobs"}
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

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
            <span>
              Total jobs:{" "}
              <span className="font-normal text-zinc-600 normal-case">
                {overview?.totalJobs ?? 0}
              </span>
            </span>
            <span className="text-zinc-300">|</span>
            <span>
              Posted today:{" "}
              <span className="font-normal text-zinc-600 normal-case">
                {overview?.jobsToday ?? 0}
              </span>
            </span>
            <span className="text-zinc-300">|</span>
            <span>
              Top source:{" "}
              <span className="font-normal text-zinc-600 capitalize">
                {overview?.topSources?.[0]?.source ?? "—"}
              </span>{" "}
              <span className="font-normal text-zinc-600 normal-case">
                ({overview?.topSources?.[0]?.count ?? 0} jobs)
              </span>
            </span>
            <span className="text-zinc-300">|</span>
            <span>
              Countries:{" "}
              <span className="font-normal text-zinc-600 normal-case">
                {overview?.topCountries?.length ?? 0} with data
              </span>
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider shrink-0">
            Last crawled:{" "}
            <span className="font-normal text-zinc-600 normal-case">
              {overview?.lastCrawledAt
                ? new Date(overview.lastCrawledAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-zinc-500 hover:text-zinc-700"
                onClick={clearFilters}
              >
                <X className="h-3.5 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr_0.8fr_1.2fr] gap-4">
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  placeholder="Title, company, location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-full bg-zinc-50/80 border-zinc-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Source
              </label>
              <FilterDropdown
                value={source}
                onChange={setSource}
                options={sourceOptions}
                searchPlaceholder="Search sources..."
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Remote
              </label>
              <FilterDropdown
                value={remote}
                onChange={setRemote}
                options={REMOTE_OPTIONS}
                searchPlaceholder="Filter..."
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Country
              </label>
              <FilterDropdown
                value={countryCode}
                onChange={setCountryCode}
                options={[
                  { value: "all", label: "All countries" },
                  ...COUNTRIES.map((c) => ({
                    value: c.code,
                    label: `${countryFlag(c.code)} ${c.name}`,
                  })),
                ]}
                searchPlaceholder="Search countries..."
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                City / Region
              </label>
              <Input
                placeholder="e.g. Berlin"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-9 w-full bg-zinc-50/80 border-zinc-200 focus:bg-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                From / To
              </label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="dd/mm/yyyy"
                displayFormat="dd/MM/yyyy"
                numberOfMonths={2}
                className="h-9"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3 mt-4">
          <h2 className="text-lg font-semibold text-zinc-900">Job Listings</h2>
          {hasFilters && (
            <span className="text-sm text-zinc-500">
              {Math.min(
                (page - 1) * PAGE_SIZE + items.length,
                data?.total ?? 0,
              )}{" "}
              of {data?.total ?? 0}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-14">
                  Source
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Company
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Phone
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Salary
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Posted
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500">
                    No jobs found. Set filters and click &quot;Crawl Jobs&quot;
                    to fetch from Remotive, Arbeitnow, Adzuna, The Muse,
                    USAJOBS.
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const contact = parseContactFromText(row.description);
                  return (
                    <tr
                      key={row._id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600 capitalize">
                          {row.source?.slug ?? row.source?.name ?? "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span
                          className="inline-block max-w-[200px] truncate font-mono text-[11px] text-gray-400"
                          title={row.title}
                        >
                          {row.title || "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">
                          {row.companyName || "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span
                          className="inline-block max-w-[140px] truncate font-mono text-[11px] text-gray-500"
                          title={contact.email}
                        >
                          {contact.email ? (
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-blue-600 hover:underline truncate block"
                            >
                              {contact.email}
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span
                          className="inline-block max-w-[100px] truncate font-mono text-[11px] text-gray-500"
                          title={contact.phone}
                        >
                          {contact.phone ? (
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-blue-600 hover:underline truncate block"
                            >
                              {contact.phone}
                            </a>
                          ) : (
                            "—"
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <div className="flex justify-center">
                        {(() => {
                          const code =
                            row.place?.countryCode ??
                            COUNTRIES.find((c) => c.name === row.place?.country)
                              ?.code;
                          if (code && countryFlag(code)) {
                            const countryName =
                              row.place?.country ??
                              COUNTRIES.find((c) => c.code === code)?.name ??
                              "";
                            return (
                              <span
                                className="inline-flex items-center text-lg leading-none cursor-default"
                                title={countryName}
                              >
                                {countryFlag(code)}
                              </span>
                            );
                          }
                          if (row.remote) {
                            return (
                              <span title="Remote">
                                <Globe className="h-4 w-4 text-zinc-500" />
                              </span>
                            );
                          }
                          return (
                            <span className="inline-block max-w-[120px] truncate font-mono text-[11px] text-gray-500">
                              {row.locationRaw ||
                                row.place?.displayName ||
                                row.place?.name ||
                                "—"}
                            </span>
                          );
                        })()}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="font-mono text-[11px] text-gray-400">
                          {(() => {
                            const loc = (
                              row.locationRaw ?? ""
                            ).toLowerCase();
                            const type = (row.jobType ?? "").toLowerCase();
                            const isHybrid =
                              loc.includes("hybrid") || type.includes("hybrid");
                            if (row.remote && !isHybrid) return "Remote";
                            if (isHybrid) return "Hybrid";
                            return "On-site";
                          })()}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="font-mono text-[11px] text-gray-400">
                          {formatSalary(
                            row.salaryMin,
                            row.salaryMax,
                            row.currency,
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        <span className="inline-block max-w-[80px] truncate font-mono text-[11px] text-gray-400">
                          {row.postedAt
                            ? new Date(row.postedAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "2-digit",
                                },
                              )
                            : "—"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 align-middle">
                        {row.url && (
                          <a
                            href={row.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title={row.urlDomain || "Open"}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
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

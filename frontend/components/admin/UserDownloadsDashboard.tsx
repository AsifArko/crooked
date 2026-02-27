"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  Monitor,
  User,
  Clipboard,
  Check,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { useSessionId } from "@/lib/useSessionId";
import {
  getMySessionIds,
  TablePagination,
} from "./SiteAnalyticsDashboardComponents";
import { TrafficChart } from "./TrafficChart";
import { DevicesBrowsersCard, CountriesCard } from "./AnalyticsPanelCard";
import { COUNTRIES, countryFlag } from "@/lib/countries";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Download = {
  _id: string;
  ipAddress?: string;
  hostname?: string;
  userAgent?: string;
  sessionId?: string;
  referrer?: string;
  recordedAt: string;
  country?: string;
  countryCode?: string;
};

type Response = {
  items: Download[];
  total: number;
  page: number;
  limit: number;
  summary: { totalDownloads: number };
};

const CACHE_KEY = "resume-downloads-dashboard";
const CACHE_KEY_OVERVIEW = "resume-downloads-overview";
const CACHE_TTL_MS = 30_000;
const PAGE_SIZE = 7;

type OverviewData = {
  overview: { totalDownloads: number; downloadsInPeriod: number };
  dailyTrend: { date: string; downloads: number }[];
  topCountries: {
    country: string;
    countryCode: string;
    visitors: number;
    percentage: number;
  }[];
  deviceBreakdown: { device: string; visitors: number; percentage: number }[];
  deviceCategoryBreakdown: {
    device: string;
    visitors: number;
    percentage: number;
  }[];
};

function getDeviceLabel(ua: string | undefined): string {
  if (!ua) return "—";
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return "ios";
  if (/android/.test(lower)) return "android";
  if (/macintosh|mac os/.test(lower)) return "mac";
  if (/windows/.test(lower)) return "windows";
  if (/linux/.test(lower)) return "linux";
  return "other";
}

const DEVICE_OPTIONS = [
  { value: "all", label: "All devices" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "mac", label: "Mac" },
  { value: "windows", label: "Windows" },
  { value: "linux", label: "Linux" },
  { value: "other", label: "Other" },
] as const;

const BROWSER_OPTIONS = [
  { value: "all", label: "All browsers" },
  { value: "chrome", label: "Chrome" },
  { value: "firefox", label: "Firefox" },
  { value: "safari", label: "Safari" },
  { value: "edge", label: "Edge" },
  { value: "opera", label: "Opera" },
  { value: "other", label: "Other" },
] as const;

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

  const label = options.find((o) => o.value === value)?.label ?? options[0]?.label ?? "";

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase().trim();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const handleSelect = useCallback(
    (v: string) => {
      onChange(v);
      setOpen(false);
      setQuery("");
    },
    [onChange]
  );

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            FILTER_SELECT_CLASS,
            "text-left flex items-center justify-between gap-1"
          )}
        >
          <span className="truncate min-w-0">{label}</span>
          <ChevronDown className={cn("h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[260px] p-0 overflow-hidden border border-zinc-200/90 bg-white shadow-xl shadow-zinc-200/50 rounded-xl"
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
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-zinc-200 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-1">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-8 text-center text-[13px] text-zinc-400">
              No results found
            </div>
          ) : (
            filteredOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => handleSelect(o.value)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors rounded-md mx-1",
                  value === o.value
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <span className="truncate flex-1">{o.label}</span>
                {value === o.value && <Check className="h-4 w-4 text-zinc-600 shrink-0" />}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CountryFilterSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const label =
    value === "all"
      ? "All countries"
      : value === "unknown"
        ? "Unknown"
        : COUNTRIES.find((c) => c.code === value)
          ? `${countryFlag(value)} ${COUNTRIES.find((c) => c.code === value)!.name}`
          : "All countries";

  const filteredCountries = useMemo(() => {
    if (!query.trim()) return COUNTRIES;
    const q = query.toLowerCase().trim();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      setOpen(false);
      setQuery("");
    },
    [onChange]
  );

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            FILTER_SELECT_CLASS,
            "text-left flex items-center justify-between gap-1"
          )}
        >
          <span className="truncate min-w-0">{label}</span>
          <ChevronDown className={cn("h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[260px] p-0 overflow-hidden border border-zinc-200/90 bg-white shadow-xl shadow-zinc-200/50 rounded-xl"
      >
        <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full h-9 pl-9 pr-3 text-[13px] bg-white border border-zinc-200 rounded-lg placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-300"
            />
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar py-1">
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors rounded-md mx-1",
              value === "all"
                ? "bg-zinc-100 text-zinc-900 font-medium"
                : "text-zinc-700 hover:bg-zinc-50"
            )}
          >
            <span>All countries</span>
            {value === "all" && <Check className="h-4 w-4 text-zinc-600 shrink-0" />}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("unknown")}
            className={cn(
              "w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] transition-colors rounded-md mx-1",
              value === "unknown"
                ? "bg-zinc-100 text-zinc-900 font-medium"
                : "text-zinc-700 hover:bg-zinc-50"
            )}
          >
            <span>Unknown</span>
            {value === "unknown" && <Check className="h-4 w-4 text-zinc-600 shrink-0" />}
          </button>
          <div className="my-1 h-px bg-zinc-100" />
          {filteredCountries.length === 0 ? (
            <div className="px-3 py-8 text-center text-[13px] text-zinc-400">
              No countries found
            </div>
          ) : (
            filteredCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c.code)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] transition-colors rounded-md mx-1",
                  value === c.code
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-700 hover:bg-zinc-50"
                )}
              >
                <span className="text-base leading-none shrink-0">{countryFlag(c.code)}</span>
                <span className="truncate flex-1">{c.name}</span>
                {value === c.code && <Check className="h-4 w-4 text-zinc-600 shrink-0" />}
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const DEVICE_STYLES: Record<string, string> = {
  ios: "rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600",
  android:
    "rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700",
  mac: "rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600",
  windows:
    "rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700",
  linux:
    "rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700",
  other:
    "rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500",
};

function SourceCell({
  row,
  mySessionIds,
}: {
  row: Download;
  mySessionIds: string[];
}) {
  const isMe = Boolean(row.sessionId && mySessionIds.includes(row.sessionId));

  return isMe ? (
    <span title="This device (your computer)">
      <Monitor className="h-4 w-4 text-emerald-600 shrink-0" />
    </span>
  ) : (
    <span title="Other device (outsider)">
      <User className="h-4 w-4 text-gray-400 shrink-0" />
    </span>
  );
}

function UserAgentCopyCell({ userAgent }: { userAgent: string | undefined }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!userAgent) return;
    navigator.clipboard.writeText(userAgent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [userAgent]);

  return (
    <button
      type="button"
      onClick={copy}
      className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      title="Copy user agent"
    >
      {copied ? (
        <Check className="h-3.5 w-3 text-emerald-600" />
      ) : (
        <Clipboard className="h-3.5 w-3" />
      )}
    </button>
  );
}

function CountryCell({
  countryCode,
  country,
}: {
  countryCode?: string;
  country?: string;
}) {
  const flag = countryCode ? countryFlag(countryCode) : "";
  const code = countryCode ?? "—";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1 text-xs text-gray-600"
      title={country ?? code}
    >
      {flag && <span className="text-base leading-none">{flag}</span>}
      <span className="font-medium">{code}</span>
    </span>
  );
}

function loadCached(): { data: Response; page: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, page, ts } = JSON.parse(raw) as {
      data: Response;
      page: number;
      ts: number;
    };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return { data, page };
  } catch {
    return null;
  }
}

function saveCache(data: Response, page: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, page, ts: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

function loadOverviewCached(dateRange: string): OverviewData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY_OVERVIEW}-${dateRange}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: OverviewData; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function saveOverviewCache(dateRange: string, data: OverviewData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${CACHE_KEY_OVERVIEW}-${dateRange}`,
      JSON.stringify({ data, ts: Date.now() }),
    );
  } catch {
    /* ignore */
  }
}

export function UserDownloadsDashboard() {
  const currentSessionId = useSessionId();
  const mySessionIds = useMemo(
    () =>
      typeof window !== "undefined" ? getMySessionIds(currentSessionId) : [],
    [currentSessionId],
  );

  const cached = loadCached();
  const [data, setData] = useState<Response | null>(cached?.data ?? null);
  const [page, setPage] = useState(cached?.page ?? 1);
  const [loading, setLoading] = useState(!cached);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("7d");
  const [overview, setOverview] = useState<OverviewData | null>(() =>
    loadOverviewCached("7d"),
  );
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [device, setDevice] = useState<string>("all");
  const [countryCode, setCountryCode] = useState<string>("all");
  const [browser, setBrowser] = useState<string>("all");
  const dataRef = useRef(data);
  dataRef.current = data;

  // Debounce search input
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
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (device && device !== "all") params.set("device", device);
      if (countryCode && countryCode !== "all") params.set("countryCode", countryCode);
      if (browser && browser !== "all") params.set("browser", browser);
      return params.toString();
    },
    [searchDebounced, dateFrom, dateTo, device, countryCode, browser]
  );

  const fetchData = useCallback(
    (p = 1) => {
      const hasData = dataRef.current !== null;
      if (hasData) setIsRefreshing(true);
      const qs = buildQueryParams(p);
      return fetch(`/api/admin/downloads?${qs}`)
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
    },
    [buildQueryParams]
  );

  const fetchOverview = useCallback(() => {
    return fetch(`/api/admin/downloads/overview?dateRange=${dateRange}`)
      .then((res) => res.json())
      .then((d: OverviewData) => {
        setOverview(d);
        saveOverviewCache(dateRange, d);
      })
      .catch((err) => console.error("Overview fetch error:", err));
  }, [dateRange]);

  const refresh = useCallback(() => {
    fetchData(page);
    fetchOverview();
  }, [fetchData, page, fetchOverview]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  useEffect(() => {
    const cachedOverview = loadOverviewCached(dateRange);
    if (cachedOverview) {
      setOverview(cachedOverview);
    } else {
      fetchOverview();
    }
  }, [dateRange, fetchOverview]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Resume Downloads
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {overview?.overview?.totalDownloads ?? data?.summary?.totalDownloads ?? 0} total
              {" · "}
              {overview?.overview?.downloadsInPeriod ?? 0} in {dateRange === "7d" ? "last 7 days" : "last 30 days"}
              {" · "}
              {overview?.topCountries?.length ?? 0} countries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[13px] text-zinc-600 bg-white border border-zinc-200 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-zinc-300 focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <Button
              onClick={refresh}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Traffic over time - Downloads chart */}
        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm p-5 mb-6">
          <h2 className="text-[13px] font-medium text-zinc-900 mb-4">
            Downloads over time
          </h2>
          {overview?.dailyTrend && overview.dailyTrend.length > 0 ? (
            <TrafficChart
              data={overview.dailyTrend.map((d) => ({
                date: d.date,
                downloads: d.downloads,
                visitors: d.downloads,
                pageViews: d.downloads,
              }))}
              metric="downloads"
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-[13px] text-zinc-400">
              No data for selected period
            </div>
          )}
        </div>

        {/* Countries + Devices cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CountriesCard
            items={overview?.topCountries ?? []}
            emptyMessage="No country data"
          />
          <DevicesBrowsersCard
            deviceItems={overview?.deviceCategoryBreakdown ?? overview?.deviceBreakdown ?? []}
            emptyMessage="No device data"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-900">Filters</h3>
            {(searchDebounced || dateFrom || dateTo || (device !== "all") || (countryCode !== "all") || (browser !== "all")) && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 px-2 text-zinc-500 hover:text-zinc-700"
                onClick={() => {
                  setSearch("");
                  setSearchDebounced("");
                  setDateFrom("");
                  setDateTo("");
                  setDevice("all");
                  setCountryCode("all");
                  setBrowser("all");
                }}
              >
                <X className="h-3.5 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(5,1fr)] gap-4">
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <Input
                  placeholder="IP, session ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-full bg-zinc-50/80 border-zinc-200 focus:bg-white"
                />
              </div>
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                From date
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-full bg-zinc-50/80 border-zinc-200 focus:bg-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                To date
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-full bg-zinc-50/80 border-zinc-200 focus:bg-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Device
              </label>
              <FilterDropdown
                value={device}
                onChange={setDevice}
                options={DEVICE_OPTIONS}
                searchPlaceholder="Search devices..."
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                Country
              </label>
              <CountryFilterSelect value={countryCode} onChange={setCountryCode} />
            </div>
            <div className="min-w-0">
              <label className="block text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
                User Agent
              </label>
              <FilterDropdown
                value={browser}
                onChange={setBrowser}
                options={BROWSER_OPTIONS}
                searchPlaceholder="Search browsers..."
              />
            </div>
          </div>
        </div>

        {/* Table header with results count */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-zinc-900">Resume Downloads</h2>
          {(searchDebounced || dateFrom || dateTo || device !== "all" || countryCode !== "all" || browser !== "all") && (
            <span className="text-sm text-zinc-500">
              Showing {Math.min((page - 1) * PAGE_SIZE + items.length, data?.total ?? 0)} of {data?.total ?? 0} results
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
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  IP
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Country
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Device
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                  User Agent
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="py-2.5 px-4 align-middle">
                    <SourceCell row={row} mySessionIds={mySessionIds} />
                  </td>
                  <td className="py-2.5 px-4 align-middle">
                    <span className="inline-block max-w-[200px] truncate font-mono text-[11px] text-gray-400">
                      {row.recordedAt ?? "—"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 align-middle">
                    <span className="inline-block rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">
                      {row.ipAddress ?? "—"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 align-middle">
                    <CountryCell
                      countryCode={row.countryCode}
                      country={row.country}
                    />
                  </td>
                  <td className="py-2.5 px-4 align-middle">
                    <span
                      className={`inline-block capitalize ${DEVICE_STYLES[getDeviceLabel(row.userAgent)] ?? DEVICE_STYLES.other}`}
                    >
                      {getDeviceLabel(row.userAgent)}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 align-middle">
                    <UserAgentCopyCell userAgent={row.userAgent} />
                  </td>
                </tr>
              ))}
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

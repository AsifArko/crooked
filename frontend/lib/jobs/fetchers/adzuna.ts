import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const ADZUNA_COUNTRIES = [
  "gb",
  "us",
  "de",
  "fr",
  "at",
  "au",
  "br",
  "ca",
  "es",
  "in",
  "it",
  "mx",
  "nl",
  "nz",
  "pl",
  "ru",
  "sg",
  "za",
] as const;

const JOB_KEYWORDS = [
  "software engineer",
  "software developer",
  "developer",
  "programmer",
  "data scientist",
  "backend developer",
  "frontend developer",
  "full stack developer",
  "computer science",
  "devops engineer",
] as const;

type AdzunaResult = {
  id: string;
  title: string;
  location: { display_name: string };
  company: { display_name: string };
  description: string;
  redirect_url: string;
  created: string;
  salary_min?: number;
  salary_max?: number;
  contract_type?: string;
  contract_time?: string;
};

export async function fetchAdzunaJobs(params?: {
  countryCode?: string;
  search?: string;
  location?: string;
}): Promise<NormalizedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const countries = params?.countryCode
    ? (() => {
        const mapped = mapCountryToAdzuna(params.countryCode.toLowerCase().slice(0, 2));
        return mapped ? [mapped] : [...ADZUNA_COUNTRIES];
      })()
    : [...ADZUNA_COUNTRIES];

  const keywords = params?.search?.trim()
    ? [params.search]
    : [...JOB_KEYWORDS];

  const allJobs: NormalizedJob[] = [];
  const seenIds = new Set<string>();

  for (const country of countries) {
    const adzunaCountry = mapCountryToAdzuna(country);
    if (!adzunaCountry) continue;

    for (const keyword of keywords.slice(0, 3)) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      try {
        const url = new URL(
          `https://api.adzuna.com/v1/api/jobs/${adzunaCountry}/search/1`
        );
        url.searchParams.set("app_id", appId);
        url.searchParams.set("app_key", appKey);
        url.searchParams.set("what", keyword);
        if (params?.location) url.searchParams.set("where", params.location);
        url.searchParams.set("content-type", "application/json");

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`);
        const data = (await res.json()) as { results?: AdzunaResult[] };
        const results = data.results ?? [];

        for (const r of results) {
          const n = normalize(r, adzunaCountry);
          if (!seenIds.has(`${n.source}:${n.externalId}`)) {
            seenIds.add(`${n.source}:${n.externalId}`);
            allJobs.push(n);
          }
        }
      } catch {
        /* skip failed requests */
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  return allJobs;
}

function mapCountryToAdzuna(code: string): string | null {
  const map: Record<string, string> = {
    gb: "gb",
    uk: "gb",
    us: "us",
    de: "de",
    fr: "fr",
    at: "at",
    au: "au",
    br: "br",
    ca: "ca",
    es: "es",
    in: "in",
    it: "it",
    mx: "mx",
    nl: "nl",
    nz: "nz",
    pl: "pl",
    ru: "ru",
    sg: "sg",
    za: "za",
  };
  return map[code.toLowerCase()] ?? null;
}

function normalize(r: AdzunaResult, country: string): NormalizedJob {
  const loc = r.location?.display_name?.trim() ?? "";
  const isRemote =
    loc.toLowerCase().includes("remote") ||
    loc.toLowerCase().includes("anywhere") ||
    !loc;

  return {
    externalId: r.id,
    source: "adzuna",
    sourceVariant: country,
    title: r.title ?? "",
    companyName: r.company?.display_name ?? "",
    description: (r.description ?? "").slice(0, 5000),
    url: r.redirect_url ?? "",
    locationRaw: loc || (isRemote ? "Remote" : "Unknown"),
    remote: isRemote,
    jobType: r.contract_time || r.contract_type || undefined,
    salaryMin: r.salary_min,
    salaryMax: r.salary_max,
    currency: "USD",
    postedAt: r.created
      ? new Date(r.created).toISOString()
      : new Date().toISOString(),
    tags: [],
    urlDomain: extractUrlDomain(r.redirect_url),
  };
}

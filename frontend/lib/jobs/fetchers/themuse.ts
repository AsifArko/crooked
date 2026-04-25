import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const MUSE_CATEGORIES = [
  "Software Engineering",
  "Data Science",
  "Product",
  "Design",
  "DevOps and Infrastructure",
] as const;

type MuseJob = {
  id: number;
  name: string;
  publication_date: string;
  short_description: string;
  locations: Array<{ name: string }>;
  company: { name: string };
  levels: Array<{ name: string }>;
  categories: Array<{ name: string }>;
  refs: { landing_page: string };
};

export async function fetchTheMuseJobs(params?: {
  search?: string;
  category?: string;
}): Promise<NormalizedJob[]> {
  const apiKey = process.env.THEMUSE_API_KEY;
  if (!apiKey) return [];

  const categories = params?.category
    ? [params.category]
    : [...MUSE_CATEGORIES];

  const allJobs: NormalizedJob[] = [];
  const seenIds = new Set<string>();

  for (const cat of categories) {
    for (let page = 1; page <= 2; page++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      try {
        const url = new URL("https://www.themuse.com/api/public/jobs");
        url.searchParams.set("api_key", apiKey);
        url.searchParams.set("category", cat);
        url.searchParams.set("page", String(page));
        if (params?.search) url.searchParams.set("desc", params.search);

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`The Muse API error: ${res.status}`);
        const data = (await res.json()) as { results?: MuseJob[] };
        const results = data.results ?? [];

        for (const r of results) {
          const n = normalize(r);
          if (!seenIds.has(`${n.source}:${n.externalId}`)) {
            seenIds.add(`${n.source}:${n.externalId}`);
            allJobs.push(n);
          }
        }
      } catch {
        if (categories.length === 1 && page === 1) throw new Error("The Muse fetch failed");
      } finally {
        clearTimeout(timeout);
      }
    }
  }

  return allJobs;
}

function normalize(r: MuseJob): NormalizedJob {
  const loc = r.locations?.[0]?.name?.trim() ?? "";
  const isRemote =
    loc.toLowerCase().includes("remote") ||
    loc.toLowerCase().includes("anywhere") ||
    !loc;

  return {
    externalId: String(r.id),
    source: "themuse",
    title: r.name ?? "",
    companyName: r.company?.name ?? "",
    description: r.short_description ?? "",
    url: r.refs?.landing_page ?? "",
    locationRaw: loc || (isRemote ? "Remote" : "Unknown"),
    remote: isRemote,
    jobType: r.levels?.[0]?.name || undefined,
    category: r.categories?.[0]?.name,
    postedAt: r.publication_date
      ? new Date(r.publication_date).toISOString()
      : new Date().toISOString(),
    tags: [],
    urlDomain: extractUrlDomain(r.refs?.landing_page),
  };
}

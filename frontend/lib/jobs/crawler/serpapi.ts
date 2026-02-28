import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const SERPAPI_BASE = "https://serpapi.com/search";

type SerpApiJobResult = {
  title?: string;
  company_name?: string;
  link?: string;
  location?: string;
  description?: string;
  posted_at?: string;
  salary?: string;
  job_type?: string;
};

type SerpApiResponse = {
  jobs_results?: SerpApiJobResult[];
  error?: string;
  next_page_token?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

/**
 * Search Google Jobs via SerpApi.
 * Requires SERPAPI_KEY env var. Free tier: ~100 searches/month.
 */
export async function searchGoogleJobs(
  query: string,
  location: string,
  countryCode: string
): Promise<NormalizedJob[]> {
  const key = process.env.SERPAPI_KEY;
  if (!key) {
    console.warn("SERPAPI_KEY not set; skipping Google Jobs search");
    return [];
  }

  const params = new URLSearchParams({
    engine: "google_jobs",
    q: query,
    location,
    gl: countryCode,
    hl: "en",
    api_key: key,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(`${SERPAPI_BASE}?${params}`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`SerpApi error: ${res.status}`);
    const data = (await res.json()) as SerpApiResponse;
    if (data.error) throw new Error(data.error);

    const results = data.jobs_results ?? [];
    const jobs: NormalizedJob[] = [];
    const seenUrls = new Set<string>();

    for (const j of results) {
      const link = j.link;
      if (!link || seenUrls.has(link)) continue;
      seenUrls.add(link);

      const externalId = link;
      const title = (j.title ?? "").trim() || "Untitled";
      const companyName = (j.company_name ?? "").trim() || "Unknown";
      const loc = (j.location ?? "").trim();
      const isRemote =
        loc.toLowerCase().includes("remote") ||
        loc.toLowerCase().includes("work from home") ||
        !loc;

      let postedAt = new Date().toISOString();
      if (j.posted_at) {
        const d = new Date(j.posted_at);
        if (!isNaN(d.getTime())) postedAt = d.toISOString();
      }

      jobs.push({
        externalId,
        source: "serpapi-google-jobs",
        sourceVariant: query,
        title,
        companyName,
        description: stripHtml((j.description ?? "").trim()),
        url: link,
        locationRaw: loc || location,
        remote: isRemote,
        jobType: j.job_type ?? undefined,
        postedAt,
        tags: [],
        urlDomain: extractUrlDomain(link),
      });
    }

    return jobs;
  } finally {
    clearTimeout(timeout);
  }
}

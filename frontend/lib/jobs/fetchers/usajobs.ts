import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const USAJOBS_KEYWORDS = [
  "software engineer",
  "software developer",
  "computer scientist",
  "computer science",
  "information technology",
] as const;

type UsaJobsItem = {
  MatchedObjectId: string;
  MatchedObjectDescriptor: {
    PositionTitle: string;
    OrganizationName: string;
    PositionLocation: Array<{ LocationName: string }>;
    PositionStartDate: string;
    UserArea: { Details: { JobSummary: string } };
    ApplyURI: string[];
  };
};

export async function fetchUsaJobs(params?: { search?: string }): Promise<NormalizedJob[]> {
  const apiKey = process.env.USAJOBS_API_KEY;
  if (!apiKey) return [];

  const keywords = params?.search?.trim()
    ? [params.search]
    : [...USAJOBS_KEYWORDS];

  const allJobs: NormalizedJob[] = [];
  const seenIds = new Set<string>();

  for (const keyword of keywords.slice(0, 3)) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const url = new URL("https://developer.usajobs.gov/api/search");
      url.searchParams.set("Keyword", keyword);
      url.searchParams.set("ResultsPerPage", "50");

      const res = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { "Authorization-Key": apiKey },
      });
      if (!res.ok) throw new Error(`USAJOBS API error: ${res.status}`);
      const data = (await res.json()) as {
        SearchResult?: { SearchResultItems?: UsaJobsItem[] };
      };
      const items = data.SearchResult?.SearchResultItems ?? [];

      for (const item of items) {
        const n = normalize(item);
        if (!seenIds.has(`${n.source}:${n.externalId}`)) {
          seenIds.add(`${n.source}:${n.externalId}`);
          allJobs.push(n);
        }
      }
    } catch {
      if (keywords.length === 1) throw new Error("USAJOBS fetch failed");
    } finally {
      clearTimeout(timeout);
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return allJobs;
}

function normalize(item: UsaJobsItem): NormalizedJob {
  const d = item.MatchedObjectDescriptor;
  const loc = d.PositionLocation?.[0]?.LocationName?.trim() ?? "";
  const isRemote = loc.toLowerCase().includes("remote") || !loc;
  const applyUrl = d.ApplyURI?.[0] ?? `https://www.usajobs.gov/job/${item.MatchedObjectId}`;

  return {
    externalId: item.MatchedObjectId,
    source: "usajobs",
    title: d.PositionTitle ?? "",
    companyName: d.OrganizationName ?? "",
    description: d.UserArea?.Details?.JobSummary ?? "",
    url: applyUrl,
    locationRaw: loc || "United States",
    remote: isRemote,
    postedAt: d.PositionStartDate
      ? new Date(d.PositionStartDate).toISOString()
      : new Date().toISOString(),
    tags: [],
    urlDomain: extractUrlDomain(applyUrl),
  };
}

import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const ARBEITNOW_URL = "https://arbeitnow.com/api/job-board-api";

type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: string;
};

export async function fetchArbeitnowJobs(): Promise<NormalizedJob[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(ARBEITNOW_URL, { signal: controller.signal });
    if (!res.ok) throw new Error(`Arbeitnow API error: ${res.status}`);
    const data = (await res.json()) as { data?: ArbeitnowJob[] };
    const jobs = data.data ?? [];
    return jobs.map((j) => normalize(j));
  } finally {
    clearTimeout(timeout);
  }
}

function normalize(j: ArbeitnowJob): NormalizedJob {
  const loc = j.location?.trim() ?? "";
  const isRemote = j.remote || loc.toLowerCase().includes("remote") || !loc;

  return {
    externalId: j.slug ?? `arbeitnow-${j.title}-${j.company_name}`,
    source: "arbeitnow",
    title: j.title ?? "",
    companyName: j.company_name ?? "",
    description: stripHtml(j.description ?? ""),
    url: j.url ?? "",
    locationRaw: loc || (isRemote ? "Remote" : "Unknown"),
    remote: isRemote,
    jobType: j.job_types?.[0] || undefined,
    postedAt: j.created_at
      ? new Date(j.created_at).toISOString()
      : new Date().toISOString(),
    tags: j.tags ?? [],
    urlDomain: extractUrlDomain(j.url),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000);
}

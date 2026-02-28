import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";

const TECH_CATEGORIES = [
  "software-development",
  "devops",
  "data",
  "ai-ml",
  "qa",
  "design",
  "product",
  "project-management",
] as const;

type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  job_type: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  publication_date: string;
};

export async function fetchRemotiveJobs(params?: {
  category?: string;
}): Promise<NormalizedJob[]> {
  const categories = params?.category
    ? [params.category]
    : [...TECH_CATEGORIES];

  const allJobs: NormalizedJob[] = [];
  const seenIds = new Set<string>();

  for (const cat of categories) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch(`${REMOTIVE_URL}?category=${cat}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
      const data = (await res.json()) as { jobs?: RemotiveJob[] };
      const jobs = data.jobs ?? [];
      for (const j of jobs) {
        const n = normalize(j, cat);
        if (!seenIds.has(`${n.source}:${n.externalId}`)) {
          seenIds.add(`${n.source}:${n.externalId}`);
          allJobs.push(n);
        }
      }
    } catch (e) {
      if (categories.length === 1) throw e;
    } finally {
      clearTimeout(timeout);
    }
  }

  return allJobs;
}

function normalize(j: RemotiveJob, category: string): NormalizedJob {
  const loc = j.candidate_required_location?.trim() ?? "";
  const isRemote =
    loc.toLowerCase().includes("remote") ||
    loc.toLowerCase().includes("worldwide") ||
    loc === "Anywhere" ||
    !loc;

  return {
    externalId: String(j.id),
    source: "remotive",
    sourceVariant: category,
    title: j.title ?? "",
    companyName: j.company_name ?? "",
    description: stripHtml(j.description ?? ""),
    url: j.url ?? "",
    locationRaw: loc || "Remote",
    remote: isRemote,
    jobType: j.job_type || undefined,
    category: category.replace(/-/g, " "),
    postedAt: j.publication_date
      ? new Date(j.publication_date).toISOString()
      : new Date().toISOString(),
    tags: [],
    urlDomain: extractUrlDomain(j.url),
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000);
}

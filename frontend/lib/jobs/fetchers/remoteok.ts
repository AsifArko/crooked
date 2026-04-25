import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const REMOTEOK_URL = "https://remoteok.com/api";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

export async function fetchRemoteOkJobs(): Promise<NormalizedJob[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(REMOTEOK_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          process.env.SCRAPE_USER_AGENT ||
          "CrookedJobs/1.0 (https://crooked.com; jobs@crooked.com)",
      },
    });
    if (!res.ok) throw new Error(`RemoteOK API error: ${res.status}`);
    const data = (await res.json()) as unknown[];
    if (!Array.isArray(data)) throw new Error("RemoteOK returned non-array");

    const jobs: NormalizedJob[] = [];
    const seenIds = new Set<string>();

    for (const raw of data) {
      const j = raw as Record<string, unknown>;
      if (typeof j.id !== "string" && typeof j.id !== "number") continue;
      if (j.legal !== undefined) continue; // First element is metadata

      const id = String(j.id);
      if (seenIds.has(id)) continue;
      seenIds.add(id);

      const loc = (j.location as string) ?? "";
      const isRemote =
        loc.toLowerCase().includes("remote") ||
        loc.toLowerCase().includes("worldwide") ||
        loc === "Anywhere" ||
        !loc;

      const url = (j.url as string) ?? (j.apply_url as string) ?? "";
      if (!url) continue;

      const postedAt = j.date
        ? new Date(j.date as string).toISOString()
        : j.epoch
          ? new Date((j.epoch as number) * 1000).toISOString()
          : new Date().toISOString();

      jobs.push({
        externalId: id,
        source: "remoteok",
        title: (j.position as string) ?? "Untitled",
        companyName: (j.company as string) ?? "Unknown",
        description: stripHtml((j.description as string) ?? ""),
        url,
        locationRaw: loc || "Remote",
        remote: isRemote,
        jobType: undefined,
        salaryMin: (j.salary_min as number) || undefined,
        salaryMax: (j.salary_max as number) || undefined,
        postedAt,
        tags: Array.isArray(j.tags) ? (j.tags as string[]) : [],
        urlDomain: extractUrlDomain(url),
      });
    }

    return jobs;
  } finally {
    clearTimeout(timeout);
  }
}

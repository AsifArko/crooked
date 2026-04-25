import { writeClient } from "@/sanity/lib/writeClient";
import { ensureJobSources } from "./ensure-sources";
import { getNextLocationBatch } from "../geography/locations-queue";
import { generateQueries } from "./query-generator";
import { searchGoogleJobs } from "./serpapi";
import type { NormalizedJob } from "../types";

const JOB_SOURCE_ID = "jobSource-serpapi-google-jobs";
const RATE_LIMIT_MS = 2000;

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function upsertJob(job: NormalizedJob): Promise<"created" | "updated" | "skipped"> {
  const sourceId = JOB_SOURCE_ID;

  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "jobListing" && externalId == $eid && source._ref == $src][0]{ _id }`,
    { eid: job.externalId, src: sourceId }
  );

  if (existing) {
    return "skipped";
  }

  const now = new Date().toISOString();
  const doc = {
    _type: "jobListing" as const,
    externalId: job.externalId,
    source: { _type: "reference" as const, _ref: sourceId },
    title: job.title,
    companyName: job.companyName,
    description: job.description,
    url: job.url,
    locationRaw: job.locationRaw,
    remote: job.remote,
    jobType: job.jobType,
    category: job.category,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    currency: job.currency,
    postedAt: job.postedAt,
    tags: job.tags,
    urlDomain: job.urlDomain,
    lastCrawledAt: now,
    status: "active" as const,
    lastSeenAt: now,
  };

  const safeId = `serpapi-${job.externalId}`
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase()
    .slice(0, 50);
  const docId = `jobListing-${safeId}-${Date.now().toString(36)}`;
  await writeClient.create({ ...doc, _id: docId });
  return "created";
}

export type LocationCrawlResult = {
  status: "completed" | "failed" | "skipped";
  locationStats: Array<{
    city: string;
    country: string;
    queries: number;
    jobsFound: number;
    created: number;
    updated: number;
  }>;
  totalJobsFound: number;
  totalCreated: number;
  totalUpdated: number;
  errorLog?: string;
};

export async function runLocationCrawl(): Promise<LocationCrawlResult> {
  const batch = getNextLocationBatch();
  const locationStats: LocationCrawlResult["locationStats"] = [];
  let totalJobsFound = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  const errors: string[] = [];

  await ensureJobSources();

  if (!process.env.SERPAPI_KEY) {
    const now = new Date().toISOString();
    const crawlRunId = `crawlRun-locations-skipped-${Date.now()}`;
    await writeClient.createOrReplace({
      _id: crawlRunId,
      _type: "crawlRun",
      startedAt: now,
      finishedAt: now,
      status: "skipped",
      crawlType: "locations",
      trigger: "cron",
      totalJobs: 0,
      totalCreated: 0,
      totalUpdated: 0,
      durationMs: 0,
      sourceStats: [],
      errorLog: "SERPAPI_KEY not set; location crawl skipped",
    });
    return {
      status: "skipped",
      locationStats: [],
      totalJobsFound: 0,
      totalCreated: 0,
      totalUpdated: 0,
      errorLog: "SERPAPI_KEY not set; location crawl skipped",
    };
  }

  for (const loc of batch) {
    const queries = generateQueries(loc);
    let jobsFound = 0;
    let created = 0;
    let updated = 0;

    for (const query of queries) {
      try {
        const jobs = await searchGoogleJobs(
          query,
          `${loc.city}, ${loc.countryName}`,
          loc.countryCode
        );
        jobsFound += jobs.length;

        const seenUrls = new Set<string>();
        for (const job of jobs) {
          if (seenUrls.has(job.url)) continue;
          seenUrls.add(job.url);

          try {
            const result = await upsertJob(job);
            if (result === "created") created++;
            else if (result === "updated") updated++;
          } catch (e) {
            errors.push(`${loc.city} ${job.externalId}: ${(e as Error).message}`);
          }
        }

        await delay(RATE_LIMIT_MS);
      } catch (e) {
        errors.push(`${loc.city} ${query}: ${(e as Error).message}`);
      }
    }

    locationStats.push({
      city: loc.city,
      country: loc.countryName,
      queries: queries.length,
      jobsFound,
      created,
      updated,
    });
    totalJobsFound += jobsFound;
    totalCreated += created;
    totalUpdated += updated;
  }

  const startedAt = new Date();
  const finishedAt = new Date();
  const crawlRunId = `crawlRun-locations-${Date.now()}`;

  await writeClient.createOrReplace({
    _id: crawlRunId,
    _type: "crawlRun",
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    status: "completed",
    crawlType: "locations",
    trigger: "cron",
    totalJobs: totalJobsFound,
    totalCreated,
    totalUpdated,
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    sourceStats: [
      {
        source: "serpapi-google-jobs",
        fetched: totalJobsFound,
        created: totalCreated,
        updated: totalUpdated,
        errors: errors.length,
      },
    ],
    locationStats: locationStats.map((s) => ({
      city: s.city,
      country: s.country,
      queries: s.queries,
      jobsFound: s.jobsFound,
      created: s.created,
      updated: s.updated,
    })),
    errorLog: errors.length > 0 ? errors.join("\n") : undefined,
  });

  return {
    status: "completed",
    locationStats,
    totalJobsFound,
    totalCreated,
    totalUpdated,
    errorLog: errors.length > 0 ? errors.join("\n") : undefined,
  };
}

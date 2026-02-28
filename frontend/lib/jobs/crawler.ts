import { writeClient } from "@/sanity/lib/writeClient";
import { fetchAllJobs } from "./fetchers";
import { ensureJobSources } from "./crawler/ensure-sources";
import type { NormalizedJob } from "./types";
import type { CrawlParams } from "./types";

const JOB_SOURCE_IDS: Record<string, string> = {
  remotive: "jobSource-remotive",
  arbeitnow: "jobSource-arbeitnow",
  adzuna: "jobSource-adzuna",
  themuse: "jobSource-themuse",
  usajobs: "jobSource-usajobs",
  remoteok: "jobSource-remoteok",
  jobscollider: "jobSource-jobscollider",
  weworkremotely: "jobSource-weworkremotely",
  remoteco: "jobSource-remoteco",
  stackoverflow: "jobSource-stackoverflow",
  hackernews: "jobSource-hackernews",
  authenticjobs: "jobSource-authenticjobs",
  dribbble: "jobSource-dribbble",
  smashingmagazine: "jobSource-smashingmagazine",
  eurobrussels: "jobSource-eurobrussels",
  greenhouse: "jobSource-greenhouse",
  "serpapi-google-jobs": "jobSource-serpapi-google-jobs",
};

export type CrawlResult = {
  crawlRunId: string;
  status: "completed" | "failed";
  sourceStats: Array<{
    source: string;
    fetched: number;
    created: number;
    updated: number;
    errors: number;
  }>;
  errorLog?: string;
};

export type CrawlOptions = {
  params?: CrawlParams;
  trigger?: "manual" | "cron";
};

export async function runCrawl(options?: CrawlOptions | CrawlParams): Promise<CrawlResult> {
  const opts: CrawlOptions =
    options && "trigger" in options
      ? (options as CrawlOptions)
      : { params: options as CrawlParams | undefined, trigger: "manual" };

  const params = opts.params;
  const trigger = opts.trigger ?? "manual";
  const startedAt = new Date();
  const crawlRunId = `crawlRun-${Date.now()}`;

  const sourceStats: CrawlResult["sourceStats"] = [];
  const crawlParams: CrawlParams | undefined =
    params?.search || params?.countryCode || params?.location
      ? {
          search: params.search?.trim() || undefined,
          countryCode: params.countryCode && params.countryCode !== "all" ? params.countryCode : undefined,
          location: params.location?.trim() || undefined,
          source: params.source?.trim() || undefined,
        }
      : undefined;

  try {
    await ensureJobSources();
    const results = await fetchAllJobs(crawlParams);
    const errors: string[] = [];

    for (const { source, jobs, error } of results) {
      let created = 0;
      let updated = 0;
      let fetchErrors = 0;

      if (error) {
        fetchErrors = 1;
        errors.push(`${source}: ${error}`);
      } else {
        for (const job of jobs) {
          try {
            const result = await upsertJob(job);
            if (result === "created") created++;
            else if (result === "updated") updated++;
          } catch (e) {
            fetchErrors++;
            errors.push(`${source} ${job.externalId}: ${(e as Error).message}`);
          }
        }
      }

      sourceStats.push({
        source,
        fetched: jobs.length,
        created,
        updated,
        errors: fetchErrors,
      });
    }

    const finishedAt = new Date();
    const totalJobs = sourceStats.reduce((s, x) => s + (x.fetched ?? 0), 0);
    const totalCreated = sourceStats.reduce((s, x) => s + (x.created ?? 0), 0);
    const totalUpdated = sourceStats.reduce((s, x) => s + (x.updated ?? 0), 0);
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await writeClient.createOrReplace({
      _id: crawlRunId,
      _type: "crawlRun",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      status: "completed",
      crawlType: "jobs",
      trigger,
      params: crawlParams
        ? {
            search: crawlParams.search,
            countryCode: crawlParams.countryCode,
            location: crawlParams.location,
            source: crawlParams.source,
          }
        : undefined,
      totalJobs,
      totalCreated,
      totalUpdated,
      durationMs,
      sourceStats,
      errorLog: errors.length > 0 ? errors.join("\n") : undefined,
    });

    return {
      crawlRunId,
      status: "completed",
      sourceStats,
      errorLog: errors.length > 0 ? errors.join("\n") : undefined,
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    const finishedAt = new Date();
    const totalJobs = sourceStats.reduce((s, x) => s + (x.fetched ?? 0), 0);
    const totalCreated = sourceStats.reduce((s, x) => s + (x.created ?? 0), 0);
    const totalUpdated = sourceStats.reduce((s, x) => s + (x.updated ?? 0), 0);
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await writeClient.createOrReplace({
      _id: crawlRunId,
      _type: "crawlRun",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      status: "failed",
      crawlType: "jobs",
      trigger,
      params: crawlParams
        ? {
            search: crawlParams.search,
            countryCode: crawlParams.countryCode,
            location: crawlParams.location,
            source: crawlParams.source,
          }
        : undefined,
      totalJobs,
      totalCreated,
      totalUpdated,
      durationMs,
      sourceStats,
      errorLog: errMsg,
    });

    return {
      crawlRunId,
      status: "failed",
      sourceStats,
      errorLog: errMsg,
    };
  }
}

async function upsertJob(job: NormalizedJob): Promise<"created" | "updated" | "skipped"> {
  const sourceId = JOB_SOURCE_IDS[job.source] ?? `jobSource-${job.source}`;

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

  const safeId = `${job.source}-${job.externalId}`
    .replace(/[^a-z0-9-]/gi, "-")
    .toLowerCase()
    .slice(0, 50);
  const docId = `jobListing-${safeId}-${Date.now().toString(36)}`;
  await writeClient.create({
    ...doc,
    _id: docId,
  });
  return "created";
}

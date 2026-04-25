/**
 * Company crawler - extracts companies from job APIs (same sources as jobs crawler).
 * Fetches jobs filtered by search/location, deduplicates by company name, creates company records.
 */

import { writeClient } from "@/sanity/lib/writeClient";
import { fetchAllJobs } from "@/lib/jobs/fetchers";
import type { NormalizedJob } from "@/lib/jobs/types";
import type { CrawlParams } from "@/lib/jobs/types";

const CRAWL_SOURCE = "job_apis";

const JOB_CATEGORY_TO_INDUSTRY: Record<string, string> = {
  "software engineering": "software",
  "software development": "software",
  "software-development": "software",
  "data science": "ai_ml",
  "devops": "software",
  "design": "software",
  "product": "software",
  "project management": "it_services",
  "qa": "software",
  "ai-ml": "ai_ml",
  "ai/ml": "ai_ml",
  "fintech": "fintech",
  "healthtech": "healthtech",
  "edtech": "edtech",
  "e-commerce": "ecommerce",
  "ecommerce": "ecommerce",
  "gaming": "gaming",
  "cybersecurity": "cybersecurity",
  "it services": "it_services",
};

export type CompanyCrawlParams = {
  search?: string;
  countryCode?: string;
  cityId?: string;
  industry?: string;
};

export type CompanyCrawlResult = {
  crawlRunId: string;
  status: "completed" | "failed";
  totalFetched: number;
  totalCreated: number;
  totalUpdated: number;
  totalErrors: number;
  durationMs: number;
  errorLog?: string;
};

function mapJobToIndustry(job: NormalizedJob): string {
  const cat = (job.category ?? "").toLowerCase();
  for (const [key, value] of Object.entries(JOB_CATEGORY_TO_INDUSTRY)) {
    if (cat.includes(key) || key.includes(cat)) return value;
  }
  return "software";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function runCompanyCrawl(options?: {
  params?: CompanyCrawlParams;
  trigger?: "manual" | "cron";
}): Promise<CompanyCrawlResult> {
  const params = options?.params;
  const trigger = options?.trigger ?? "manual";
  const startedAt = new Date();
  const runId = `companyCrawlRun-${Date.now()}`;

  const crawlParams: CrawlParams | undefined =
    params?.search || params?.countryCode
      ? {
          search: params.search?.trim() || undefined,
          countryCode:
            params.countryCode && params.countryCode !== "all"
              ? params.countryCode
              : undefined,
          location: params.search?.trim() || undefined,
        }
      : undefined;

  let cityRef: { _type: "reference"; _ref: string } | undefined;
  let countryRef: { _type: "reference"; _ref: string } | undefined;

  if (params?.cityId) {
    const city = await writeClient.fetch<{ _id: string; country?: { _id: string } } | null>(
      `*[_type == "city" && _id == $id][0]{ _id, country->{ _id } }`,
      { id: params.cityId }
    );
    if (city) {
      cityRef = { _type: "reference" as const, _ref: city._id };
      if (city.country?._id) {
        countryRef = { _type: "reference" as const, _ref: city.country._id };
      }
    }
  }

  // Set country from explicit countryCode first - never let search override it
  if (params?.countryCode) {
    const country = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "country" && countryCode == $code][0]{ _id }`,
      { code: params.countryCode.toUpperCase() }
    );
    if (country) {
      countryRef = { _type: "reference" as const, _ref: country._id };
    }
  }

  const errors: string[] = [];
  let totalFetched = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalErrors = 0;

  try {
    await writeClient.createOrReplace({
      _id: runId,
      _type: "companyCrawlRun",
      startedAt: startedAt.toISOString(),
      finishedAt: startedAt.toISOString(),
      status: "running",
      trigger,
      params: params ? { search: params.search, countryCode: params.countryCode, cityId: params.cityId } : undefined,
      totalFetched: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: 0,
    });

    const results = await fetchAllJobs(crawlParams);

    const companiesByKey = new Map<string, NormalizedJob>();

    for (const { source, jobs, error } of results) {
      if (error) {
        errors.push(`${source}: ${error}`);
        totalErrors++;
        continue;
      }

      for (const job of jobs) {
        const name = (job.companyName ?? "").trim();
        if (!name || name === "Unknown") continue;

        const key = `${slugify(name)}-${params?.countryCode ?? "any"}-${params?.cityId ?? "any"}`;
        if (companiesByKey.has(key)) continue;
        companiesByKey.set(key, job);
      }
      totalFetched += jobs.length;
    }

    const companies = Array.from(companiesByKey.values());

    for (const job of companies) {
      const name = (job.companyName ?? "").trim();
      if (!name) continue;

      try {
        const result = await upsertCompany({
          name,
          urlDomain: job.urlDomain,
          industry: params?.industry || mapJobToIndustry(job),
          cityRef,
          countryRef,
          crawlSource: CRAWL_SOURCE,
        });
        if (result === "created") totalCreated++;
        else if (result === "updated") totalUpdated++;
      } catch (e) {
        totalErrors++;
        errors.push(`${name}: ${(e as Error).message}`);
      }
    }

    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await writeClient.createOrReplace({
      _id: runId,
      _type: "companyCrawlRun",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      status: "completed",
      trigger,
      params: params
        ? {
            search: params.search,
            countryCode: params.countryCode,
            cityId: params.cityId,
          }
        : undefined,
      totalFetched: companies.length,
      totalCreated,
      totalUpdated,
      totalErrors,
      durationMs,
      errorLog: errors.length > 0 ? errors.join("\n") : undefined,
    });

    return {
      crawlRunId: runId,
      status: "completed",
      totalFetched: companies.length,
      totalCreated,
      totalUpdated,
      totalErrors,
      durationMs,
      errorLog: errors.length > 0 ? errors.join("\n") : undefined,
    };
  } catch (err) {
    const errMsg = (err as Error).message;
    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    await writeClient.createOrReplace({
      _id: runId,
      _type: "companyCrawlRun",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      status: "failed",
      trigger,
      params: params
        ? {
            search: params.search,
            countryCode: params.countryCode,
            cityId: params.cityId,
          }
        : undefined,
      totalFetched: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: totalErrors + 1,
      durationMs,
      errorLog: errMsg,
    });

    return {
      crawlRunId: runId,
      status: "failed",
      totalFetched: 0,
      totalCreated: 0,
      totalUpdated: 0,
      totalErrors: totalErrors + 1,
      durationMs,
      errorLog: errMsg,
    };
  }
}

async function upsertCompany(opts: {
  name: string;
  urlDomain?: string;
  industry?: string;
  cityRef?: { _type: "reference"; _ref: string };
  countryRef?: { _type: "reference"; _ref: string };
  crawlSource: string;
}): Promise<"created" | "updated" | "skipped"> {
  const slug = slugify(opts.name);
  const website = opts.urlDomain ? `https://${opts.urlDomain}` : undefined;

  const existing = await writeClient.fetch<
    { _id: string; lastCrawledAt?: string } | null
  >(
    `*[_type == "company" && name == $name][0]{ _id, lastCrawledAt }`,
    { name: opts.name }
  );

  const now = new Date().toISOString();
  const doc = {
    _type: "company" as const,
    name: opts.name,
    slug: slug || undefined,
    website: website || undefined,
    industry: opts.industry || undefined,
    city: opts.cityRef,
    country: opts.countryRef,
    crawlSource: opts.crawlSource,
    lastCrawledAt: now,
  };

  if (existing) {
    const patch = writeClient.patch(existing._id);
    patch.set({
      website: doc.website,
      industry: doc.industry,
      crawlSource: doc.crawlSource,
      lastCrawledAt: doc.lastCrawledAt,
    });
    if (opts.cityRef) {
      patch.set({ city: opts.cityRef });
    } else {
      patch.unset(["city"]);
    }
    if (opts.countryRef) {
      patch.set({ country: opts.countryRef });
    } else {
      patch.unset(["country"]);
    }
    await patch.commit();
    return "updated";
  }

  const safeId = `company-${slug}-${Date.now().toString(36)}`.slice(0, 100);
  await writeClient.create({
    ...doc,
    _id: safeId,
  });
  return "created";
}

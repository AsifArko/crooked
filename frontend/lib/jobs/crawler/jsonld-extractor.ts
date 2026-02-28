import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

type JobPostingSchema = {
  "@type"?: string;
  title?: string;
  description?: string;
  datePosted?: string;
  hiringOrganization?: { name?: string };
  jobLocation?: {
    address?: { addressLocality?: string; addressRegion?: string; addressCountry?: string };
  };
  employmentType?: string;
  baseSalary?: {
    value?: { minValue?: number; maxValue?: number; unitText?: string };
  };
  url?: string;
  directApply?: boolean;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

/**
 * Extract JobPosting schema from JSON-LD in HTML.
 */
export function extractJobPostings(html: string): JobPostingSchema[] {
  const results: JobPostingSchema[] = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    try {
      const json = JSON.parse(m[1].trim());
      const items = Array.isArray(json) ? json : json["@graph"] ?? [json];
      for (const item of items) {
        if (item["@type"] === "JobPosting" || item["@type"]?.includes?.("JobPosting")) {
          results.push(item);
        }
      }
    } catch {
      // ignore parse errors
    }
  }
  return results;
}

/**
 * Convert a JobPosting schema to NormalizedJob.
 */
export function jobPostingToNormalized(
  schema: JobPostingSchema,
  source: string,
  url: string
): NormalizedJob {
  const addr = schema.jobLocation?.address;
  const locality = addr?.addressLocality ?? "";
  const region = addr?.addressRegion ?? "";
  const country = addr?.addressCountry ?? "";
  const locationRaw = [locality, region, country].filter(Boolean).join(", ") || "Unknown";
  const isRemote =
    locationRaw.toLowerCase().includes("remote") ||
    locationRaw.toLowerCase().includes("anywhere") ||
    !locationRaw;

  const salary = schema.baseSalary?.value;
  const salaryMin = salary?.minValue;
  const salaryMax = salary?.maxValue;
  const currency = salary?.unitText ?? undefined;

  const externalId = schema.url ?? url;
  const postedAt = schema.datePosted
    ? new Date(schema.datePosted).toISOString()
    : new Date().toISOString();

  return {
    externalId,
    source,
    title: (schema.title ?? "").trim() || "Untitled",
    companyName: (schema.hiringOrganization?.name ?? "").trim() || "Unknown",
    description: stripHtml((schema.description ?? "").trim()),
    url: schema.url ?? url,
    locationRaw,
    remote: isRemote,
    jobType: schema.employmentType ?? undefined,
    salaryMin,
    salaryMax,
    currency,
    postedAt,
    tags: [],
    urlDomain: extractUrlDomain(schema.url ?? url),
  };
}

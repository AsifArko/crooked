/**
 * Job board scraping by location.
 * Many boards have location-based URLs. This module provides URL templates
 * and optional HTML scraping with JSON-LD extraction.
 *
 * Legal: Check each board's ToS and robots.txt before enabling.
 * Rate limit: 1–2 sec per domain.
 */

import type { LocationSeed } from "../geography/locations";
import type { NormalizedJob } from "../types";
import { extractJobPostings, jobPostingToNormalized } from "./jsonld-extractor";

const RATE_LIMIT_MS = Number(process.env.SCRAPE_RATE_LIMIT_MS) || 2000;
const USER_AGENT =
  process.env.SCRAPE_USER_AGENT ||
  "CrookedJobs/1.0 (https://crooked.com; jobs@crooked.com)";

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Build job board URLs for a location.
 * Returns URL templates - actual fetching is optional (ToS/legal review).
 */
export function getBoardUrls(loc: LocationSeed, keyword: string): string[] {
  const city = encodeURIComponent(loc.city);
  const q = encodeURIComponent(keyword);
  const urls: string[] = [];

  switch (loc.countryCode) {
    case "us":
      urls.push(`https://www.indeed.com/jobs?q=${q}&l=${city}`);
      break;
    case "gb":
      urls.push(`https://www.indeed.co.uk/jobs?q=${q}&l=${city}`);
      break;
    case "de":
      urls.push(`https://www.stepstone.de/jobs/${q.replace(/ /g, "+")}?location=${city}`);
      break;
    case "au":
      urls.push(`https://www.seek.com.au/${q.replace(/ /g, "-")}-jobs/in-${loc.citySlug}`);
      break;
    default:
      urls.push(`https://www.indeed.com/jobs?q=${q}&l=${city}`);
  }

  return urls;
}

/**
 * Fetch a URL and extract JobPosting JSON-LD from the HTML.
 * Use sparingly; respect rate limits and ToS.
 */
export async function scrapeJobsFromUrl(
  url: string,
  source: string
): Promise<NormalizedJob[]> {
  await delay(RATE_LIMIT_MS);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const schemas = extractJobPostings(html);
    return schemas.map((s) => jobPostingToNormalized(s, source, url));
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

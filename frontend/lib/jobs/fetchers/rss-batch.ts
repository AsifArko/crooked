import { fetchRssJobs } from "./rss";
import { RSS_FEEDS } from "../feeds/registry";
import type { NormalizedJob } from "../types";

const BATCH_SIZE = 10;
const RATE_LIMIT_MS = Number(process.env.SCRAPE_RATE_LIMIT_MS) || 1000;

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOneFeed(feed: (typeof RSS_FEEDS)[0]): Promise<{
  source: string;
  jobs: NormalizedJob[];
  error?: string;
}> {
  try {
    const jobs = await fetchRssJobs(feed.url, feed.source, feed.category);
    return { source: feed.source, jobs, error: undefined };
  } catch (e) {
    return {
      source: feed.source,
      jobs: [],
      error: (e as Error).message,
    };
  }
}

/**
 * Fetch jobs from all RSS feeds in the registry.
 * Runs feeds in parallel batches to avoid overwhelming servers.
 */
export async function fetchAllRssJobs(): Promise<{
  source: string;
  jobs: NormalizedJob[];
  error?: string;
}[]> {
  const bySource = new Map<string, { jobs: NormalizedJob[]; error?: string }>();

  for (let i = 0; i < RSS_FEEDS.length; i += BATCH_SIZE) {
    const batch = RSS_FEEDS.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(batch.map(fetchOneFeed));
    for (const p of settled) {
      if (p.status === "fulfilled") {
        const { source, jobs, error } = p.value;
        const existing = bySource.get(source);
        if (existing) {
          existing.jobs.push(...jobs);
          if (error) existing.error = existing.error ? `${existing.error}; ${error}` : error;
        } else {
          bySource.set(source, { jobs: [...jobs], error });
        }
      }
    }
    if (i + BATCH_SIZE < RSS_FEEDS.length) await delay(RATE_LIMIT_MS);
  }

  return Array.from(bySource.entries()).map(([source, { jobs, error }]) => ({
    source,
    jobs,
    error,
  }));
}

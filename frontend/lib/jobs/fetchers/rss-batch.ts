import { fetchRssJobs } from "./rss";
import { getRssFeeds } from "../feeds/get-feeds";
import type { NormalizedJob } from "../types";

const BATCH_SIZE = 10;
const RATE_LIMIT_MS = Number(process.env.SCRAPE_RATE_LIMIT_MS) || 1000;

async function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOneFeed(feed: { url: string; source: string; category?: string }): Promise<{
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
 * Fetch jobs from all RSS feeds. Uses Sanity jobFeed documents when available,
 * otherwise falls back to the static registry.
 * Runs feeds in parallel batches to avoid overwhelming servers.
 */
export async function fetchAllRssJobs(): Promise<{
  source: string;
  jobs: NormalizedJob[];
  error?: string;
}[]> {
  const feeds = await getRssFeeds();
  const bySource = new Map<string, { jobs: NormalizedJob[]; error?: string }>();

  for (let i = 0; i < feeds.length; i += BATCH_SIZE) {
    const batch = feeds.slice(i, i + BATCH_SIZE);
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
    if (i + BATCH_SIZE < feeds.length) await delay(RATE_LIMIT_MS);
  }

  return Array.from(bySource.entries()).map(([source, { jobs, error }]) => ({
    source,
    jobs,
    error,
  }));
}

/**
 * Get RSS feeds for crawling. Prefers Sanity jobFeed documents when available,
 * falls back to the static registry.
 */

import { client } from "@/sanity/lib/client";
import { RSS_FEEDS } from "./registry";

export type FeedInput = {
  url: string;
  source: string;
  category?: string;
};

export async function getRssFeeds(): Promise<FeedInput[]> {
  const feeds = await client.fetch<
    Array<{
      url: string;
      category?: string;
      source: { slug?: string } | null;
    }>
  >(
    `*[_type == "jobFeed" && enabled == true && defined(source)] {
      url,
      category,
      source->{ slug }
    }`
  );

  if (feeds && feeds.length > 0) {
    return feeds
      .filter((f) => f.url && f.source?.slug)
      .map((f) => ({
        url: f.url,
        source: f.source!.slug!,
        category: f.category ?? undefined,
      }));
  }

  return RSS_FEEDS.map((f) => ({
    url: f.url,
    source: f.source,
    category: f.category,
  }));
}

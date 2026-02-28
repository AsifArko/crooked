/**
 * Seed jobFeed documents from the static registry.
 * Run after ensure-sources. Idempotent - skips feeds that already exist by URL.
 */

import { writeClient } from "@/sanity/lib/writeClient";
import { RSS_FEEDS } from "../feeds/registry";

export async function ensureJobFeeds(): Promise<void> {
  for (const feed of RSS_FEEDS) {
    const existing = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "jobFeed" && url == $url][0]{ _id }`,
      { url: feed.url }
    );
    if (existing) continue;

    const sourceId = `jobSource-${feed.source}`;
    const sourceExists = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "jobSource" && _id == $id][0]{ _id }`,
      { id: sourceId }
    );
    if (!sourceExists) {
      console.warn(`Skipping feed ${feed.url}: source ${feed.source} not found. Run ensure-sources first.`);
      continue;
    }

    await writeClient.create({
      _type: "jobFeed",
      url: feed.url,
      source: { _type: "reference", _ref: sourceId },
      category: feed.category ?? undefined,
      feedType: "rss",
      enabled: true,
    });
  }
}

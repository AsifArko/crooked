import { XMLParser } from "fast-xml-parser";
import type { NormalizedJob } from "../types";
import { extractUrlDomain } from "../utils";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // Fix "Maximum nested tags exceeded" for feeds like eurobrussels.com
  maxNestedTags: 5000,
});

type RssItem = {
  title?: string;
  link?: string | { "@_href"?: string; "#text"?: string } | Array<{ "@_href"?: string }>;
  description?: string;
  pubDate?: string;
  "dc:creator"?: string;
  creator?: string;
  "content:encoded"?: string;
  guid?: string | { "#text"?: string };
};

type RssChannel = {
  item?: RssItem | RssItem[];
};

type ParsedRss = {
  rss?: { channel?: RssChannel };
  feed?: { entry?: RssItem | RssItem[] }; // Atom
};

function toArray<T>(v: T | T[] | undefined): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}

function extractLink(item: RssItem): string | undefined {
  const l = item.link;
  if (typeof l === "string") return l;
  if (Array.isArray(l) && l[0]) return (l[0] as { "@_href"?: string })["@_href"];
  if (l && typeof l === "object" && "@_href" in l) return (l as { "@_href"?: string })["@_href"];
  return undefined;
}

function deriveExternalId(item: RssItem): string {
  const link = extractLink(item);
  const guid = item.guid;
  const guidText =
    typeof guid === "string" ? guid : (guid as { "#text"?: string })?.["#text"];
  if (guidText) return guidText;
  if (link) {
    try {
      const u = new URL(link);
      return u.pathname + u.search || link;
    } catch {
      return link;
    }
  }
  const title = item.title ?? "";
  const creator = item["dc:creator"] ?? item.creator ?? "";
  return `${title}-${creator}`.replace(/[^a-z0-9-]/gi, "-").slice(0, 100) || `rss-${Date.now()}`;
}

export async function fetchRssJobs(
  feedUrl: string,
  sourceSlug: string,
  sourceVariant?: string
): Promise<NormalizedJob[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          process.env.SCRAPE_USER_AGENT ||
          "CrookedJobs/1.0 (https://crooked.com; jobs@crooked.com)",
      },
    });
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
    const xml = await res.text();
    const parsed = parser.parse(xml) as ParsedRss;

    const items: RssItem[] = [];
    if (parsed.rss?.channel?.item) {
      items.push(...toArray(parsed.rss.channel.item));
    } else if (parsed.feed?.entry) {
      items.push(...toArray(parsed.feed.entry));
    }

    const jobs: NormalizedJob[] = [];
    const seenIds = new Set<string>();

    for (const item of items) {
      const link = extractLink(item);
      if (!link) continue;

      const externalId = deriveExternalId(item);
      const key = `${sourceSlug}:${externalId}`;
      if (seenIds.has(key)) continue;
      seenIds.add(key);

      const title = (item.title ?? "").trim();
      const companyName = (item["dc:creator"] ?? item.creator ?? "").trim();
      const desc =
        item["content:encoded"] ?? item.description ?? "";
      const rawDesc = typeof desc === "string" ? desc : "";
      const description = stripHtml(rawDesc);

      let postedAt = new Date().toISOString();
      if (item.pubDate) {
        const d = new Date(item.pubDate);
        if (!isNaN(d.getTime())) postedAt = d.toISOString();
      }

      const loc = ""; // RSS often doesn't have location; crawler can enrich
      const isRemote =
        title.toLowerCase().includes("remote") ||
        rawDesc.toLowerCase().includes("remote") ||
        sourceSlug === "weworkremotely" ||
        sourceSlug === "jobscollider" ||
        sourceSlug === "remoteco";

      jobs.push({
        externalId,
        source: sourceSlug,
        sourceVariant: sourceVariant ?? undefined,
        title: title || "Untitled",
        companyName: companyName || "Unknown",
        description,
        url: link,
        locationRaw: loc || (isRemote ? "Remote" : "Unknown"),
        remote: isRemote,
        postedAt,
        tags: [],
        urlDomain: extractUrlDomain(link),
      });
    }

    return jobs;
  } finally {
    clearTimeout(timeout);
  }
}

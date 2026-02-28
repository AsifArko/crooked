/**
 * Greenhouse Job Board API fetcher.
 * Free, no auth required: https://boards-api.greenhouse.io/v1/boards/{token}/jobs
 */

import type { NormalizedJob } from "../types";

const GREENHOUSE_BOARDS = [
  "stripe",
  "vercel",
  "datadog",
  "figma",
  "notion",
  "airbnb",
  "dropbox",
  "spotify",
  "github",
  "netflix",
  "uber",
  "lyft",
  "shopify",
  "instacart",
  "reddit",
  "discord",
  "robinhood",
  "asana",
  "twilio",
  "box",
  "zendesk",
  "okta",
  "splunk",
  "mongodb",
  "elastic",
  "hashicorp",
  "cloudflare",
  "digitalocean",
  "gitlab",
  "atlassian",
];

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string } | string;
  updated_at?: string;
  content?: string;
  departments?: Array<{ name?: string }>;
};

type GreenhouseResponse = {
  jobs: GreenhouseJob[];
};

async function fetchBoardJobs(
  boardToken: string
): Promise<{ jobs: NormalizedJob[]; error?: string }> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        process.env.SCRAPE_USER_AGENT ||
        "CrookedJobs/1.0 (https://crooked.com; jobs@crooked.com)",
    },
  });
  if (!res.ok) {
    return { jobs: [], error: `Greenhouse ${boardToken}: ${res.status} ${res.statusText}` };
  }
  const data = (await res.json()) as GreenhouseResponse;
  const jobs: NormalizedJob[] = (data.jobs ?? []).map((j) => {
    const loc =
      typeof j.location === "string"
        ? j.location
        : j.location?.name ?? "";
    const isRemote =
      loc.toLowerCase().includes("remote") ||
      j.title.toLowerCase().includes("remote");
    return {
      externalId: String(j.id),
      source: "greenhouse",
      sourceVariant: boardToken,
      title: j.title || "Untitled",
      companyName: boardToken.charAt(0).toUpperCase() + boardToken.slice(1),
      description: j.content ?? "",
      url: j.absolute_url,
      locationRaw: loc || (isRemote ? "Remote" : "Unknown"),
      remote: isRemote,
      postedAt: j.updated_at ? new Date(j.updated_at).toISOString() : new Date().toISOString(),
      tags: [],
      urlDomain: `boards.greenhouse.io`,
    };
  });
  return { jobs };
}

export async function fetchGreenhouseJobs(): Promise<{
  source: string;
  jobs: NormalizedJob[];
  error?: string;
}> {
  const allJobs: NormalizedJob[] = [];
  const errors: string[] = [];

  for (const board of GREENHOUSE_BOARDS) {
    try {
      const { jobs, error } = await fetchBoardJobs(board);
      allJobs.push(...jobs);
      if (error) errors.push(error);
      await new Promise((r) => setTimeout(r, 100));
    } catch (e) {
      errors.push(`${board}: ${(e as Error).message}`);
    }
  }

  return {
    source: "greenhouse",
    jobs: allJobs,
    error: errors.length > 0 ? errors.join("; ") : undefined,
  };
}

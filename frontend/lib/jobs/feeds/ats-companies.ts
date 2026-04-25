/**
 * ATS company slugs for Greenhouse, Lever, Workable.
 * Used to build RSS feed URLs: boards.greenhouse.io/{slug}/jobs.rss
 * Expand this list to add more companies.
 */

export const GREENHOUSE_COMPANIES = [
  "stripe",
  "datadog",
  "figma",
  "notion",
  "vercel",
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
  "twilio",
  "asana",
  "box",
  "canva",
  "coinbase",
  "doordash",
  "duolingo",
  "expedia",
  "flexport",
  "gong",
  "gopuff",
  "grammarly",
  "gusto",
  "hashicorp",
  "hubspot",
  "intercom",
  "klaviyo",
  "lattice",
  "lendingclub",
  "mongodb",
  "niantic",
  "okta",
  "opendoor",
  "pagerduty",
  "pinterest",
  "plaid",
  "quora",
  "robinhood",
  "samsara",
  "segment",
  "snowflake",
  "squarespace",
  "tripadvisor",
  "twitch",
  "webflow",
  "zendesk",
  "zoom",
] as const;

export const LEVER_COMPANIES = [
  "gumroad",
  "linear",
  "loom",
  "retool",
  "scale",
  "brex",
  "deel",
  "mercury",
  "ramp",
  "rippling",
  "runway",
  "stripe",
  "anthropic",
  "openai",
  "cohere",
  "replicate",
  "huggingface",
  "langchain",
  "weaviate",
  "pinecone",
] as const;

export const WORKABLE_COMPANIES = [
  "buffer",
  "automattic",
  "gitlab",
  "basecamp",
  "zapier",
  "aha",
  "aha",
] as const;

export function getGreenhouseRssUrl(slug: string): string {
  return `https://boards.greenhouse.io/${slug}/jobs.rss`;
}

export function getLeverRssUrl(slug: string): string {
  return `https://jobs.lever.co/${slug}/rss`;
}

export function getWorkableRssUrl(slug: string): string {
  return `https://apply.workable.com/${slug}/rss`;
}

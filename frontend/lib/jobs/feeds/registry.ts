/**
 * RSS/Atom feed registry for job sources.
 * Add feeds here to expand job coverage without API keys.
 */

export const RSS_FEEDS: Array<{
  url: string;
  source: string;
  category?: string;
}> = [
  // Remote / Tech
  {
    url: "https://jobscollider.com/remote-software-development-jobs.rss",
    source: "jobscollider",
    category: "remote-software",
  },
  {
    url: "https://jobscollider.com/remote-jobs.rss",
    source: "jobscollider",
    category: "remote",
  },
  {
    url: "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    source: "weworkremotely",
    category: "programming",
  },
  {
    url: "https://weworkremotely.com/categories/remote-design-jobs.rss",
    source: "weworkremotely",
    category: "design",
  },
  {
    url: "https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss",
    source: "weworkremotely",
    category: "devops",
  },
  {
    url: "https://weworkremotely.com/categories/remote-product-jobs.rss",
    source: "weworkremotely",
    category: "product",
  },
  {
    url: "https://remote.co/remote-jobs/developer/feed/",
    source: "remoteco",
    category: "developer",
  },
  {
    url: "https://remote.co/remote-jobs/design/feed/",
    source: "remoteco",
    category: "design",
  },
  // Stack Overflow & Hacker News
  {
    url: "https://stackoverflow.com/jobs/feed",
    source: "stackoverflow",
  },
  {
    url: "https://news.ycombinator.com/jobs.rss",
    source: "hackernews",
  },
  // Design & Dev
  {
    url: "https://authenticjobs.com/jobs/feed/",
    source: "authenticjobs",
  },
  {
    url: "https://dribbble.com/jobs/feed",
    source: "dribbble",
  },
  {
    url: "https://www.smashingmagazine.com/jobs/feed/",
    source: "smashingmagazine",
  },
  // EU
  {
    url: "https://eurobrussels.com/jobs/feed",
    source: "eurobrussels",
  },
  // Greenhouse ATS (sample companies – expand via ats-companies.ts)
  {
    url: "https://boards.greenhouse.io/stripe/jobs.rss",
    source: "greenhouse",
    category: "stripe",
  },
  {
    url: "https://boards.greenhouse.io/datadog/jobs.rss",
    source: "greenhouse",
    category: "datadog",
  },
  {
    url: "https://boards.greenhouse.io/figma/jobs.rss",
    source: "greenhouse",
    category: "figma",
  },
  {
    url: "https://boards.greenhouse.io/notion/jobs.rss",
    source: "greenhouse",
    category: "notion",
  },
  {
    url: "https://boards.greenhouse.io/vercel/jobs.rss",
    source: "greenhouse",
    category: "vercel",
  },
  {
    url: "https://boards.greenhouse.io/airbnb/jobs.rss",
    source: "greenhouse",
    category: "airbnb",
  },
  {
    url: "https://boards.greenhouse.io/dropbox/jobs.rss",
    source: "greenhouse",
    category: "dropbox",
  },
  {
    url: "https://boards.greenhouse.io/spotify/jobs.rss",
    source: "greenhouse",
    category: "spotify",
  },
  {
    url: "https://boards.greenhouse.io/github/jobs.rss",
    source: "greenhouse",
    category: "github",
  },
  {
    url: "https://boards.greenhouse.io/netflix/jobs.rss",
    source: "greenhouse",
    category: "netflix",
  },
  {
    url: "https://boards.greenhouse.io/uber/jobs.rss",
    source: "greenhouse",
    category: "uber",
  },
  {
    url: "https://boards.greenhouse.io/lyft/jobs.rss",
    source: "greenhouse",
    category: "lyft",
  },
  {
    url: "https://boards.greenhouse.io/shopify/jobs.rss",
    source: "greenhouse",
    category: "shopify",
  },
  {
    url: "https://boards.greenhouse.io/instacart/jobs.rss",
    source: "greenhouse",
    category: "instacart",
  },
  {
    url: "https://boards.greenhouse.io/reddit/jobs.rss",
    source: "greenhouse",
    category: "reddit",
  },
  {
    url: "https://boards.greenhouse.io/discord/jobs.rss",
    source: "greenhouse",
    category: "discord",
  },
  {
    url: "https://boards.greenhouse.io/robinhood/jobs.rss",
    source: "greenhouse",
    category: "robinhood",
  },
];

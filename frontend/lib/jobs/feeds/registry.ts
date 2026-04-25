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
  // Remote.co: 404 - feed URLs changed, disabled for now
  // { url: "https://remote.co/remote-jobs/developer/feed/", source: "remoteco", category: "developer" },
  // { url: "https://remote.co/remote-jobs/design/feed/", source: "remoteco", category: "design" },
  // Stack Overflow & Hacker News
  // Stack Overflow: 403 Forbidden (Cloudflare blocks bots) - disabled
  // { url: "https://stackoverflow.com/jobs/feed", source: "stackoverflow" },
  {
    url: "https://hnrss.org/jobs",
    source: "hackernews",
  },
  // Design & Dev
  {
    url: "https://authenticjobs.com/jobs/feed/",
    source: "authenticjobs",
  },
  // Dribbble: 404 - no longer offers jobs RSS
  // { url: "https://dribbble.com/jobs/feed", source: "dribbble" },
  {
    url: "https://www.smashingmagazine.com/jobs/feed/",
    source: "smashingmagazine",
  },
  // EU
  {
    url: "https://eurobrussels.com/jobs/feed",
    source: "eurobrussels",
  },
  // Academic / Computer Science (jobs.ac.uk)
  {
    url: "https://www.jobs.ac.uk/jobs/computer-science/?format=rss",
    source: "jobsacuk",
    category: "computer-science",
  },
  {
    url: "https://www.jobs.ac.uk/jobs/software-engineering/?format=rss",
    source: "jobsacuk",
    category: "software-engineering",
  },
  {
    url: "https://www.jobs.ac.uk/jobs/artificial-intelligence/?format=rss",
    source: "jobsacuk",
    category: "artificial-intelligence",
  },
  {
    url: "https://www.jobs.ac.uk/jobs/cyber-security/?format=rss",
    source: "jobsacuk",
    category: "cyber-security",
  },
  {
    url: "https://www.jobs.ac.uk/jobs/information-systems/?format=rss",
    source: "jobsacuk",
    category: "information-systems",
  },
  // Greenhouse: RSS feeds return 404 - use Greenhouse API fetcher instead (free JSON API)
];

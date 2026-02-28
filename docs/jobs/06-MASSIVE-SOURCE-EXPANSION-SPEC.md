# Massive Job Source Expansion – Specification

## Purpose

This document specifies how to expand the Jobs module from **5 APIs** to **maximum possible coverage** – targeting hundreds of sources and hundreds of thousands of jobs. It is intended for implementation in a future chat/session.

---

## Reality Check: Why Only 5 APIs Today?

**There are not 100,000 free public job APIs.** The global landscape of job data is:

- **~20–30** documented free/freemium job APIs worldwide
- **~50–100** job boards with RSS feeds (many require attribution, some have ToS restrictions)
- **Thousands** of company career pages (would require scraping – legal/ToS gray area)
- **Paid aggregators** (e.g. JobDataFeeds, SerpApi) offer millions of jobs but cost money

**Achievable goal:** Expand to **50–150+ distinct sources** (APIs + RSS feeds + known job board URLs) to reach **100,000+ jobs** in the database. The "100,000" target is **jobs**, not APIs.

---

## Expansion Strategy Overview

| Tier  | Source Type                | Count (Est.)       | Implementation                                         |
| ----- | -------------------------- | ------------------ | ------------------------------------------------------ |
| **1** | Free REST APIs             | 20–30              | Add fetchers (like Remotive)                           |
| **2** | RSS/Atom feeds             | 50–100             | Parse XML, normalize to `NormalizedJob`                |
| **3** | ATS career pages           | 100+               | Scrape known URLs (Greenhouse, Lever, Workable, etc.)  |
| **4** | Country-specific boards    | 200+               | Per-country job board URLs + RSS                       |
| **5** | Company career pages       | 1000+              | Crawl sitemaps, /careers, /jobs paths                  |
| **6** | **Location-based crawler** | **City × Country** | Google Jobs (SerpApi) + scrape job boards per location |

**Tier 6** is the automated tool for scraping/searching jobs for every city and country: location seed → query generator → SerpApi + board scrapers → store jobs with place ref.

**Priority for next implementation:** Tiers 1, 2, and 6 (APIs + RSS + location crawler).

---

## Tier 1: Additional Free REST APIs

### Currently Implemented (5)

- Remotive, Arbeitnow, The Muse, Adzuna, USAJOBS

### To Add (Documented Free/Freemium)

| API                       | URL / Docs             | Auth         | Region        | Notes                        |
| ------------------------- | ---------------------- | ------------ | ------------- | ---------------------------- |
| **Careerjet**             | careerjet.com/partners | Affiliate ID | Multi-country | Partner signup, locale codes |
| **Jooble**                | jooble.org/api         | API key      | Multi-country | Real-time, multilingual      |
| **Reed**                  | reed.co.uk/developers  | API key      | UK            | UK-focused                   |
| **Arbeitsamt**            | arbeitsagentur.de      | OAuth?       | Germany       | German federal jobs          |
| **DevITjobs UK**          | devitjobs.uk           | Unknown      | UK            | Dev-focused                  |
| **Juju**                  | juju.com               | Unknown      | Multi         | Job aggregator               |
| **JobsAPI (RapidAPI)**    | rapidapi.com           | Key          | Various       | May have free tier           |
| **Jobicy**                | jobicy.com/api         | Unknown      | Remote        | Remote jobs                  |
| **RemoteOK**              | remoteok.com/api       | None         | Remote        | JSON API, no auth            |
| **We Work Remotely**      | RSS only               | -            | Remote        | See Tier 2                   |
| **Himalayas**             | himalayas.app          | Unknown      | Remote        | Remote jobs                  |
| **Wellfound (AngelList)** | wellfound.com          | OAuth        | Startups      | Startup jobs                 |
| **LinkedIn**              | -                      | Paid only    | Global        | No free API                  |
| **Indeed**                | -                      | Partner only | Global        | No public API                |

### Implementation Pattern

- Create `frontend/lib/jobs/fetchers/{source}.ts` for each
- Add to `fetchers/index.ts` with `fetchAllJobs()` orchestration
- Register in `jobSource` seed
- Handle rate limits, pagination, error handling per API

---

## Tier 2: RSS / Atom Feeds

RSS feeds are abundant and often require no auth. Parse XML → extract job fields → normalize.

### Known RSS Feed Sources

| Source                  | Feed URL Pattern                                          | Update Freq | Region     |
| ----------------------- | --------------------------------------------------------- | ----------- | ---------- |
| **JobsCollider**        | jobscollider.com/remote-software-development-jobs.rss     | Hourly      | Remote     |
| **JobsCollider**        | jobscollider.com/remote-jobs.rss                          | Hourly      | Remote     |
| **We Work Remotely**    | weworkremotely.com/categories/remote-programming-jobs.rss | Daily       | Remote     |
| **Stack Overflow Jobs** | stackoverflow.com/jobs/feed                               | -           | Global     |
| **Authentic Jobs**      | authenticjobs.com/jobs/feed/                              | -           | Design/Dev |
| **Hacker News**         | news.ycombinator.com/jobs.rss                             | -           | Tech       |
| **Remote.co**           | remote.co/remote-jobs/developer/feed/                     | -           | Remote     |
| **FlexJobs**            | flexjobs.com/feed (if public)                             | -           | Flexible   |
| **Dribbble**            | dribbble.com/jobs/feed                                    | -           | Design     |
| **Smashing Magazine**   | smashingmagazine.com/jobs/feed/                           | -           | Design/Dev |
| **Product Hunt**        | producthunt.com/jobs (if feed exists)                     | -           | Startups   |
| **AngelList/Wellfound** | (check for RSS)                                           | -           | Startups   |
| **GitHub**              | github.com/jobs (deprecated, was RSS)                     | -           | -          |
| **EuroBrussels**        | eurobrussels.com/jobs/feed                                | -           | EU         |
| **EU Careers**          | epso.europa.eu (check for feed)                           | -           | EU         |
| **Greenhouse**          | boards.greenhouse.io/{company}/jobs.rss                   | Per company | Various    |
| **Lever**               | jobs.lever.co/{company}/rss                               | Per company | Various    |
| **Workable**            | apply.workable.com/{company}/rss                          | Per company | Various    |

### RSS Parser Implementation

```ts
// frontend/lib/jobs/fetchers/rss.ts
export async function fetchRssJobs(
  feedUrl: string,
  sourceSlug: string,
): Promise<NormalizedJob[]>;
// Parse XML with fast-xml-parser or similar
// Map <item> elements: title, link, description, pubDate, dc:creator (company)
// Return NormalizedJob[]
```

### RSS Feed Registry

Create `frontend/lib/jobs/feeds/registry.ts`:

```ts
export const RSS_FEEDS: Array<{
  url: string;
  source: string;
  category?: string;
}> = [
  {
    url: "https://jobscollider.com/remote-software-development-jobs.rss",
    source: "jobscollider",
  },
  {
    url: "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    source: "weworkremotely",
  },
  // ... 50+ feeds
];
```

---

## Tier 3: ATS Career Page Scraping

Many companies use Greenhouse, Lever, Workable. These have predictable URL patterns and often expose RSS.

### Greenhouse

- `https://boards.greenhouse.io/{company}/jobs` or `/embed/jobs`
- RSS: `https://boards.greenhouse.io/{company}/jobs.rss`
- Company list: maintain a list of 500+ company slugs (e.g. from public lists)

### Lever

- `https://jobs.lever.co/{company}`
- RSS: `https://jobs.lever.co/{company}/rss`

### Workable

- `https://apply.workable.com/{company}/`
- RSS: `https://apply.workable.com/{company}/rss`

### Implementation

- Maintain `ATS_COMPANY_REGISTRY`: list of company slugs per ATS
- For each: fetch RSS or scrape jobs JSON (some ATS expose JSON)
- **Legal:** Check each ATS ToS; many allow indexing for job boards with attribution

---

## Tier 4: Country-Specific Job Boards

Per-country boards (often with RSS or scrapeable structure):

| Country     | Boards                                       |
| ----------- | -------------------------------------------- |
| UK          | Reed, CV-Library, Totaljobs, Jobsite, CWJobs |
| Germany     | StepStone, Indeed DE, Xing, Monster DE       |
| France      | Cadremploi, Apec, RegionsJob, HelloWork      |
| India       | Naukri, Shine, Indeed India                  |
| Australia   | Seek, Indeed AU, Jora                        |
| Canada      | Job Bank, Indeed CA, Workopolis              |
| Netherlands | Nationale Vacaturebank, Indeed NL            |
| Spain       | InfoJobs, Indeed ES                          |
| Brazil      | Catho, Vagas, Indeed BR                      |
| Japan       | Rikunabi, Indeed JP, Doda                    |

Many have RSS or partner APIs. Research each before implementing.

---

## Tier 5: Web Crawling / Scraping (Advanced)

**Caution:** Scraping may violate ToS. Only pursue with legal review.

- **Sitemaps:** Many job boards have `/sitemap.xml` or `/job-sitemap.xml`
- **Structured data:** Job postings often have `JobPosting` JSON-LD schema
- **Common paths:** `/jobs`, `/careers`, `/openings`, `/opportunities`

**Tools:** Puppeteer/Playwright for JS-rendered pages; Cheerio for static HTML; Apify (paid) for managed scraping.

---

## Tier 6: Automated Location-Based Crawler (City × Country × Keywords)

**Goal:** An automated tool that systematically searches for software engineer jobs for **every city** and **every country** in the world.

### Architecture: Location-Based Crawl Engine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOCATION-BASED CRAWL ENGINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  LOCATION SEED    │    │  SEARCH QUERY    │    │  CRAWL SOURCES   │      │
│  │  • Countries      │    │  GENERATOR       │    │  • Google Jobs   │      │
│  │  • Cities         │    │  • "software     │    │  • Job boards    │      │
│  │  (from OSM)       │    │    engineer      │    │    per location  │      │
│  │                   │    │    {city}"       │    │  • Scrape URLs   │      │
│  └────────┬──────────┘    └────────┬─────────┘    └────────┬─────────┘      │
│           │                       │                       │                 │
│           └──────────────────────┼───────────────────────┘                 │
│                                  ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  CRAWL ORCHESTRATOR                                                     ││
│  │  • Iterate: country → cities → keywords                                 ││
│  │  • Rate limit per source (1 req/sec)                                    ││
│  │  • Batch: 10 locations per cron run, rotate daily                       ││
│  │  • Store: NormalizedJob + place ref                                     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 Location Seed (City × Country)

Use OpenStreetMap data (already in place):

- **Countries:** `place` docs with `placeType: 'country'` (or ISO 3166 list)
- **Cities:** Overpass API or `place` docs with `placeType: 'city'` or `placeType: 'town'`
- **Priority cities:** Top 500–2000 cities by population (from OSM `population` tag or external list)

**Data source:** `frontend/lib/jobs/geography/locations.ts` – array of `{ countryCode, countryName, city, citySlug }` for major cities.

**Scale:** ~200 countries × ~50–200 major cities each = 10,000–40,000 location combinations. Crawl in batches (e.g. 100 locations per run).

### 6.2 Search Query Generator

For each `(country, city)` pair, generate:

```ts
const KEYWORDS = [
  "software engineer",
  "software developer",
  "developer",
  "programmer",
  "data scientist",
  "backend developer",
  "frontend developer",
  "full stack developer",
  "devops engineer",
  "computer science",
  "machine learning engineer",
];

// For each location:
queries.push(`software engineer jobs ${city} ${country}`);
queries.push(`developer ${city}`);
// etc.
```

### 6.3 Google Jobs Search (SerpApi)

**SerpApi Google Jobs API:** `https://serpapi.com/search?engine=google_jobs&q={query}&location={city}`

- **Free tier:** ~100 searches/month (check SerpApi pricing)
- **Paid:** $50/mo for 5,000 searches; scales up
- **Usage:** For each `(query, location)` → fetch → parse JSON → extract job listings

**Params:**

- `q`: "software engineer jobs Berlin" or "developer jobs Berlin Germany"
- `location`: City or country for geo-targeting
- `gl`: Country code (e.g. `de`)
- `hl`: Language (e.g. `en`)

**Pagination:** `next_page_token` for more results (10 per page).

### 6.4 Job Board Scraping by Location

Many job boards have location-based URLs:

| Board          | URL Pattern                                                  | Example       |
| -------------- | ------------------------------------------------------------ | ------------- |
| Indeed         | `indeed.com/jobs?q=software+engineer&l=Berlin`               | Per country   |
| LinkedIn       | `linkedin.com/jobs/search?keywords=software&location=Berlin` | Requires auth |
| Glassdoor      | `glassdoor.com/Job/berlin-software-engineer-jobs`            | Per city      |
| StepStone (DE) | `stepstone.de/jobs/software+engineer?location=Berlin`        | Germany       |
| InfoJobs (ES)  | `infojobs.net/berlin/software-engineer`                      | Spain         |
| Seek (AU)      | `seek.com.au/software-engineer-jobs/in-berlin`               | Australia     |

**Scraping strategy:**

1. Build URL template per board: `{baseUrl}/jobs?q={keyword}&l={city}`
2. Fetch HTML (or use API if available)
3. Parse JSON-LD `JobPosting` schema (many boards embed this)
4. Fallback: Cheerio/Puppeteer to extract job cards

**Legal:** Check each board's ToS and `robots.txt`. Use `User-Agent` and respect `Crawl-delay` if specified.

### 6.5 JSON-LD JobPosting Extraction

Many job pages embed structured data:

```html
<script type="application/ld+json">
  {
    "@type": "JobPosting",
    "title": "Software Engineer",
    "hiringOrganization": { "name": "Acme Inc" },
    "jobLocation": { "address": { "addressLocality": "Berlin" } },
    "datePosted": "2024-01-15",
    "description": "..."
  }
</script>
```

**Implementation:** When scraping a job page (or job listing page), extract `application/ld+json` scripts, parse JSON, filter for `@type === "JobPosting"`.

### 6.6 Crawl Orchestrator

**Cron job:** Runs every 4–6 hours. Each run:

1. **Select batch:** Next 50–100 `(country, city)` pairs from queue (round-robin or priority)
2. **For each location:**
   - Generate 3–5 search queries (keywords × location)
   - **Option A:** Call SerpApi Google Jobs (if budget allows)
   - **Option B:** Scrape 2–3 job boards that support that country
   - **Option C:** Call Adzuna/Indeed API with `where={city}` (if available)
3. **Deduplicate** by job URL before insert
4. **Rate limit:** 1–2 sec delay between requests per domain
5. **Log:** `crawlRun` with `locationBatch` and `jobsFound` per location

**Queue:** Store `pendingLocations` in Sanity or a JSON file. Rotate so each location is crawled every 7–14 days.

### 6.7 Implementation Files

```
frontend/lib/jobs/
├── crawler/
│   ├── location-engine.ts   # Location iteration, batch selection
│   ├── query-generator.ts   # Build search queries per location
│   ├── serpapi.ts           # Google Jobs via SerpApi
│   ├── boards-scraper.ts    # Scrape job boards by URL template
│   ├── jsonld-extractor.ts  # Extract JobPosting from HTML
│   └── orchestrator.ts      # Main crawl loop
├── geography/
│   ├── locations.ts         # City × country seed (major cities)
│   └── locations-queue.ts   # Pending locations, rotation
├── fetchers/
│   └── ...
```

### 6.8 Environment Variables

```env
# SerpApi (Google Jobs) – optional, paid after free tier
SERPAPI_KEY=

# Scraping (optional)
SCRAPE_USER_AGENT="CrookedJobs/1.0 (https://yoursite.com; contact@yoursite.com)"
SCRAPE_RATE_LIMIT_MS=2000
```

### 6.9 Legal & Ethical Considerations

- **robots.txt:** Respect disallow rules
- **ToS:** Many job boards prohibit scraping; use APIs or RSS where available
- **Rate limiting:** Avoid overloading servers; 1–2 req/sec per domain
- **Attribution:** Link back to original job URL; credit source
- **Data retention:** Only store job metadata; don't republish full descriptions without permission

---

## Data Model Extensions

### Persistence Rule (Non-Negotiable)

**Never delete `jobListing` documents.** All crawlers (APIs, RSS, SerpApi, scrapers) must only:

- **Create** new jobs when first seen
- **Update** existing jobs (by `externalId` + `source`) with fresh data

If a job disappears from a source (filled, expired, removed), it stays in Sanity. Optionally add `status: 'expired'` and `lastSeenAt` for filtering, but do not delete.

---

### New Schema: `jobFeed`

For RSS/ATS sources that aren't full APIs:

```ts
{
  name: 'jobFeed',
  fields: [
    { name: 'url', type: 'url' },
    { name: 'source', type: 'reference', to: ['jobSource'] },
    { name: 'feedType', type: 'string' }, // rss | atom | greenhouse_rss | lever_rss
    { name: 'enabled', type: 'boolean' },
    { name: 'lastCrawledAt', type: 'datetime' },
    { name: 'lastError', type: 'string' },
  ]
}
```

### Crawl Run Extensions

- Add `feedStats` to `crawlRun` for per-feed success/failure
- Track `jobsCreated`, `jobsUpdated`, `jobsSkipped` per source

---

## Implementation Roadmap (For Next Chat)

### Phase A: RSS Infrastructure (High Priority)

1. Add `fast-xml-parser` (or use native DOMParser) for RSS parsing
2. Create `fetchRssJobs(feedUrl, sourceSlug)` in `fetchers/rss.ts`
3. Create `feeds/registry.ts` with 20+ RSS feed URLs
4. Integrate RSS fetcher into `fetchAllJobs()` – run in parallel with APIs
5. Add `jobFeed` schema (optional – can use config file instead)
6. Seed `jobSource` for each new source (jobscollider, weworkremotely, etc.)

### Phase B: Additional APIs (Medium Priority)

1. RemoteOK API (no auth)
2. Jobicy API (if public)
3. Careerjet (partner signup)
4. Jooble (API key)
5. Reed UK (API key)
6. Add each with fetcher + env var for keys

### Phase C: ATS RSS Feeds (Medium Priority)

1. Build company registry: 100+ Greenhouse slugs, 50+ Lever, 50+ Workable
2. Create `fetchAtsRssJobs()` that iterates registry, fetches each RSS
3. Deduplicate by URL across sources
4. Rate limit: 1 req/sec per domain to avoid blocks

### Phase D: Scale & Resilience (Ongoing)

1. **Queue/cron:** Split crawl into batches – e.g. 20 sources per cron run, rotate
2. **Rate limiting:** Per-source rate limits, exponential backoff
3. **Monitoring:** Alert on crawl failures, track job count trends
4. **Deduplication:** Hash of (title + company + url) for cross-source dedup

### Phase E: Location-Based Crawler (Tier 6)

1. **Location seed:** Build `geography/locations.ts` with 2,000+ cities × countries (from OSM or static list)
2. **SerpApi integration:** Add `crawler/serpapi.ts` – Google Jobs search per `(query, location)`
3. **Query generator:** `query-generator.ts` – keywords × locations
4. **Orchestrator:** `crawler/orchestrator.ts` – batch 50–100 locations per cron, rotate queue
5. **Job board scrapers:** Add URL templates for Indeed, StepStone, InfoJobs, etc. (per-country)
6. **JSON-LD extractor:** Parse `JobPosting` from scraped HTML
7. **Cron:** New route `/api/cron/crawl-jobs-locations` – runs location-based crawl (e.g. daily, off-peak)

---

## File Structure (Target)

```
frontend/lib/jobs/
├── fetchers/
│   ├── index.ts           # Orchestrates all fetchers
│   ├── remotive.ts
│   ├── arbeitnow.ts
│   ├── adzuna.ts
│   ├── themuse.ts
│   ├── usajobs.ts
│   ├── rss.ts             # Generic RSS parser
│   ├── remoteok.ts        # NEW
│   ├── jobicy.ts          # NEW
│   ├── careerjet.ts       # NEW
│   └── ...
├── feeds/
│   ├── registry.ts        # 50+ RSS feed URLs
│   └── ats-companies.ts   # Greenhouse/Lever/Workable company slugs
├── crawler/               # Location-based automated crawl engine
│   ├── location-engine.ts   # Location iteration, batch selection
│   ├── query-generator.ts   # Build search queries per (city, country)
│   ├── serpapi.ts           # Google Jobs via SerpApi
│   ├── boards-scraper.ts    # Scrape job boards by URL template
│   ├── jsonld-extractor.ts  # Extract JobPosting from HTML
│   └── orchestrator.ts      # Main crawl loop
├── geography/
│   ├── locations.ts         # City × country seed (2K+ locations)
│   └── locations-queue.ts   # Pending locations, rotation
├── crawler.ts             # Existing API-based crawler
├── types.ts
└── utils.ts
```

---

## Success Metrics

| Metric         | Current | Target (Phase A+B) | Stretch (Phase C+D)    |
| -------------- | ------- | ------------------ | ---------------------- |
| Sources        | 5       | 30                 | 80+                    |
| Jobs in DB     | ~500–2K | 20K–50K            | 100K+                  |
| Crawl duration | ~2 min  | ~10 min            | ~30 min (batched)      |
| Cron frequency | 6h      | 6h (or 4h)         | 4h with batch rotation |

---

## Tier 7: Twitter/X Job Search (Optional, Paid)

**Goal:** Crawl job postings from tech-focused Twitter/X accounts that regularly share software engineering roles (e.g. @golangcafe, @pythonjobs, @RemoteJobsBoard).

### Reality Check: Twitter/X API (2024–2025)

- **No free tier** for meaningful usage. X removed the free API tier.
- **Basic tier:** ~$200/month – up to 10K posts/month
- **Pay-per-use pilot:** ~$0.005 per post read
- **Pro tier:** $5,000/month for high volume

**Cost-effective use:** If you have API budget, limit to 50–200 tweets per crawl (e.g. 5–10 accounts × 10–20 tweets each) to stay under Basic tier.

### Job-Related Twitter/X Accounts (Examples)

| Account           | Focus              | Notes                          |
| ----------------- | ------------------ | ------------------------------ |
| @golangcafe       | Golang jobs        | Golang Cafe job board          |
| @pythonjobs       | Python jobs        | Python-focused                 |
| @RemoteJobsBoard  | Remote jobs        | General remote                 |
| @WhoIsHiring      | HN-style jobs     | Monthly "Who is hiring?"       |
| @TechJobsBot      | Tech jobs          | Aggregator                     |
| @remoteworkio     | Remote work        | Remote roles                   |

**Note:** Golang Cafe (golang.cafe) is primarily a job board. Check if they offer RSS or an API – that would be free and avoid Twitter API costs.

### Implementation Approach

1. **Fetcher:** `frontend/lib/jobs/fetchers/twitter.ts`
   - Use X API v2 `tweets/search/recent` or `users/:id/tweets`
   - Query: `from:golangcafe (hiring OR job OR engineer)` or fetch recent tweets from job accounts
   - Parse tweets for URLs (job links)
   - Optionally: fetch linked pages and extract `JobPosting` JSON-LD for full details
   - Normalize to `NormalizedJob` (title from tweet text, url from link, company from tweet or link)

2. **Env vars:** `TWITTER_BEARER_TOKEN` (or `X_API_KEY`)

3. **Registry:** `frontend/lib/jobs/feeds/twitter-accounts.ts` – list of job-posting account IDs

4. **Rate limits:** 1–2 req/sec; batch 5–10 accounts per cron run

### Data Extraction from Tweets

Tweets are short. Typical job tweet: `"Senior Go Engineer at Acme – Remote – $150k – https://…"`

- **Title:** Extract from tweet text (first 80 chars or before URL)
- **Company:** Heuristic (text before "–" or "at")
- **URL:** First https link in `entities.urls`
- **Description:** Tweet text or fetch linked page

### Alternative: Job Board RSS First

Before paying for Twitter API, check if these have RSS:

- golang.cafe (Golang Cafe)
- pythonjobs.com
- remotework.io

RSS is free and often has richer job data than tweets.

---

## References

- [SerpApi Google Jobs API](https://serpapi.com/google-jobs-api)
- [Google JobPosting Schema](https://schema.org/JobPosting)
- [JobsCollider RSS](https://jobscollider.com/remote-jobs-api)
- [Public API Lists – Jobs](https://public-api-lists.github.io/public-api-lists/)
- [PublicAPIs.io Jobs](https://publicapis.io/best/jobs)
- [Careerjet API](https://openpublicapis.com/api/careerjet)
- [Jooble API](https://publicapis.io/jooble-api)
- [Greenhouse Job Boards](https://boards.greenhouse.io/)
- [Lever Job Boards](https://jobs.lever.co/)

---

## Quick Start for Next Implementation

**First task:** Implement RSS fetcher + add 10 RSS feeds (JobsCollider, We Work Remotely, Stack Overflow, Hacker News, Authentic Jobs, Remote.co, etc.). This alone can add 5,000–20,000 jobs with minimal new code.

**Location crawler task:** Start with SerpApi Google Jobs + a seed of 100 cities across 20 countries. One query per city ("software engineer jobs {city}") = 100 SerpApi calls. With free tier (100/mo), run weekly; with paid tier, run daily.

# Jobs, geography, and companies

## Job ingestion

### Fetcher layer

[`frontend/lib/jobs/fetchers/index.ts`](../frontend/lib/jobs/fetchers/index.ts) aggregates **parallel** requests:

| Source key | Implementation | Notes |
|------------|----------------|-------|
| `remotive` | `fetchers/remotive.ts` | Public API |
| `arbeitnow` | `fetchers/arbeitnow.ts` | Public API |
| `adzuna` | `fetchers/adzuna.ts` | Optional `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` |
| `themuse` | `fetchers/themuse.ts` | Optional `THEMUSE_API_KEY` |
| `usajobs` | `fetchers/usajobs.ts` | Optional `USAJOBS_API_KEY` |
| `remoteok` | `fetchers/remoteok.ts` | Scraped/HTTP |
| RSS feeds | `fetchers/rss-batch.ts` | Driven by `jobFeed` documents |
| `greenhouse` | `fetchers/greenhouse.ts` | Board-style scraping; uses `SCRAPE_USER_AGENT` and rate limits |

Normalized rows share the **`NormalizedJob`** shape (`frontend/lib/jobs/types.ts`) before persistence.

### Crawl orchestration

- **Manual trigger**: `POST /api/admin/jobs/crawl` runs the main crawler (`runCrawl` from `lib/jobs/crawler`).
- **Scheduled**: `GET /api/cron/crawl-jobs` runs the same pipeline with `trigger: "cron"` when `Authorization: Bearer <CRON_SECRET>` matches (if `CRON_SECRET` is set).
- **Location-focused**: `GET /api/cron/crawl-jobs-locations` complements location-aware discovery (optional **SerpApi** via `SERPAPI_KEY` in orchestration code paths).

Crawl outcomes are written to Sanity (`jobListing`, `crawlRun`, related updates). Duration limits are raised on crawl routes (`maxDuration`) for serverless hosts.

### Admin surfaces

- **Jobs** dashboard — high-level operations and listing management.
- **Crawls** — session/history view.
- **RSS Feeds** / **Sources** — registries for feed URLs and source metadata.

## Geography seeding

[`frontend/lib/geography/seed.ts`](../frontend/lib/geography/seed.ts) implements batch seeding:

1. **Countries** — Based on ISO rows in [`frontend/lib/countries-data.json`](../frontend/lib/countries-data.json); creates/updates `country` documents.
2. **Cities** — Queries **Overpass API** (OpenStreetMap) per country; parses nodes for names, population, coordinates; creates/updates `city` documents.

Skipped territories and edge cases are enumerated in code (e.g. very small or problematic ISO codes).

**API routes**:

- `POST /api/admin/geography/seed` — start or continue seed batches.
- `GET /api/admin/geography/seed-runs` — inspect `geographySeedRun` history.

Supporting modules: [`frontend/lib/geography/overpass.ts`](../frontend/lib/geography/overpass.ts), [`frontend/lib/geography/nominatim.ts`](../frontend/lib/geography/nominatim.ts).

## Company crawling

[`frontend/lib/companies/crawler.ts`](../frontend/lib/companies/crawler.ts) reuses **`fetchAllJobs`**, deduplicates by company, maps job categories to industry enums, and upserts **`company`** documents while appending **`companyCrawlRun`** records for auditing.

**API route**: `POST /api/admin/companies/crawl` (and related CRUD under `/api/admin/companies/`).

## Data relationships (conceptual)

- **`jobListing`** references or embeds source metadata consistent with your schema (check `studio/src/schemaTypes/documents/jobListing.ts`).
- **`place`** links listings to geographic facets where used.
- **`country`** / **`city`** provide stable geography for filters and company location.
- **`company`** aggregates hiring signals from repeated crawl passes.

For field-level detail, open the corresponding file under `studio/src/schemaTypes/documents/`.

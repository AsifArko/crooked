# Content model and Sanity Studio

## Schema entry point

All document and singleton types are registered in [`studio/src/schemaTypes/index.ts`](../studio/src/schemaTypes/index.ts). The same types are expected to exist in the configured dataset; the frontend’s typegen (`npm run typegen` in `frontend`) regenerates TypeScript definitions from queries.

## Document groups

### Site content

- **`settings`** (singleton) — Global site configuration (`siteSettings` id).
- **`sourceCode`** — Sellable or showcase source-code products (used with Stripe on the public site).
- **`docFile`**, **`imageFile`** — File-backed assets / documents for the page builder or downloads, depending on your front-end usage.

### Analytics and telemetry (mostly system-written)

- **`pageView`** — URL, session, IP, user agent, timing, referrer, `recordedAt`.
- **`userEvent`** — Custom interaction events from the client.
- **`systemMetric`** — Server-side snapshots (e.g. cron-driven recording).
- **`performanceMetric`** — Client Web Vitals–style performance data.
- **`errorLog`** — Client or server error reports with severity.
- **`resumeDownload`** — Resume download tracking (if enabled in your flows).

These types are treated as **operational data**; Studio structure surfaces them through dashboards rather than raw document lists (see commented legacy list items in structure for page views / metrics).

### Jobs module

- **`place`** — Geographic anchor for listings (links to job discovery).
- **`jobListing`** — Normalized job documents produced by crawlers.
- **`jobSource`** — Registry of sources (name, slug, status, etc.).
- **`jobFeed`** — RSS/Atom feed definitions tied to crawling.
- **`crawlRun`** — Run metadata, stats, and errors for job crawls.

### Geography and companies

- **`country`** — Country records (ISO-derived seed + Sanity fields).
- **`city`** — City records with geolocation, often populated via Overpass during seed.
- **`company`** — Companies inferred or curated from the ecosystem (linked to industries, locations).
- **`companyCrawlRun`** — Audit trail for company-focused crawls.
- **`geographySeedRun`** — Batch/retry history for country/city seeding from OSM.

## Studio sidebar structure

The visible navigation is defined in [`frontend/sanity/structure.ts`](../frontend/sanity/structure.ts):

- Content types: source code, documents, images.
- **Site Settings** singleton.
- **Events** → `SiteAnalyticsDashboard` (includes user downloads and analytics tabs).
- **System Monitoring** → `SystemMonitoringDashboard`.
- **Jobs** → `JobsDashboard`.
- **Crawls** → `CrawlsDashboard`.
- **RSS Feeds** → `RSSFeedsDashboard`.
- **Sources** → `SourcesDashboard`.
- **Countries** → `CountriesDashboard`.
- **Cities** → `CitiesDashboard`.
- **Seed** → `SeedDashboard` (geography seed from OpenStreetMap).
- **Companies** → `CompaniesDashboard`.

Dashboards are **React components** running inside Studio; they call Next.js `/api/admin/*` routes for server work and use Sanity clients where appropriate.

## Plugins and tools

[`frontend/sanity.config.ts`](../frontend/sanity.config.ts) wires the project id, dataset, structure resolver, and presentation tool. Custom tools (e.g. analytics helpers) live under [`frontend/sanity/plugins/`](../frontend/sanity/plugins/).

## Draft mode and preview

Draft/preview behavior follows standard Sanity + Next patterns:

- [`frontend/app/api/draft-mode/enable/route.ts`](../frontend/app/api/draft-mode/enable/route.ts) enables preview when configured.

Ensure preview URLs and CORS settings match your deployment hostname.

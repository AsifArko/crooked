# HTTP API specification

Base URL is the deployed Next.js origin (e.g. `https://example.com`). All routes live under **`/api/`** in the **frontend** app.

Methods and bodies are summarized here; for exact JSON schemas, read the corresponding `route.ts` file.

## Public and semi-public

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/analytics/page-view` | POST | Record a `pageView`. |
| `/api/analytics/event` | POST | Record a `userEvent`. |
| `/api/analytics/performance` | POST | Record `performanceMetric`. |
| `/api/analytics/error` | POST | Record `errorLog`. |
| `/api/analytics/system-metric` | POST | Ingest a system metric (used by tooling/cron; check handler). |
| `/api/contact` | POST | Send contact email (SMTP). |
| `/api/resume` | GET | JSON: resume document from Sanity (`resumeQuery`). |
| `/api/resume/download` | GET | Streams resume PDF and records a `resumeDownload`. |
| `/api/sourcecodes` | GET | JSON: list of `sourceCode` documents for the storefront. |
| `/api/github/contributions` | GET | GitHub contribution data for UI. |
| `/api/github/activity-overview` | GET | GitHub activity summary. |
| `/api/stripe/create-checkout-session` | POST | Create Stripe Checkout session. |
| `/api/studio-auth` | POST | Set HTTP-only cookie after password check (Studio gate). |
| `/api/draft-mode/enable` | GET | Enable Next.js draft mode (`defineEnableDraftMode` from `next-sanity`). |

## Cron (scheduled)

Intended to be called by a scheduler (e.g. Vercel Cron). If `CRON_SECRET` is set, send `Authorization: Bearer <CRON_SECRET>`.

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/cron/crawl-jobs` | GET | Run job crawl (`trigger: "cron"`). |
| `/api/cron/crawl-jobs-locations` | GET | Location-oriented job crawl pass. |
| `/api/cron/record-system-metrics` | GET | Record system metrics snapshot. |

## Admin — analytics

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/analytics/overview` | GET | Dashboard counts / summary. |
| `/api/admin/analytics/page-views` | GET | Page view queries. |
| `/api/admin/analytics/events` | GET | User event queries. |
| `/api/admin/analytics/performance` | GET | Performance metrics queries. |
| `/api/admin/analytics/error-logs` | GET | Error log queries. |
| `/api/admin/analytics/system-metrics` | GET | System metric series. |
| `/api/admin/analytics/system-monitoring` | GET | Composite monitoring feed. |
| `/api/admin/analytics/record-system-metrics-sample` | POST | Writes sample `systemMetric` docs (heap/RSS); verify before production use. |

## Admin — jobs

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/jobs` | GET | Paginated, filterable `jobListing` query for dashboards. |
| `/api/admin/jobs/overview` | GET | Jobs dashboard summary. |
| `/api/admin/jobs/crawl` | POST | Manual job crawl. |
| `/api/admin/jobs/crawls` | GET | Crawl history. |
| `/api/admin/jobs/sources` | GET, POST | Job sources registry. |
| `/api/admin/jobs/sources/[id]` | GET, PATCH, DELETE | Single source. |
| `/api/admin/jobs/feeds` | GET, POST | RSS/Atom feed registry. |
| `/api/admin/jobs/feeds/[id]` | GET, PATCH, DELETE | Single feed. |

## Admin — crawls (generic)

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/crawls` | GET | Aggregated crawl session data for dashboards. |

## Admin — downloads

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/downloads` | GET | Download / resume download admin data. |
| `/api/admin/downloads/overview` | GET | Summary for dashboards. |

## Admin — geography

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/geography/seed` | POST | Start or continue geography seed. |
| `/api/admin/geography/seed-runs` | GET | List `geographySeedRun` history. |

## Admin — countries, cities, companies

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/admin/countries` | GET, POST | Countries list/create. |
| `/api/admin/countries/[id]` | GET, PATCH, DELETE | Single country. |
| `/api/admin/cities` | GET, POST | Cities list/create. |
| `/api/admin/cities/[id]` | GET, PATCH, DELETE | Single city. |
| `/api/admin/cities/stats` | GET | City/country statistics for dashboards. |
| `/api/admin/companies` | GET, POST | Companies list/create. |
| `/api/admin/companies/[id]` | GET, PATCH, DELETE | Single company. |
| `/api/admin/companies/crawl` | POST | Run company derivation crawl. |
| `/api/admin/companies/crawls` | GET | Company crawl run history. |

## Auth and security notes

- **Cron routes** use optional bearer token (`CRON_SECRET`).
- **Studio** access uses middleware + `SANITY_STUDIO_ACCESS_SECRET` + `/api/studio-auth` cookie flow when configured.
- **Most `/api/admin/*` routes** do not implement application-level bearer auth in a shared helper; they rely on same-site usage from password-protected Studio and network isolation. If you expose the site to untrusted networks, add an auth layer (e.g. shared secret header or session) before production.

## Versioning

There is no `/v1` prefix; breaking changes require coordinated updates to dashboards and clients.

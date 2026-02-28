# Jobs Module – Overview & Architecture

## Purpose

Add a **Jobs** module to the Crooked admin CMS (at `/cms-a8f3k2x9/` or `/studio`) that:

1. **Crawls** software engineer jobs from around the world using **free public APIs only**
2. **Maps the world** by cities, districts, regions, and countries using **OpenStreetMap** data
3. **Filters** jobs by geography (country, region, city), job type, remote/hybrid, and more
4. **Stores** jobs and geography in Sanity, with internal schemas extending OpenStreetMap structures

**Core principles:**
- **Real data only** – no mock, dummy, or fake data
- **Free APIs only** – no paid job APIs or premium geocoding services
- **OpenStreetMap** – world geography from OSM (Nominatim, Overpass API)
- **Robust & production-ready** – rate limiting, deduplication, error handling, attribution

---

## Current Architecture Context

- **Frontend:** Next.js (App Router) at `/`
- **Admin CMS:** Sanity Studio at `/studio` (or obscure path e.g. `/cms-a8f3k2x9/`)
- **Data:** Sanity CMS (content + analytics documents)
- **Existing modules:** Site Analytics, System Monitoring, User Downloads (custom dashboards in structure)

---

## Jobs Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JOBS MODULE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐      │
│  │  FREE JOB APIs   │    │  OPENSTREETMAP   │    │  SANITY CMS      │      │
│  │  • Remotive      │    │  • Nominatim     │    │  • jobListing    │      │
│  │  • Arbeitnow     │    │  • Overpass API  │    │  • place         │      │
│  │  • The Muse      │    │                  │    │  • jobSource     │      │
│  │  • Adzuna        │    │  Geography data  │    │  • crawlRun      │      │
│  │  • USAJOBS       │    │  (countries,     │    │                  │      │
│  └────────┬─────────┘    │   cities, etc.) │    └────────▲─────────┘      │
│           │              └────────┬─────────┘             │                 │
│           │                       │                       │                 │
│           ▼                       ▼                       │                 │
│  ┌────────────────────────────────────────────────────────┴──────────────┐ │
│  │                    CRAWLER / INGESTION LAYER                            │ │
│  │  • Cron job or manual trigger                                           │ │
│  │  • Geocode job locations → link to place documents                      │ │
│  │  • Deduplicate by external_id + source                                  │ │
│  │  • Rate limit handling, retries                                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                    JOBS DASHBOARD (Admin CMS)                           ││
│  │  • Filters: country, region, city, remote, job type, date range          ││
│  │  • Map view (optional): jobs by location                                 ││
│  │  • Table: job title, company, location, source, posted date             ││
│  │  • Refresh / manual crawl trigger                                       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

1. **Geography (one-time + incremental):**
   - Seed `place` documents from OpenStreetMap (Overpass API for cities, or Nominatim search)
   - Hierarchy: Country → State/Region → City → District (admin_level-based)
   - Store `osm_type`, `osm_id`, `place_id`, `lat`, `lon`, `display_name`, `address` components

2. **Jobs (periodic crawl):**
   - Fetch from each free job API (Remotive, Arbeitnow, The Muse, Adzuna, USAJOBS)
   - For each job: extract location string → geocode via Nominatim → resolve to `place` ref
   - Create/update `jobListing` in Sanity with `source`, `externalId`, `place` ref
   - Deduplicate: `externalId` + `source` unique

3. **Dashboard:**
   - Query `jobListing` with GROQ filters (place hierarchy, remote, date)
   - Join with `place` for display names and hierarchy

---

## Document Index

| Document | Purpose |
|----------|---------|
| `00-OVERVIEW.md` | This file – architecture and index |
| `01-GEOGRAPHY-SCHEMA.md` | OpenStreetMap integration, place hierarchy, Overpass/Nominatim usage |
| `02-JOB-APIS.md` | Free public job APIs: endpoints, rate limits, response shapes |
| `03-DATA-MODELS.md` | Sanity schemas: `place`, `jobListing`, `jobSource`, `crawlRun` |
| `04-IMPLEMENTATION-PLAN.md` | Phased implementation chunks, API routes, dashboard UI |

---

## Module Structure in Studio

The Jobs module appears in the Sanity structure (left sidebar) as a custom dashboard:

```
Content
├── Source Codes
├── Site Settings
├── ─────────────────
├── Site Analytics
├── System Monitoring
├── User Downloads
├── Jobs                    ← NEW
│   └── Jobs Dashboard (custom React component)
```

---

## Implementation Order

1. **Geography schema & seed** – `place` schema, OSM integration, seed countries/regions/cities
2. **Job APIs integration** – fetch wrappers, rate limits, error handling
3. **Job data models** – `jobListing`, `jobSource`, `crawlRun` schemas
4. **Crawler** – cron job or API route to ingest jobs, geocode, deduplicate
5. **Jobs dashboard** – filters, table, map (optional), refresh trigger

---

## Attribution & Licensing

- **OpenStreetMap:** Data © OpenStreetMap contributors, ODbL 1.0. [https://osm.org/copyright](https://osm.org/copyright)
- **Nominatim:** Use policy: [https://operations.osmfoundation.org/policies/nominatim/](https://operations.osmfoundation.org/policies/nominatim/) – 1 req/sec, respectful usage
- **Job APIs:** Each source has its own attribution requirements (see `02-JOB-APIS.md`)

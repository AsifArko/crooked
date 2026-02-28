# Implementation Plan – Jobs Module

## Purpose

Phased implementation plan for integrating the Jobs module into the Crooked admin CMS. Each phase is broken into chunks that can be implemented incrementally.

---

## Phase 1: Foundation (Geography & Schemas)

### Chunk 1.1 – Sanity Schemas

**Files to create:**
- `studio/src/schemaTypes/documents/place.ts`
- `studio/src/schemaTypes/documents/jobListing.ts`
- `studio/src/schemaTypes/documents/jobSource.ts`
- `studio/src/schemaTypes/documents/crawlRun.ts`

**Steps:**
1. Create each schema file per `03-DATA-MODELS.md`
2. Register in `studio/src/schemaTypes/index.ts`
3. Add `place`, `jobListing`, `jobSource`, `crawlRun` to `DISABLED_TYPES` in structure (hide from document list)
4. Deploy schema: `cd studio && npx sanity schema extract && npx sanity graphql deploy` (if using GraphQL) or just run dev to validate

---

### Chunk 1.2 – Job Source Seed

**Purpose:** Create `jobSource` documents for each API.

**File:** `frontend/app/api/admin/jobs/sources/seed/route.ts` (or script)

**Steps:**
1. Create seed data for Remotive, Arbeitnow, The Muse, Adzuna, USAJOBS
2. Upsert into Sanity (by slug)
3. Call once manually or on first deploy

---

### Chunk 1.3 – Nominatim Geocoding Service

**Purpose:** Geocode location strings and resolve/create `place` documents.

**Files:**
- `frontend/lib/jobs/geocode.ts` – Nominatim client with rate limiting (1 req/sec)
- `frontend/lib/jobs/place-resolver.ts` – Lookup or create `place` from Nominatim result

**Steps:**
1. Implement `geocodeLocation(q: string): Promise<NominatimResult | null>`
2. Implement `resolvePlace(nominatimResult): Promise<placeId>` – lookup by osmType+osmId, create if missing
3. Add User-Agent header (required by Nominatim): `CrookedJobs/1.0 (contact@example.com)`
4. Add 1s delay between requests (or use queue)

---

### Chunk 1.4 – Place Seed (Countries)

**Purpose:** Seed `place` documents for all countries.

**File:** `frontend/app/api/admin/jobs/places/seed/route.ts`

**Steps:**
1. Use existing `countries-data.json` or ISO 3166-1 list
2. For each country: Nominatim search `{country_name}` with `addressdetails=1`
3. Create `place` with `placeType: 'country'`, `adminLevel: 2`
4. Rate limit: 1 req/sec, batch over multiple requests
5. Return count of created/updated places

---

## Phase 2: Job API Integrations

### Chunk 2.1 – Job API Fetchers

**Purpose:** Fetch jobs from each free API and normalize to common shape.

**Files:**
- `frontend/lib/jobs/fetchers/remotive.ts`
- `frontend/lib/jobs/fetchers/arbeitnow.ts`
- `frontend/lib/jobs/fetchers/themuse.ts`
- `frontend/lib/jobs/fetchers/adzuna.ts`
- `frontend/lib/jobs/fetchers/usajobs.ts`
- `frontend/lib/jobs/fetchers/index.ts` – aggregate, `NormalizedJob` type

**Steps:**
1. Implement fetcher for each API (see `02-JOB-APIS.md`)
2. Normalize to `NormalizedJob` shape
3. Handle errors, timeouts (10s), retries (2x)
4. Export `fetchAllJobs(): Promise<NormalizedJob[]>` that runs fetchers in parallel (respect per-API limits)

---

### Chunk 2.2 – Crawler Core

**Purpose:** Ingest jobs into Sanity with geocoding and deduplication.

**Files:**
- `frontend/lib/jobs/crawler.ts`

**Steps:**
1. Create `crawlRun` document with `status: 'running'`
2. Call `fetchAllJobs()`
3. For each job:
   - Check if exists: `*[_type == "jobListing" && externalId == $eid && source._ref == $src][0]`
   - If `locationRaw` and not remote: geocode → resolve place
   - Upsert `jobListing` (create or patch)
4. Update `crawlRun` with stats, `status: 'completed'`
5. On error: set `status: 'failed'`, log to `errorLog`

---

### Chunk 2.3 – Crawl API Route

**Purpose:** Trigger crawl via API (manual or cron).

**File:** `frontend/app/api/admin/jobs/crawl/route.ts`

**Steps:**
1. POST (or GET for cron) – require admin auth (Sanity session or secret)
2. Call crawler
3. Return `{ crawlRunId, status, stats }`
4. For Vercel Cron: add to `vercel.json` cron config, call this route

---

## Phase 3: Jobs Dashboard

### Chunk 3.1 – Jobs API Routes

**Purpose:** Query jobs with filters for the dashboard.

**Files:**
- `frontend/app/api/admin/jobs/route.ts` – list jobs with pagination, filters
- `frontend/app/api/admin/jobs/overview/route.ts` – summary stats (total jobs, by country, by source)
- `frontend/app/api/admin/jobs/places/route.ts` – list places for filter dropdowns

**Query params for jobs:**
- `page`, `limit`
- `countryCode`, `state`, `city`
- `remote` (true/false)
- `source` (slug)
- `dateFrom`, `dateTo`
- `search` (title, company)

**Response shape (jobs):**
```json
{
  "items": [...],
  "total": 1234,
  "page": 1,
  "limit": 20
}
```

---

### Chunk 3.2 – Jobs Dashboard Component

**Purpose:** React dashboard in Sanity structure.

**File:** `frontend/components/admin/JobsDashboard.tsx`

**UI structure:**
- **Header:** Title "Jobs", subtitle, Refresh button (triggers crawl)
- **Filters:** Country, Region, City, Remote, Source, Date range, Search
- **Summary cards:** Total jobs, Jobs today, Top countries, Top sources
- **Table:** Job title, Company, Location, Source, Posted date, Link
- **Pagination:** Page controls

**Steps:**
1. Create component similar to `UserDownloadsDashboard.tsx`
2. Fetch from `/api/admin/jobs`, `/api/admin/jobs/overview`
3. Implement filter dropdowns (country from places, source from jobSource)
4. Add to structure in `frontend/sanity/structure.ts`

---

### Chunk 3.3 – Structure Integration

**Purpose:** Add Jobs to CMS sidebar.

**File:** `frontend/sanity/structure.ts`

**Steps:**
1. Import `JobsDashboard` component
2. Add `S.listItem().title('Jobs').icon(Briefcase).child(S.component(JobsDashboard).title('Jobs'))`
3. Add `Briefcase` from lucide-react (or similar icon)

---

## Phase 4: Enhancements (Optional)

### Chunk 4.1 – Place Seed (Cities)

**Purpose:** Bulk seed major cities via Overpass API.

**File:** `frontend/app/api/admin/jobs/places/seed-cities/route.ts`

**Steps:**
1. Overpass query for `node[place=city]` or `node[place~"city|town"]` per country
2. Create `place` for each, link to country parent
3. Run in batches (e.g. one country per request)

---

### Chunk 4.2 – Map View

**Purpose:** Optional map showing job density by location.

**Steps:**
1. Use Leaflet or Mapbox GL (free tier) with OSM tiles
2. Aggregate jobs by place (lat/lon)
3. Render markers or heatmap
4. Add as tab or section in Jobs dashboard

---

### Chunk 4.3 – Vercel Cron

**Purpose:** Automated daily crawl.

**File:** `vercel.json`

```json
{
  "crons": [{
    "path": "/api/admin/jobs/crawl",
    "schedule": "0 6 * * *"
  }]
}
```

**Steps:**
1. Add cron config
2. Secure route with `CRON_SECRET` header check
3. Cron runs at 6 AM UTC daily

---

## File Structure Summary

```
frontend/
├── app/api/
│   └── admin/jobs/
│       ├── route.ts              # GET jobs (list + filters)
│       ├── overview/route.ts     # GET overview stats
│       ├── crawl/route.ts         # POST trigger crawl
│       └── places/
│           ├── route.ts          # GET places (for filters)
│           └── seed/route.ts      # POST seed countries
├── lib/jobs/
│   ├── geocode.ts
│   ├── place-resolver.ts
│   ├── crawler.ts
│   ├── types.ts
│   └── fetchers/
│       ├── index.ts
│       ├── remotive.ts
│       ├── arbeitnow.ts
│       ├── themuse.ts
│       ├── adzuna.ts
│       └── usajobs.ts
└── components/admin/
    └── JobsDashboard.tsx

studio/
└── src/schemaTypes/documents/
    ├── place.ts
    ├── jobListing.ts
    ├── jobSource.ts
    └── crawlRun.ts
```

---

## Environment Variables

```env
# Optional – for higher limits / more sources
THEMUSE_API_KEY=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
USAJOBS_API_KEY=

# Cron (for automated crawl)
CRON_SECRET=

# Sanity (existing)
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
```

---

## Testing Checklist

- [ ] Place schema validates in Sanity
- [ ] Job source seed creates 5 documents
- [ ] Nominatim geocode returns valid result (respect 1 req/sec)
- [ ] Remotive fetcher returns jobs
- [ ] Arbeitnow fetcher returns jobs
- [ ] Crawler creates jobListing documents
- [ ] Deduplication works (re-crawl doesn't duplicate)
- [ ] Jobs API returns filtered results
- [ ] Dashboard loads and displays jobs
- [ ] Refresh triggers crawl and updates list

---

## Rollout Order

1. **Chunk 1.1** – Schemas (required for everything)
2. **Chunk 1.2** – Job sources seed
3. **Chunk 2.1** – Fetchers (start with Remotive + Arbeitnow – no keys)
4. **Chunk 2.2** – Crawler
5. **Chunk 1.3, 1.4** – Geocoding + place seed (can simplify: skip geocode initially, use `locationRaw` only)
6. **Chunk 2.3** – Crawl API
7. **Chunk 3.1** – Jobs API routes
8. **Chunk 3.2, 3.3** – Dashboard + structure

**Minimal viable:** Skip geocoding initially – store `locationRaw` only, filter by text search. Add place/geocode in Phase 1.4 after basic flow works.

# Free Public Job APIs

## Purpose

Document all **free, public** job APIs used by the Jobs module. No paid APIs. Each source must be real, with live job listings.

**Excluded:** GitHub Jobs API (deprecated August 2021, fully sunset March 2024)

---

## API Summary

| API | Region Focus | Auth | Rate Limit | Software/Dev Jobs |
|-----|--------------|------|------------|--------------------|
| Remotive | Global (remote) | None | Fair use | Yes (category filter) |
| Arbeitnow | Europe + remote | None | Fair use | Yes |
| The Muse | Global | API key (free) | 500–3600/hr | Yes |
| Adzuna | Multi-country | App ID + Key (free) | 250/day, 25/min | Yes |
| USAJOBS | US federal only | API key (free) | Fair use | Yes |

---

## 1. Remotive API

**URL:** `https://remotive.com/api/remote-jobs`

**Auth:** None required

**Method:** GET

**Response:** Array of job objects. Each job includes:
- `id`, `url`, `title`, `company_name`, `category`, `job_type`, `candidate_required_location`, `salary`, `description`, `publication_date`

**Filtering:** Query params `category` (e.g. `software-dev`) for software jobs.

**Attribution:** Must link back to original job URL on Remotive, credit Remotive as source. Listings delayed 24h.

**Example request:**
```
GET https://remotive.com/api/remote-jobs?category=software-dev
```

---

## 2. Arbeitnow API

**URL:** `https://arbeitnow.com/api/job-board-api`

**Auth:** None required

**Method:** GET

**Response:** `{ data: [...] }` – array of job objects. Fields include:
- `slug`, `company_name`, `title`, `description`, `remote`, `url`, `tags`, `job_types`, `location`, `created_at`

**Filtering:** Query params `remote` (boolean), `visa_sponsorship` (boolean).

**Region:** Europe-focused, aggregates from ATS (Greenhouse, SmartRecruiters, etc.).

**Attribution:** Check [Arbeitnow terms](https://www.arbeitnow.com/blog/job-board-api).

---

## 3. The Muse API

**URL:** `https://www.themuse.com/api/public/jobs`

**Auth:** API key (free registration at [themuse.com/developers](https://www.themuse.com/developers/api/v2))

**Method:** GET with `api_key` query param

**Rate limits:**
- Unregistered: 500 requests/hour
- Registered: 3600 requests/hour

**Response:** Paginated. `page`, `page_count`, `results` array. Each job:
- `id`, `name`, `publication_date`, `short_description`, `locations`, `company`, `levels`, `categories`, `refs` (landing_page)

**Filtering:** `category` (e.g. Software Engineering), `level`, `page`, `desc` (sort).

**Example:**
```
GET https://www.themuse.com/api/public/jobs?api_key=YOUR_KEY&category=Software%20Engineering&page=1
```

---

## 4. Adzuna API

**URL:** `https://api.adzuna.com/v1/api/jobs/{country}/search/{page}`

**Auth:** `app_id` and `app_key` (free at [developer.adzuna.com](https://developer.adzuna.com/))

**Countries:** `gb`, `at`, `au`, `br`, `ca`, `de`, `es`, `fr`, `in`, `it`, `mx`, `nl`, `nz`, `pl`, `ru`, `sg`, `za`, `us`

**Rate limits (free tier):**
- 2,500 hits/month
- 1,000 hits/week
- 250 hits/day
- 25 hits/minute

**Query params:** `what` (keywords), `where` (location), `content-type=application/json`

**Response:** `{ results: [...], count }`. Each result: `id`, `title`, `location`, `company`, `description`, `created`, `redirect_url`, `salary_min`, `salary_max`, etc.

**Attribution:** Must display "Jobs by Adzuna" with link to adzuna.co.uk.

**Example:**
```
GET https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=XXX&app_key=YYY&what=software%20engineer
```

---

## 5. USAJOBS API

**URL:** `https://developer.usajobs.gov/api/search`

**Auth:** API key (free at [developer.usajobs.gov](https://developer.usajobs.gov/)). Pass as `Authorization: Bearer YOUR_KEY` or `Host: api.data.gov` + `Authorization-Key`.

**Region:** US federal government jobs only.

**Response:** JSON with `SearchResult` containing `SearchResultItems`. Each item: `MatchedObjectId`, `MatchedObjectDescriptor` (PositionTitle, OrganizationName, PositionLocation, etc.).

**Filtering:** `Keyword` (job title), `LocationName`, `PositionScheduleTypeCode` (full-time, etc.).

**Example:**
```
GET https://developer.usajobs.gov/api/search?Keyword=software%20engineer
Headers: Authorization-Key: YOUR_KEY
```

---

## Normalized Job Shape (Internal)

All APIs return different formats. Normalize to a common shape before storing in Sanity:

```ts
type NormalizedJob = {
  externalId: string;        // source-specific ID
  source: string;            // remotive | arbeitnow | themuse | adzuna | usajobs
  title: string;
  companyName: string;
  description: string;
  url: string;
  locationRaw: string;       // original location string from API
  locationResolved?: string;  // after geocoding
  placeRef?: string;         // Sanity _id of place document
  remote: boolean;
  jobType?: string;          // full-time, part-time, contract, etc.
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  postedAt: string;          // ISO date
  tags?: string[];
  raw?: object;              // original API response for debugging
};
```

---

## Crawler Strategy

1. **Parallel fetch** from each API (respect per-API rate limits)
2. **Normalize** each job to `NormalizedJob`
3. **Deduplicate** by `externalId` + `source` (upsert in Sanity)
4. **Geocode** `locationRaw` via Nominatim (1 req/sec) → create/link `place`
5. **Store** `jobListing` in Sanity with `place` reference

**Crawl frequency:** Daily or twice daily via Vercel Cron. Each API has different freshness.

---

## Environment Variables

```env
# The Muse (optional – higher rate limit with key)
THEMUSE_API_KEY=...

# Adzuna (optional – requires key)
ADZUNA_APP_ID=...
ADZUNA_APP_KEY=...

# USAJOBS (optional – US federal jobs)
USAJOBS_API_KEY=...

# Remotive, Arbeitnow – no keys needed
```

---

## Error Handling

- **Timeout:** 10s per request
- **Retry:** 2 retries with exponential backoff for 5xx
- **Rate limit:** If 429, back off and retry after `Retry-After` or 60s
- **Log:** Store failed fetches in `crawlRun` for debugging

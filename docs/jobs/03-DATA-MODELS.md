# Data Models – Sanity Schemas

## Purpose

Define all Sanity document types for the Jobs module. These extend OpenStreetMap concepts where applicable and integrate with the existing Crooked schema structure.

---

## Database Persistence Policy (Critical)

**Jobs are never deleted.** Once a job is crawled, scraped, or fetched from any source (API, RSS, Google search, scrape), it is stored in Sanity and **remains permanently**.

- **Create:** New jobs are inserted when first seen
- **Update:** Existing jobs (matched by `externalId` + `source`) are updated with fresh data (e.g. `lastCrawledAt`)
- **Never delete:** The crawler must never delete or remove `jobListing` documents, even if a job no longer appears in the source's next crawl

**Rationale:** Jobs may be filled or removed from job boards, but users may still want to see historical listings. The database acts as an ever-growing archive.

**Optional enhancement:** Add `status` field (`active` | `expired` | `filled`) – when a job is not returned in a subsequent crawl, set `status: 'expired'` instead of deleting. Default filter in dashboard: `status == 'active'`. This keeps full history while allowing "active only" views.

---

## Schema Overview

| Type | Purpose |
|------|---------|
| `place` | Geographic location (country, region, city, district) – extends OSM |
| `jobListing` | A single job posting, linked to `place` and `jobSource` |
| `jobSource` | Metadata about each job API (Remotive, Arbeitnow, etc.) |
| `crawlRun` | Log of a crawl execution (start, end, counts, errors) |

---

## 1. `place`

Geographic location from OpenStreetMap. Used for filtering jobs and displaying location hierarchy.

```ts
// studio/src/schemaTypes/documents/place.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'place',
  title: 'Place',
  type: 'document',
  readOnly: true, // System-generated from OSM
  fields: [
    defineField({ name: 'osmType', type: 'string', title: 'OSM Type' }),
    defineField({ name: 'osmId', type: 'string', title: 'OSM ID' }),
    defineField({ name: 'placeId', type: 'number', title: 'Nominatim Place ID' }),
    defineField({ name: 'placeType', type: 'string', title: 'Place Type', options: { list: ['country', 'state', 'city', 'district', 'suburb', 'town', 'village'] } }),
    defineField({ name: 'adminLevel', type: 'number', title: 'Admin Level' }),
    defineField({ name: 'parent', type: 'reference', to: [{ type: 'place' }], title: 'Parent Place' }),
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'displayName', type: 'string', title: 'Display Name' }),
    defineField({ name: 'nameEn', type: 'string', title: 'Name (English)' }),
    defineField({ name: 'lat', type: 'number', title: 'Latitude' }),
    defineField({ name: 'lon', type: 'number', title: 'Longitude' }),
    defineField({ name: 'boundingBox', type: 'array', of: [{ type: 'number' }], title: 'Bounding Box' }),
    defineField({ name: 'countryCode', type: 'string', title: 'Country Code' }),
    defineField({ name: 'country', type: 'string', title: 'Country Name' }),
    defineField({ name: 'state', type: 'string', title: 'State/Region' }),
    defineField({ name: 'stateDistrict', type: 'string', title: 'State District' }),
    defineField({ name: 'city', type: 'string', title: 'City' }),
    defineField({ name: 'district', type: 'string', title: 'District' }),
    defineField({ name: 'postcode', type: 'string', title: 'Postcode' }),
    defineField({ name: 'population', type: 'number', title: 'Population' }),
    defineField({ name: 'importance', type: 'number', title: 'Importance' }),
    defineField({ name: 'lastSyncedAt', type: 'datetime', title: 'Last Synced' }),
  ],
});
```

---

## 2. `jobListing`

A single job posting. Created by the crawler from external APIs.

```ts
// studio/src/schemaTypes/documents/jobListing.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'jobListing',
  title: 'Job Listing',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'externalId', type: 'string', title: 'External ID' }),
    defineField({ name: 'source', type: 'reference', to: [{ type: 'jobSource' }], title: 'Source' }),
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'companyName', type: 'string', title: 'Company Name' }),
    defineField({ name: 'description', type: 'text', title: 'Description' }),
    defineField({ name: 'url', type: 'url', title: 'Job URL' }),
    defineField({ name: 'locationRaw', type: 'string', title: 'Location (Raw)' }),
    defineField({ name: 'place', type: 'reference', to: [{ type: 'place' }], title: 'Place' }),
    defineField({ name: 'remote', type: 'boolean', title: 'Remote', initialValue: false }),
    defineField({ name: 'jobType', type: 'string', title: 'Job Type', options: { list: ['full-time', 'part-time', 'contract', 'internship', 'freelance'] } }),
    defineField({ name: 'salaryMin', type: 'number', title: 'Salary Min' }),
    defineField({ name: 'salaryMax', type: 'number', title: 'Salary Max' }),
    defineField({ name: 'currency', type: 'string', title: 'Currency' }),
    defineField({ name: 'postedAt', type: 'datetime', title: 'Posted At' }),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], title: 'Tags' }),
    defineField({ name: 'lastCrawledAt', type: 'datetime', title: 'Last Crawled At' }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: { list: ['active', 'expired', 'filled'] },
      initialValue: 'active',
    }),
    defineField({ name: 'lastSeenAt', type: 'datetime', title: 'Last Seen At' }),
  ],
});
```

**Unique constraint (application-level):** `externalId` + `source` – enforce in crawler via upsert logic. For scraped jobs without stable IDs, use `url` hash or normalized URL as `externalId`.

---

## 3. `jobSource`

Metadata about each job API. Seed once, update rarely.

```ts
// studio/src/schemaTypes/documents/jobSource.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'jobSource',
  title: 'Job Source',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'string', title: 'Slug', validation: (r) => r.required() }),
    defineField({ name: 'name', type: 'string', title: 'Name' }),
    defineField({ name: 'url', type: 'url', title: 'URL' }),
    defineField({ name: 'attribution', type: 'string', title: 'Attribution Text' }),
    defineField({ name: 'enabled', type: 'boolean', title: 'Enabled', initialValue: true }),
    defineField({ name: 'rateLimitPerMinute', type: 'number', title: 'Rate Limit (per min)' }),
  ],
});
```

**Seed documents:**
- `remotive` – Remotive
- `arbeitnow` – Arbeitnow
- `themuse` – The Muse
- `adzuna` – Adzuna
- `usajobs` – USAJOBS

---

## 4. `crawlRun`

Log of a crawl execution. Useful for debugging and monitoring.

```ts
// studio/src/schemaTypes/documents/crawlRun.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'crawlRun',
  title: 'Crawl Run',
  type: 'document',
  readOnly: true,
  fields: [
    defineField({ name: 'startedAt', type: 'datetime', title: 'Started At' }),
    defineField({ name: 'finishedAt', type: 'datetime', title: 'Finished At' }),
    defineField({ name: 'status', type: 'string', title: 'Status', options: { list: ['running', 'completed', 'failed'] } }),
    defineField({
      name: 'sourceStats',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'source', type: 'string', title: 'Source' },
          { name: 'fetched', type: 'number', title: 'Fetched' },
          { name: 'created', type: 'number', title: 'Created' },
          { name: 'updated', type: 'number', title: 'Updated' },
          { name: 'errors', type: 'number', title: 'Errors' },
        ],
      }],
      title: 'Source Stats',
    }),
    defineField({ name: 'errorLog', type: 'text', title: 'Error Log' }),
  ],
});
```

---

## GROQ Query Examples

### Jobs by country (via place hierarchy)

```groq
*[_type == "jobListing" && place->countryCode == "US"] | order(postedAt desc) [0...50] {
  _id,
  title,
  companyName,
  url,
  locationRaw,
  place->{ name, displayName, country },
  remote,
  postedAt,
  source->name
}
```

### Jobs by region (state)

```groq
*[_type == "jobListing" && place->state == "California"] | order(postedAt desc) [0...50] {
  _id,
  title,
  companyName,
  url,
  locationRaw,
  place->{ name, displayName, country, state },
  remote,
  postedAt,
  source->name
}
```

### Remote jobs only

```groq
*[_type == "jobListing" && remote == true] | order(postedAt desc) [0...50] {
  _id,
  title,
  companyName,
  url,
  locationRaw,
  remote,
  postedAt,
  source->name
}
```

### Count by country

```groq
{
  "counts": *[_type == "jobListing" && defined(place)] {
    "countryCode": place->countryCode,
    "country": place->country
  } | order(countryCode asc)
}
```

---

## Schema Registration

Add to `studio/src/schemaTypes/index.ts`:

```ts
import place from './documents/place'
import jobListing from './documents/jobListing'
import jobSource from './documents/jobSource'
import crawlRun from './documents/crawlRun'

export const schemaTypes = [
  // ... existing
  place,
  jobListing,
  jobSource,
  crawlRun,
]
```

---

## Structure / Visibility

- **place:** Hide from default structure (system-generated)
- **jobListing:** Hide from default structure (system-generated)
- **jobSource:** Optional – show for admin config
- **crawlRun:** Optional – show for admin debugging
- **Jobs dashboard:** Custom React component in structure (like Site Analytics)

---

## Indexes (Performance)

For efficient filtering:

- `jobListing`: index on `place`, `source`, `postedAt`, `remote`
- `place`: index on `countryCode`, `placeType`, `parent`

Sanity automatically indexes common query patterns; ensure GROQ filters use these fields.

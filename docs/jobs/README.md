# Jobs Module – Documentation

This folder contains the comprehensive plan for integrating a **Jobs** module into the Crooked admin CMS at `/cms-a8f3k2x9/` (or `/studio`).

## Quick Links

| Document | Description |
|----------|--------------|
| [00-OVERVIEW.md](./00-OVERVIEW.md) | Architecture, data flow, module structure |
| [01-GEOGRAPHY-SCHEMA.md](./01-GEOGRAPHY-SCHEMA.md) | OpenStreetMap integration, place hierarchy, geocoding |
| [02-JOB-APIS.md](./02-JOB-APIS.md) | Free public job APIs (Remotive, Arbeitnow, The Muse, Adzuna, USAJOBS) |
| [03-DATA-MODELS.md](./03-DATA-MODELS.md) | Sanity schemas: place, jobListing, jobSource, crawlRun |
| [04-IMPLEMENTATION-PLAN.md](./04-IMPLEMENTATION-PLAN.md) | Phased implementation chunks, API routes, dashboard |
| [06-MASSIVE-SOURCE-EXPANSION-SPEC.md](./06-MASSIVE-SOURCE-EXPANSION-SPEC.md) | **Expansion spec** – 100+ sources, RSS feeds, ATS scraping, 100K+ jobs |

## Summary

- **World map:** OpenStreetMap (Nominatim + Overpass API) for countries, regions, cities, districts
- **Job sources:** 5 free APIs – Remotive, Arbeitnow, The Muse, Adzuna, USAJOBS
- **Data:** Stored in Sanity; internal schemas extend OSM structures
- **Dashboard:** Filters by geography, remote, source, date; table + optional map view

## Implementation Order

1. Schemas → Job sources seed → Fetchers → Crawler → Crawl API → Jobs API → Dashboard

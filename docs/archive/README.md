# Crooked Admin Panel – Documentation Index

This folder contains specifications for the analytics and monitoring modules in the Crooked admin panel at `/studio`.

## Documents

| Document | Description |
|----------|-------------|
| [00-OVERVIEW.md](./00-OVERVIEW.md) | Architecture overview, module list, implementation order |
| [01-DATA-INFRASTRUCTURE.md](./01-DATA-INFRASTRUCTURE.md) | Sanity schemas, API routes, client tracking |
| [02-SITE-ANALYTICS-SPEC.md](./02-SITE-ANALYTICS-SPEC.md) | Site Analytics: Overview, Page Views, User Events, System Metrics, Error Logs, Performance |
| [03-SYSTEM-MONITORING-SPEC.md](./03-SYSTEM-MONITORING-SPEC.md) | System Monitoring: KPIs, System Health, Real-time Activity, Traffic Overview, Performance |
| [04-USER-DOWNLOADS-SPEC.md](./04-USER-DOWNLOADS-SPEC.md) | User Downloads: Resume download tracking (count, IP, hostname, date) |
| [05-STUDIO-INTEGRATION-SPEC.md](./05-STUDIO-INTEGRATION-SPEC.md) | Sanity tools, structure, dashboard integration |

## Implementation Order

1. **Data Infrastructure** (01) – Sanity schemas, ingestion APIs
2. **User Downloads** (04) – Simplest; one API + one table
3. **Site Analytics** (02) – Event ingestion + dashboard tabs
4. **System Monitoring** (03) – Aggregates + external APIs
5. **Studio Integration** (05) – Custom tools, structure, auth

## Chunk-Based Implementation

Each spec is split into **implementation chunks** that can be built independently in a single chat/PR:

- **01:** Chunks 1.1 (Sanity schemas), 1.2 (ingestion APIs), 1.3 (resume proxy), 1.4 (client tracking)
- **02:** Chunks 2.1–2.7 (Overview, Page Views, User Events, System Metrics, Error Logs, Performance, Shell)
- **03:** Chunks 3.1–3.6 (KPIs, System Health, Real-time, Traffic, Performance, Shell)
- **04:** Chunks 4.1–4.4 (Proxy API, Client update, Admin UI, Hostname resolution)
- **05:** Chunks 5.1–5.6 (Plugin shell, tools, structure, auth)

Start with 01-DATA-INFRASTRUCTURE Chunk 1.1 (add Sanity schemas), then proceed in order. No Postgres, SQL, or external databases – everything uses Sanity.

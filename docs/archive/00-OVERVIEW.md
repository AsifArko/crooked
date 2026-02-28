# Crooked Admin Panel – Analytics & Monitoring Modules

## Overview

This document provides the master specification for three new modules in the Crooked admin panel at the `/studio` route:

1. **Site Analytics** – Overview, Page View, User Events, System Metrics, Error Logs, Performance
2. **System Monitoring** – Uptime, Active Users, Total Requests, Error Rate, System Health, Realtime Activity, Traffic Overview, Performance Metrics
3. **User Downloads** – Resume download tracking (count, IP, hostname, date, etc.)

**Core principle:** All modules must use **real data** – no dummy, mock, or static constant data.

---

## Current Architecture

- **Frontend:** Next.js (App Router) at `/`
- **Admin:** Sanity Studio embedded at `/studio` via `next-sanity`
- **Data:** Sanity CMS (content only), no application database
- **Hosting:** Vercel
- **Existing analytics:** `@vercel/analytics`, `@vercel/speed-insights`

---

## Data Strategy for Real Integration

**All data lives in Sanity** – no Postgres, SQL, or external databases.

| Data Type | Source | Storage |
|-----------|--------|---------|
| Page views, User events | Client-side tracking + API | Sanity (`pageView`, `userEvent` documents) |
| System metrics (CPU, memory) | Server/runtime (limited on Vercel) | Sanity (`systemMetric`) or Vercel API |
| Error logs | Client + Server error handlers | Sanity (`errorLog`) |
| Performance (Core Web Vitals) | Client `web-vitals` | Sanity (`performanceMetric`) |
| Uptime, requests | Vercel deployment metrics | Vercel API (read-only) |
| User downloads | Resume download API route | Sanity (`resumeDownload`) |

**Required additions:**
- New Sanity document types (schemas) for analytics events
- Tracking API routes that create Sanity documents via `client.create()`
- Client-side tracking scripts
- Resume download proxying through API to capture metadata

---

## Module Structure in Studio

The new modules will appear in the Sanity Studio structure (left sidebar) as separate list items. Each module will be implemented as a **custom Sanity Tool** or **desk structure** that loads a React dashboard consuming data from backend APIs.

```
Content (existing)
├── Source Codes
├── Site Settings
├── ─────────────────
├── Site Analytics      ← NEW
├── System Monitoring   ← NEW
├── User Downloads      ← NEW
```

---

## Implementation Order

Recommended order to minimize dependencies and validate each piece:

1. **Data Infrastructure** – Sanity schemas, base API patterns (see `01-DATA-INFRASTRUCTURE.md`)
2. **User Downloads** – Simplest: single API + Sanity `resumeDownload` schema (see `04-USER-DOWNLOADS-SPEC.md`)
3. **Site Analytics** – Event ingestion + dashboard (see `02-SITE-ANALYTICS-SPEC.md`)
4. **System Monitoring** – Aggregates + external APIs (see `03-SYSTEM-MONITORING-SPEC.md`)
5. **Studio Integration** – Custom tools, structure, auth (see `05-STUDIO-INTEGRATION-SPEC.md`)

---

## Document Index

| Document | Purpose |
|----------|---------|
| `00-OVERVIEW.md` | This file – high-level architecture and index |
| `01-DATA-INFRASTRUCTURE.md` | Sanity schemas, API patterns, environment variables |
| `02-SITE-ANALYTICS-SPEC.md` | Site Analytics module – chunks for each sub-feature |
| `03-SYSTEM-MONITORING-SPEC.md` | System Monitoring module – chunks for each sub-feature |
| `04-USER-DOWNLOADS-SPEC.md` | User Downloads module – resume tracking |
| `05-STUDIO-INTEGRATION-SPEC.md` | Sanity tools, structure, dashboard UI |

---

## Design Reference

The admin UI should follow the reference designs provided:

- **Analytics Dashboard:** Search, filters (date range, event type, severity, metrics), tabs (Overview, Page Views, User Events, System Metrics, Error Logs, Performance, Conversions), metric cards, paginated tables
- **System Monitoring Dashboard:** KPI cards (Uptime, Active Users, Total Requests, Error Rate), System Health (CPU, Memory, Disk), Real-time Activity, Traffic Overview (Page Views, Unique Visitors, Avg Session, Bounce Rate, Top Pages, Device Breakdown, Top Countries), Performance Metrics (Core Web Vitals)
- **User Downloads:** Summary (download count, active tokens, active sessions), search/filter table with Customer, Session, Amount, Created, Status, Renew Token

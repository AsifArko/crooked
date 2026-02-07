# Data Infrastructure Specification

## Purpose

This document defines how analytics and monitoring data is stored and accessed in Crooked. **All data lives in Sanity** – no Postgres, SQL, or external databases. We add new Sanity document types and use the Sanity client + GROQ for reads and writes.

---

## 1. Sanity as the Data Store

- **Storage:** Sanity CMS (same project/dataset as content)
- **Write:** Sanity client with write token (`client.create()` from API routes)
- **Read:** GROQ queries via Sanity client (same client, read token for admin APIs)
- **No SQL, no migrations** – schema changes are code-only

---

## 2. Sanity Schema Types

Add these document types to `studio/src/schemaTypes/`. They will be **system-generated** (created by API routes, not manually in the studio). Optionally hide them from the default structure so they don’t clutter the document list.

### 2.1 `pageView` (Site Analytics – Page View)

```ts
// studio/src/schemaTypes/documents/pageView.ts
defineType({
  name: 'pageView',
  title: 'Page View',
  type: 'document',
  readOnly: true, // System-only
  fields: [
    { name: 'url', type: 'string', title: 'URL' },
    { name: 'sessionId', type: 'string', title: 'Session ID' },
    { name: 'ipAddress', type: 'string', title: 'IP Address' },
    { name: 'hostname', type: 'string', title: 'Hostname' },
    { name: 'userAgent', type: 'string', title: 'User Agent' },
    { name: 'loadTimeMs', type: 'number', title: 'Load Time (ms)' },
    { name: 'referrer', type: 'string', title: 'Referrer' },
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

### 2.2 `userEvent` (Site Analytics – User Events)

```ts
defineType({
  name: 'userEvent',
  title: 'User Event',
  type: 'document',
  readOnly: true,
  fields: [
    { name: 'eventType', type: 'string', title: 'Event Type' },
    { name: 'eventName', type: 'string', title: 'Event Name' },
    { name: 'url', type: 'string', title: 'URL' },
    { name: 'sessionId', type: 'string', title: 'Session ID' },
    { name: 'ipAddress', type: 'string', title: 'IP Address' },
    { name: 'hostname', type: 'string', title: 'Hostname' },
    { name: 'metadata', type: 'object', title: 'Metadata' },
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

### 2.3 `systemMetric` (Site Analytics / System Monitoring)

```ts
defineType({
  name: 'systemMetric',
  title: 'System Metric',
  type: 'document',
  readOnly: true,
  fields: [
    { name: 'metricType', type: 'string', title: 'Metric Type' }, // cpu, memory, disk, etc.
    { name: 'value', type: 'number', title: 'Value' },
    { name: 'unit', type: 'string', title: 'Unit' },
    { name: 'status', type: 'string', title: 'Status' }, // Normal, Warning, Critical
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

### 2.4 `errorLog` (Site Analytics – Error Logs)

```ts
defineType({
  name: 'errorLog',
  title: 'Error Log',
  type: 'document',
  readOnly: true,
  fields: [
    { name: 'errorType', type: 'string', title: 'Error Type' }, // client, server, api
    { name: 'message', type: 'string', title: 'Message' },
    { name: 'severity', type: 'string', title: 'Severity' },
    { name: 'url', type: 'string', title: 'URL' },
    { name: 'ipAddress', type: 'string', title: 'IP Address' },
    { name: 'hostname', type: 'string', title: 'Hostname' },
    { name: 'stackTrace', type: 'text', title: 'Stack Trace' },
    { name: 'status', type: 'string', title: 'Status' }, // Open, Resolved, Ignored
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

### 2.5 `performanceMetric` (Site Analytics / System Monitoring – Performance)

```ts
defineType({
  name: 'performanceMetric',
  title: 'Performance Metric',
  type: 'document',
  readOnly: true,
  fields: [
    { name: 'metric', type: 'string', title: 'Metric' }, // lcp, fid, cls, ttfb, inp
    { name: 'value', type: 'number', title: 'Value' },
    { name: 'url', type: 'string', title: 'URL' },
    { name: 'sessionId', type: 'string', title: 'Session ID' },
    { name: 'ipAddress', type: 'string', title: 'IP Address' },
    { name: 'hostname', type: 'string', title: 'Hostname' },
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

### 2.6 `resumeDownload` (User Downloads)

```ts
defineType({
  name: 'resumeDownload',
  title: 'Resume Download',
  type: 'document',
  readOnly: true,
  fields: [
    { name: 'ipAddress', type: 'string', title: 'IP Address' },
    { name: 'hostname', type: 'string', title: 'Hostname' },
    { name: 'userAgent', type: 'string', title: 'User Agent' },
    { name: 'sessionId', type: 'string', title: 'Session ID' },
    { name: 'referrer', type: 'string', title: 'Referrer' },
    { name: 'recordedAt', type: 'datetime', title: 'Recorded At' },
  ],
})
```

---

## 3. API Route Patterns

### 3.1 Ingestion (Write) Routes

Each route receives payload, creates a Sanity document via `client.create()`, and returns. Use a **write-enabled** Sanity client (token with `create` permission).

| Route | Method | Creates |
|-------|--------|---------|
| `/api/analytics/page-view` | POST | `pageView` |
| `/api/analytics/event` | POST | `userEvent` |
| `/api/analytics/error` | POST | `errorLog` |
| `/api/analytics/performance` | POST | `performanceMetric` |
| `/api/resume/download` | GET | `resumeDownload` + stream/redirect file |

**IP & Hostname capture:** All ingestion routes extract from request headers: `x-forwarded-for` or `x-real-ip` (IP), optional reverse-DNS for hostname. Client-triggered routes (page-view, event, performance, error) get this from the incoming HTTP request; `/api/resume/download` does the same.

**Example – create page view:**
```ts
await client.create({
  _type: 'pageView',
  url: body.url,
  sessionId: body.sessionId,
  ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? 'unknown',
  hostname: hostnameFromIp(ip) ?? null, // optional
  userAgent: body.userAgent,
  loadTimeMs: body.loadTimeMs,
  referrer: body.referrer,
  recordedAt: new Date().toISOString(),
})
```

### 3.2 Query (Read) Routes – Admin Only

Admin routes use GROQ to fetch and optionally aggregate. Same Sanity client (read token is fine for fetch).

| Route | Method | GROQ query target |
|-------|--------|-------------------|
| `/api/admin/analytics/overview` | GET | Aggregate `pageView`, `userEvent`, `errorLog` |
| `/api/admin/analytics/page-views` | GET | `pageView` with pagination |
| `/api/admin/analytics/events` | GET | `userEvent` with pagination |
| `/api/admin/analytics/system-metrics` | GET | `systemMetric` |
| `/api/admin/analytics/error-logs` | GET | `errorLog` with pagination |
| `/api/admin/analytics/performance` | GET | `performanceMetric` |
| `/api/admin/monitoring/*` | GET | Aggregates from above types |
| `/api/admin/downloads` | GET | `resumeDownload` with pagination |

**Example – fetch page views with pagination:**
```ts
const query = `*[_type == "pageView"] | order(recordedAt desc) [$from...$to] { _id, url, sessionId, ipAddress, hostname, userAgent, loadTimeMs, referrer, recordedAt }`
const countQuery = `count(*[_type == "pageView"])`
```

---

## 4. Environment Variables

No extra databases. Only Sanity tokens:

```env
# Existing
SANITY_API_READ_TOKEN="..."   # Read for admin dashboards

# Add for ingestion (API routes that create documents)
SANITY_API_WRITE_TOKEN="..."  # Create permission – use in ingestion routes only
```

You can use one token with both read and write if preferred.

---

## 5. Client-Side Tracking

To capture real page views and events:

1. **Provider/context** – Wrap app in an analytics provider that:
   - Generates and persists `session_id` (e.g., in sessionStorage)
   - Tracks route changes (page views)
   - Exposes `trackEvent(type, name, metadata)` for custom events

2. **Endpoints** – Call `/api/analytics/page-view` and `/api/analytics/event` from client.

3. **Performance** – Use `web-vitals` to capture LCP, FID, CLS, etc., and POST to `/api/analytics/performance`.

4. **Errors** – Use `window.onerror` / `unhandledrejection` to POST to `/api/analytics/error`.

---

## 6. Implementation Chunks (Summary)

| Chunk | Description |
|-------|-------------|
| **1.1** | Add Sanity schemas: `pageView`, `userEvent`, `systemMetric`, `errorLog`, `performanceMetric`, `resumeDownload` – register in schema index, optionally hide from structure |
| **1.2** | Create ingestion routes: `page-view`, `event`, `error`, `performance` (use write token) |
| **1.3** | Create `/api/resume/download` – create `resumeDownload` doc + stream/redirect file |
| **1.4** | Add client-side tracking provider and hooks |

No SQL, no migrations, no Postgres – only Sanity schemas and API routes.

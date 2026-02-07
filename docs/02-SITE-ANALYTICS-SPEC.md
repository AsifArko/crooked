# Site Analytics Module Specification

## Purpose

Define the Site Analytics module for the Crooked admin panel: Overview, Page View, User Events, System Metrics, Error Logs, and Performance. All data must be **real**, sourced from Sanity documents and GROQ queries.

---

## Module Structure

Site Analytics appears as a single entry in the studio sidebar. Clicking it opens a dashboard with:

- **Header:** Title, subtitle, search, filters, Refresh button
- **Tabs:** Overview | Page Views | User Events | System Metrics | Error Logs | Performance
- **Content:** Tab-specific cards and tables

---

## Global Controls (All Tabs)

| Control | Type | Description |
|---------|------|-------------|
| Search | Input | Full-text search across relevant fields |
| Date range | Dropdown | e.g., Last 7 days, Last 30 days, Custom |
| Event type | Dropdown | All Events, or filter by type |
| Severity | Dropdown | All Severities, or filter (for Error Logs) |
| Metrics | Dropdown | All Metrics, or filter (for System Metrics) |
| Refresh | Button | Re-fetch data |

---

## Implementation Chunks

### Chunk 2.1 – Overview Tab

**Data source:** `GET /api/admin/analytics/overview`

**Response shape:**
```json
{
  "totalPageViews": 3639,
  "pageViewsChange": 20.1,
  "activeUsers": 41,
  "activeUsersNote": "Unique sessions today",
  "systemHealth": 0,
  "systemHealthNote": "Critical/High errors",
  "conversions": 0,
  "conversionsNote": "Total conversions"
}
```

**UI:**
- Four metric cards: Total Page Views, Active Users, System Health, Conversions
- Each card: value, optional change %, icon, subtitle

**Implementation steps:**
1. Implement `/api/admin/analytics/overview` (aggregate from `page_views`, `user_events`, `error_logs`)
2. Create Overview tab component consuming this API

---

### Chunk 2.2 – Page Views Tab

**Data source:** `GET /api/admin/analytics/page-views?page=1&limit=20&search=&dateFrom=&dateTo=`

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "url": "https://example.com/",
      "sessionId": "session_xxx",
      "timestamp": "2025-08-31T10:21:31Z",
      "loadTime": 0,
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "total": 728,
  "page": 1,
  "limit": 20
}
```

**UI:**
- Section title: "Page Views", subtitle: "Track user page navigation and engagement"
- Table columns: URL, Session ID, Timestamp, Load Time, User Agent
- Pagination: "Page 1 of N", Previous/Next

**Implementation steps:**
1. Implement `/api/admin/analytics/page-views` with pagination and filters
2. Create Page Views tab component with table and pagination

---

### Chunk 2.3 – User Events Tab

**Data source:** `GET /api/admin/analytics/events?page=1&limit=20&search=&eventType=&dateFrom=&dateTo=`

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "eventType": "button_click",
      "eventName": "form_submit",
      "url": "/studio/...",
      "sessionId": "session_xxx",
      "timestamp": "2025-08-18T02:04:26Z"
    }
  ],
  "total": 47,
  "page": 1,
  "limit": 20
}
```

**UI:**
- Section title: "User Events", subtitle: "Monitor user interactions and behavior patterns"
- Table columns: Event Type (tag), Event Name, URL, Session ID, Timestamp
- Pagination

**Implementation steps:**
1. Implement `/api/admin/analytics/events`
2. Create User Events tab component

---

### Chunk 2.4 – System Metrics Tab

**Data source:** `GET /api/admin/analytics/system-metrics?page=1&limit=20&metricType=&status=&dateFrom=&dateTo=`

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "metricType": "memory",
      "value": 88.74,
      "unit": "percentage",
      "status": "Critical",
      "timestamp": "2025-08-19T00:00:30Z"
    }
  ],
  "total": 1248,
  "page": 1,
  "limit": 20
}
```

**UI:**
- Section title: "System Metrics", subtitle: "Monitor server performance and resource utilization"
- Table columns: Metric Type, Value, Unit, Status (badge: Normal/Warning/Critical), Timestamp
- Pagination

**Note:** If server-side CPU/memory is unavailable on Vercel, consider:
- Fetching from Vercel deployment/function metrics API, or
- Synthetic checks via cron that write to `system_metrics` table

**Implementation steps:**
1. Implement data source (Sanity `systemMetric` or Vercel API)
2. Implement `/api/admin/analytics/system-metrics`
3. Create System Metrics tab component

---

### Chunk 2.5 – Error Logs Tab

**Data source:** `GET /api/admin/analytics/error-logs?page=1&limit=20&search=&severity=&status=&dateFrom=&dateTo=`

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "errorType": "server",
      "message": "Failed to track analytics event",
      "severity": "low",
      "url": "http://localhost:3000/api/analytics/track",
      "timestamp": "2025-08-18T14:38:01Z",
      "status": "Open"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

**UI:**
- Section title: "Error Logs", subtitle: "Track and monitor application errors and issues"
- Table columns: Error Type (tag), Message, Severity, URL, Timestamp, Status (badge)
- Pagination

**Implementation steps:**
1. Implement `/api/admin/analytics/error-logs`
2. Create Error Logs tab component

---

### Chunk 2.6 – Performance Tab

**Data source:** `GET /api/admin/analytics/performance?page=1&limit=20&metric=&url=&dateFrom=&dateTo=`

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "metric": "lcp",
      "value": 0,
      "url": "https://example.com/",
      "sessionId": "session_xxx",
      "timestamp": "2025-08-31T10:21:32Z"
    }
  ],
  "total": 265,
  "page": 1,
  "limit": 20
}
```

**UI:**
- Section title: "Performance Metrics", subtitle: "Core Web Vitals and performance indicators"
- Table columns: Metric, Value, URL, Session ID, Timestamp
- Pagination

**Implementation steps:**
1. Implement `/api/admin/analytics/performance`
2. Create Performance tab component

---

### Chunk 2.7 – Site Analytics Dashboard Shell

**Purpose:** Compose all tabs into a single dashboard and wire to the Site Analytics studio tool.

**Components:**
- `SiteAnalyticsDashboard` – container with header, global controls, tabs
- Tab components from Chunks 2.1–2.6
- Shared table, pagination, and filter components

**Implementation steps:**
1. Create shared `AnalyticsFilters`, `DataTable`, `Pagination` components
2. Assemble `SiteAnalyticsDashboard` with all tabs
3. Register as Sanity tool (see `05-STUDIO-INTEGRATION-SPEC.md`)

---

## Chunk Summary

| Chunk | Scope | Depends On |
|-------|-------|------------|
| 2.1 | Overview Tab | 01-DATA-INFRASTRUCTURE (schemas, ingestion) |
| 2.2 | Page Views Tab | 01-DATA-INFRASTRUCTURE |
| 2.3 | User Events Tab | 01-DATA-INFRASTRUCTURE |
| 2.4 | System Metrics Tab | 01-DATA-INFRASTRUCTURE |
| 2.5 | Error Logs Tab | 01-DATA-INFRASTRUCTURE |
| 2.6 | Performance Tab | 01-DATA-INFRASTRUCTURE |
| 2.7 | Dashboard Shell + Tabs | 2.1–2.6 |

Implement chunks 2.1–2.6 in any order; 2.7 combines them.

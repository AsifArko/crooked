# System Monitoring Module Specification

## Purpose

Define the System Monitoring module for the Crooked admin panel. It provides real-time system health, traffic analytics, and performance metrics. All data must be **real**.

---

## Module Structure

System Monitoring appears as a separate entry in the studio sidebar. Clicking it opens a **Monitoring Dashboard** with:

- **Header:** Title, subtitle, Refresh button
- **KPIs:** Uptime, Active Users, Total Requests, Error Rate
- **Sections:** System Health, Real-time Activity, Traffic Overview, Performance Metrics

---

## Implementation Chunks

### Chunk 3.1 – KPI Cards (Top Row)

**Data source:** `GET /api/admin/monitoring/kpis`

**Response shape:**
```json
{
  "uptime": 99.86,
  "uptimeTrend": "up",
  "activeUsers": 0,
  "totalRequests": 0,
  "errorRate": 0
}
```

**UI:**
- Four cards: Uptime (%), Active Users, Total Requests, Error Rate (%)
- Each: value, optional trend icon, color (green/yellow/red based on health)

**Data sourcing:**
- **Uptime:** Vercel deployment status API or synthetic uptime checks
- **Active Users:** Count distinct sessions in last N minutes (from `page_views` or `user_events`)
- **Total Requests:** Vercel Analytics or function invocation counts
- **Error Rate:** Count errors in last period / total requests

**Implementation steps:**
1. Implement `/api/admin/monitoring/kpis`
2. Create KPI card component

---

### Chunk 3.2 – System Health Section

**Data source:** `GET /api/admin/monitoring/system-health`

**Response shape:**
```json
{
  "cpu": { "value": 0, "unit": "percentage", "status": "Good" },
  "memory": { "value": 0, "unit": "percentage", "status": "Good" },
  "disk": { "value": 0, "unit": "percentage", "status": "Good" }
}
```

**UI:**
- Section title: "System Health" (with icon)
- Three bars/cards: CPU Usage, Memory Usage, Disk Usage
- Each: value %, Status badge (Good/Warning/Critical)

**Note:** On Vercel serverless, CPU/memory are not directly exposed. Options:
- Use Vercel Functions metrics if available
- Integrate with external APM (Datadog, New Relic)
- Synthetic checks via cron that run a lightweight script and log results

**Implementation steps:**
1. Define data source (Vercel API or synthetic checks)
2. Implement `/api/admin/monitoring/system-health`
3. Create System Health section component

---

### Chunk 3.3 – Real-time Activity Section

**Data source:** `GET /api/admin/monitoring/realtime`

**Response shape:**
```json
{
  "activeUsers": 0,
  "activeUsersLevel": "Low",
  "period": "Last 5 minutes",
  "pageViews": 0,
  "userEvents": 0,
  "isLive": true
}
```

**UI:**
- Section title: "Real-time Activity"
- Active Users: value + level (Low/Medium/High)
- Recent Activity: Page Views, User Events (last 5 minutes)
- "Live Data" indicator (green dot)

**Data sourcing:** Aggregate from `page_views` and `user_events` where `created_at` is within last 5 minutes.

**Implementation steps:**
1. Implement `/api/admin/monitoring/realtime`
2. Create Real-time Activity section component
3. Optional: polling or WebSocket for live updates

---

### Chunk 3.4 – Traffic Overview Section

**Data source:** `GET /api/admin/monitoring/traffic`

**Response shape:**
```json
{
  "pageViews": 0,
  "uniqueVisitors": 0,
  "avgSessionSeconds": 0,
  "bounceRate": 0,
  "topPages": [],
  "deviceBreakdown": [],
  "topCountries": []
}
```

**UI:**
- Section title: "Traffic Overview"
- Four metric cards: Page Views, Unique Visitors, Avg Session (e.g. 0m 0s), Bounce Rate (%)
- Sub-sections: Top Pages, Device Breakdown, Top Countries (tables or lists)

**Data sourcing:** Aggregate from `page_views` and `user_events`; parse `user_agent` for device; use IP geolocation for countries (optional, may require external service).

**Implementation steps:**
1. Implement `/api/admin/monitoring/traffic` with date range param
2. Create Traffic Overview section with cards and sub-sections

---

### Chunk 3.5 – Performance Metrics Section

**Data source:** `GET /api/admin/monitoring/performance`

**Response shape:**
```json
{
  "coreWebVitals": {
    "lcp": { "value": 0, "unit": "ms", "rating": "Good" },
    "fid": { "value": 0, "unit": "ms", "rating": "Good" },
    "cls": { "value": 0, "unit": "", "rating": "Good" }
  }
}
```

**UI:**
- Section title: "Performance Metrics"
- Sub-title: "Core Web Vitals"
- Cards for: Largest Contentful Paint, First Input Delay, Cumulative Layout Shift
- Each: value, unit, rating badge (Good/Needs Improvement/Poor)

**Data sourcing:** Aggregate from `performance_metrics` table or Vercel Speed Insights API if available.

**Implementation steps:**
1. Implement `/api/admin/monitoring/performance`
2. Create Performance Metrics section component

---

### Chunk 3.6 – System Monitoring Dashboard Shell

**Purpose:** Compose all sections into the Monitoring Dashboard.

**Components:**
- `SystemMonitoringDashboard` – container with header, Refresh button
- Sections: KPIs, System Health, Real-time Activity, Traffic Overview, Performance Metrics

**Implementation steps:**
1. Assemble `SystemMonitoringDashboard` using Chunks 3.1–3.5
2. Register as Sanity tool (see `05-STUDIO-INTEGRATION-SPEC.md`)

---

## Chunk Summary

| Chunk | Scope | Depends On |
|-------|-------|------------|
| 3.1 | KPI Cards | 01-DATA-INFRASTRUCTURE, possibly Vercel API |
| 3.2 | System Health | 01-DATA-INFRASTRUCTURE or external APM |
| 3.3 | Real-time Activity | 01-DATA-INFRASTRUCTURE |
| 3.4 | Traffic Overview | 01-DATA-INFRASTRUCTURE |
| 3.5 | Performance Metrics | 01-DATA-INFRASTRUCTURE, `performance_metrics` |
| 3.6 | Dashboard Shell | 3.1–3.5 |

Implement 3.1–3.5 in any order; 3.6 combines them.

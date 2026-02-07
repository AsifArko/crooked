# Studio Integration Specification

## Purpose

Define how the Site Analytics, System Monitoring, and User Downloads modules are integrated into the Sanity Studio at `/studio`. This covers custom tools, structure, and auth.

---

## Sanity Custom Tools

Sanity allows custom tools via `definePlugin` with a `tool` definition. Each module will be a separate custom tool.

### Tool Definition Pattern

```ts
import { definePlugin } from 'sanity'

export const siteAnalyticsTool = definePlugin({
  name: 'site-analytics',
  tools: (prev) => [
    ...prev,
    {
      name: 'site-analytics',
      title: 'Site Analytics',
      icon: () => '📊', // or use @sanity/icons
      component: lazy(() => import('./SiteAnalyticsDashboard')),
    },
  ],
})
```

Repeat for `system-monitoring` and `user-downloads`.

---

## Structure Integration

Update `studio/src/structure/index.ts` to add list items that open the custom tools.

**Option A: Tool-only** – Tools are available via the top toolbar. No structure changes needed if tools are sufficient.

**Option B: Structure + Tools** – Add list items that navigate to tools:

```ts
S.listItem()
  .title('Site Analytics')
  .child(S.component(SiteAnalyticsDashboard).schemaType('site-analytics'))
  .icon(ChartIcon)
```

Note: Sanity structure typically shows document types. For dashboard tools, the common approach is to add them as **tools** in the plugin config, which appear in the top nav or in a tools dropdown. The structure is used for document-centric navigation.

**Recommended:** Add three custom tools to the Sanity config. They appear in the studio toolbar. If a left-sidebar entry is desired, we can add `S.listItem()` entries that render a React component (custom view) rather than a document.

---

## Implementation Chunks

### Chunk 5.1 – Custom Tool Plugin Shell

**Purpose:** Create the plugin infrastructure for custom tools.

**Files:**
- `studio/src/plugins/siteAnalytics/index.ts` – plugin definition
- `studio/src/plugins/systemMonitoring/index.ts`
- `studio/src/plugins/userDownloads/index.ts`

**Steps:**
1. Create plugin files that register tools with `component` pointing to dashboard React components
2. Add plugins to `sanity.config.ts`
3. Create placeholder dashboard components that render "Coming soon" or fetch from APIs

---

### Chunk 5.2 – Site Analytics Tool

**Purpose:** Register and render the Site Analytics dashboard inside the studio.

**Steps:**
1. Create `studio/src/tools/SiteAnalyticsDashboard.tsx`
2. Component fetches from `/api/admin/analytics/*` (same origin as Next.js app)
3. Include tabs, filters, tables as per `02-SITE-ANALYTICS-SPEC.md`
4. Register in site analytics plugin

**Note:** The studio is served from the Next.js app at `/studio`. API routes are under the same origin, so fetch to `/api/admin/...` works. Ensure CORS/cookie handling if needed.

---

### Chunk 5.3 – System Monitoring Tool

**Purpose:** Register and render the System Monitoring dashboard.

**Steps:**
1. Create `studio/src/tools/SystemMonitoringDashboard.tsx`
2. Component fetches from `/api/admin/monitoring/*`
3. Include KPIs, System Health, Real-time Activity, Traffic Overview, Performance
4. Register in system monitoring plugin

---

### Chunk 5.4 – User Downloads Tool

**Purpose:** Register and render the User Downloads dashboard.

**Steps:**
1. Create `studio/src/tools/UserDownloadsDashboard.tsx`
2. Component fetches from `/api/admin/downloads`
3. Include summary, table, pagination, filters
4. Register in user downloads plugin

---

### Chunk 5.5 – Structure Sidebar Entries

**Purpose:** Add clickable entries in the left sidebar for each module.

**Approach:** Use `S.listItem().child(S.component(MyDashboard))` to render a React component as the child view. When user clicks "Site Analytics" in the list, they see the dashboard instead of a document list.

**Steps:**
1. Update `structure/index.ts` to add three list items
2. Each list item has `.child(S.component(DashboardComponent))`
3. Ensure components are imported/registered

**Reference structure:**

```ts
S.listItem()
  .title('Site Analytics')
  .child(S.component(SiteAnalyticsDashboard).schemaType('site-analytics'))
  .icon(ChartBarIcon)
```

---

### Chunk 5.6 – Admin API Authentication

**Purpose:** Protect `/api/admin/*` routes so only authenticated studio users can access them.

**Options:**
1. **Same-origin:** Studio runs at `/studio` on same domain; ensure admin routes check for valid Sanity session/cookie
2. **Token:** Require `Authorization: Bearer <token>` header; token stored in env, passed by dashboard
3. **Session:** Use NextAuth or similar; studio users must be logged in

**Recommended:** Use Sanity's auth. When user is in studio, they have a session. The Next.js app can verify this via Sanity API or a shared secret. Simpler approach: restrict admin APIs to same-origin requests and optionally require a shared `ADMIN_API_SECRET` header for server-to-server calls.

**Implementation steps:**
1. Add middleware or route-level check for `/api/admin/*`
2. Verify request origin or auth header
3. Return 401 if unauthorized

---

## Chunk Summary

| Chunk | Scope | Depends On |
|-------|-------|------------|
| 5.1 | Plugin shell for all three tools | - |
| 5.2 | Site Analytics tool + dashboard | 02-SITE-ANALYTICS-SPEC |
| 5.3 | System Monitoring tool + dashboard | 03-SYSTEM-MONITORING-SPEC |
| 5.4 | User Downloads tool + dashboard | 04-USER-DOWNLOADS-SPEC |
| 5.5 | Structure sidebar entries | 5.2, 5.3, 5.4 |
| 5.6 | Admin API auth | 01-DATA-INFRASTRUCTURE |

---

## File Layout (Proposed)

```
studio/
  src/
    plugins/
      siteAnalytics/
        index.ts
      systemMonitoring/
        index.ts
      userDownloads/
        index.ts
    tools/
      SiteAnalyticsDashboard.tsx
      SystemMonitoringDashboard.tsx
      UserDownloadsDashboard.tsx
    structure/
      index.ts  (updated)
```

Dashboard components may alternatively live in `frontend` if they need to share UI with the Next.js app; the studio would then embed an iframe or fetch the rendered HTML. Simpler approach: keep dashboards in `studio` and have them call Next.js API routes.

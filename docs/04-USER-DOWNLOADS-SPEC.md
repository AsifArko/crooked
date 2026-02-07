# User Downloads Module Specification

## Purpose

Track resume downloads on the Crooked site. Admins see: how many times the resume was downloaded, and for each download: IP, hostname, date/time, and related metadata. All data must be **real**.

---

## Current Resume Flow

Today:
1. Client fetches resume URL from `/api/resume`
2. Client downloads file directly from Sanity CDN URL (no tracking)

To enable tracking, downloads must go through a proxy API that logs each download.

---

## Data Model

**Sanity document type:** `resumeDownload` (see `01-DATA-INFRASTRUCTURE.md`)

| Field | Type | Description |
|-------|------|-------------|
| ipAddress | string | Client IP (from `x-forwarded-for` or `x-real-ip` or `req.socket.remoteAddress`) |
| hostname | string | Reverse DNS lookup of IP (optional) |
| userAgent | string | Browser/device string |
| sessionId | string | Optional, if client sends it |
| referrer | string | Referrer header |
| recordedAt | datetime | Download timestamp |

---

## Implementation Chunks

### Chunk 4.1 – Resume Download Proxy API

**Purpose:** Intercept resume downloads and log each one.

**New route:** `GET /api/resume/download`

**Behavior:**
1. Resolve resume file URL (from Sanity, same logic as `/api/resume`)
2. If no resume, return 404
3. Log download to `resume_downloads`:
   - `ip_address` from request headers
   - `user_agent` from request headers
   - `referrer` from request headers
   - `created_at` = now
   - `hostname` (optional): async reverse DNS; can be filled later by a job or skipped initially
4. Stream the file to the client (redirect to Sanity URL or proxy the binary)

**Headers to capture:**
- `x-forwarded-for` or `x-real-ip` (Vercel) for IP
- `user-agent`
- `referer`

**Implementation steps:**
1. Create `GET /api/resume/download` route
2. Create Sanity `resumeDownload` document via `client.create()` before streaming/redirect
3. Optionally add background job for hostname resolution (Chunk 4.4)

---

### Chunk 4.2 – Update Client to Use Proxy

**Purpose:** Ensure all resume downloads go through the tracking API.

**Changes:**
- In `ContactInfo.tsx` and `Hero.tsx`: replace direct fetch of `resumeUrl` with navigation to `/api/resume/download` or fetch + trigger download from that URL.
- Example: `window.location.href = '/api/resume/download'` or fetch with `response.blob()` and trigger download client-side.

**Implementation steps:**
1. Update `downloadResume` in `ContactInfo.tsx` to use `/api/resume/download`
2. Update `downloadResume` in `Hero.tsx` similarly

---

### Chunk 4.3 – Admin API and UI

**Data source:** `GET /api/admin/downloads?page=1&limit=20&search=&status=&dateFrom=&dateTo=`

**Query params:**
- `search`: filter by IP or session ID (if we add email/session later)
- `dateFrom`, `dateTo`: filter by `created_at`
- `page`, `limit`: pagination

**Response shape:**
```json
{
  "items": [
    {
      "id": "uuid",
      "ipAddress": "203.0.113.42",
      "hostname": "customer-isp.example.com",
      "userAgent": "Mozilla/5.0...",
      "referrer": "https://example.com/contact",
      "createdAt": "2026-02-07T11:43:30Z"
    }
  ],
  "total": 140,
  "page": 1,
  "limit": 20,
  "summary": {
    "totalDownloads": 140,
    "activeTokens": 0,
    "activeSessions": 0
  }
}
```

**Note:** `activeTokens` and `activeSessions` may not apply to resume downloads (they were in the reference for a different product). For resume tracking, `totalDownloads` is the main metric. The others can be 0 or omitted.

**UI:**
- Title: "User Downloads"
- Subtitle: "Resume download tracking"
- Summary: "N downloads"
- Search: "Search by IP or session ID..."
- Filters: Date range, optional status (if we add status)
- Table columns: IP Address, Hostname, User Agent (truncated), Referrer, Created
- Pagination: "Showing 1 to N of M results", page numbers

**Implementation steps:**
1. Implement `GET /api/admin/downloads` with pagination and filters
2. Create User Downloads dashboard component with table and pagination

---

### Chunk 4.4 – Hostname Resolution (Optional)

**Purpose:** Populate `hostname` via reverse DNS for existing and new download records.

**Options:**
1. **Sync:** On each download, perform reverse DNS before responding (adds latency)
2. **Async job:** Cron job that batches unresolved IPs and updates `hostname`
3. **Skip:** Omit hostname initially; add later if needed

**Implementation steps (if doing async):**
1. Add cron route or Vercel cron: `/api/cron/resolve-download-hostnames`
2. Fetch `resumeDownload` docs where `hostname` is empty via GROQ, batch reverse DNS, patch documents

---

## Chunk Summary

| Chunk | Scope | Depends On |
|-------|-------|------------|
| 4.1 | Resume download proxy + Sanity `resumeDownload` creation | 01-DATA-INFRASTRUCTURE |
| 4.2 | Client uses proxy | 4.1 |
| 4.3 | Admin API + User Downloads dashboard | 01-DATA-INFRASTRUCTURE |
| 4.4 | Hostname resolution (optional) | 4.1 |

**Recommended order:** 4.1 → 4.2 → 4.3. Implement 4.4 only if hostname is required.

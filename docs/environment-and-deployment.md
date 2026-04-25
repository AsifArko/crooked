# Environment and deployment

## Frontend (`frontend/.env.example`)

### Sanity (required for most features)

| Variable | Role |
|----------|------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Project id (browser + server). |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API version string. |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Deployed Studio URL when applicable. |
| `SANITY_API_READ_TOKEN` | Token for server-side reads (and preview). |
| `SANITY_API_WRITE_TOKEN` | Preferred token for creates/updates; falls back to read token. |

### Studio path and gate

| Variable | Role |
|----------|------|
| `SANITY_STUDIO_PATH` | Server-side path hint (optional). |
| `NEXT_PUBLIC_SANITY_STUDIO_PATH` | If set to a value other than `studio`, hides `/studio` and serves Studio at `/<value>`. Must be public for middleware. |
| `SANITY_STUDIO_ACCESS_SECRET` | If set, users must POST password to `/api/studio-auth` to receive `studio_access` cookie. |

### Cron

| Variable | Role |
|----------|------|
| `CRON_SECRET` | If set, cron routes require `Authorization: Bearer <CRON_SECRET>`. |

### Jobs and scraping

| Variable | Role |
|----------|------|
| `THEMUSE_API_KEY` | The Muse API. |
| `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` | Adzuna. |
| `USAJOBS_API_KEY` | USAJOBS. |
| `SERPAPI_KEY` | SerpApi for location-aware flows. |
| `SCRAPE_USER_AGENT`, `SCRAPE_RATE_LIMIT_MS` | Polite scraping defaults for RSS/Greenhouse paths. |

### Commerce and site URL

| Variable | Role |
|----------|------|
| `STRIPE_SECRET_KEY` | Stripe server SDK. |
| `NEXT_PUBLIC_BASE_URL` | Absolute site URL for Stripe redirects. |
| *(client)* Stripe publishable key | Used in checkout UI (configure where your Stripe.js loader reads it). |

### Email

| Variable | Role |
|----------|------|
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Nodemailer transport. |
| `CONTACT_EMAIL` | Inbound address for contact form. |

### GitHub

| Variable | Role |
|----------|------|
| `GITHUB_TOKEN` | Higher rate limits for GitHub API routes. |

## Studio package (`studio/.env.example`)

Used when running `sanity dev` / `sanity deploy` from `studio/`:

- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`
- `SANITY_STUDIO_PREVIEW_URL` (optional)
- `SANITY_STUDIO_STUDIO_HOST` (optional)

Keep project id and dataset aligned with the frontend’s `NEXT_PUBLIC_*` values.

## Local development

From repo root:

```bash
npm install
npm run dev
```

Install only when adding dependencies; workspaces hoist to root `node_modules` per npm behavior.

## Production checklist

1. Set all **required** Sanity and URL variables on the hosting provider.
2. Use a **write-capable** token for crawlers and analytics ingestion; scope tokens minimally in Sanity manage UI.
3. Set **`CRON_SECRET`** and configure host cron to hit:
   - `/api/cron/crawl-jobs`
   - `/api/cron/crawl-jobs-locations` (if you use location passes)
   - `/api/cron/record-system-metrics`
4. Configure **Stripe** live keys and webhook endpoints if you process payments beyond Checkout (webhooks are not enumerated in this doc—add if implemented).
5. Optional: set **obscure Studio path** + **access secret** so editors authenticate and `/studio` is not advertised.
6. Review **`/api/admin/*` exposure**: add auth if the app is reachable from untrusted clients.

## Deploying Studio separately

From `studio/`:

```bash
npx sanity deploy
```

The embedded Studio in Next.js can still be primary; standalone deploy is useful for editors or for schema development.

## Importing sample data

```bash
npm run import-sample-data
```

Uses the root script to import `sample-data.tar.gz` into the dataset configured in your CLI context. **Destructive** (`--replace`); never run against production without intent.

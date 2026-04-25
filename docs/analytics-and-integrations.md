# Analytics and third-party integrations

## Client-side analytics

The frontend records:

- **Page views** — `POST /api/analytics/page-view` creates `pageView` documents (URL, session id, IP from `x-forwarded-for` / `x-real-ip`, user agent, timing, referrer).
- **Custom events** — `POST /api/analytics/event` for `userEvent` (see route implementation for payload shape).
- **Performance** — `POST /api/analytics/performance` feeds `performanceMetric`.
- **Errors** — `POST /api/analytics/error` feeds `errorLog`.

IP extraction helpers live in [`frontend/lib/analytics.ts`](../frontend/lib/analytics.ts).

Writes use [`frontend/sanity/lib/writeClient.ts`](../frontend/sanity/lib/writeClient.ts), which prefers `SANITY_API_WRITE_TOKEN` and falls back to the read token—**the read token must allow creates** if you do not set a dedicated write token.

## Admin analytics APIs

Dashboards under **Events** and **System Monitoring** consume routes such as:

- `/api/admin/analytics/overview`
- `/api/admin/analytics/page-views`
- `/api/admin/analytics/events`
- `/api/admin/analytics/performance`
- `/api/admin/analytics/error-logs`
- `/api/admin/analytics/system-metrics`
- `/api/admin/analytics/system-monitoring`

These generally query Sanity via the configured read client. Treat them as **internal** endpoints: they are not a public analytics product API; secure your deployment network and Studio access accordingly.

## System metrics cron

`GET /api/cron/record-system-metrics` records periodic system snapshots when triggered by a scheduler. If `CRON_SECRET` is set, require `Authorization: Bearer <secret>`.

A sample/demo route may exist under `admin/analytics/record-system-metrics-sample` for development.

## GitHub

- `GET /api/github/contributions` — contribution graph data (uses `GITHUB_TOKEN` when present).
- `GET /api/github/activity-overview` — richer activity summary for the homepage widget.

Without a token, behavior depends on implementation (public rate limits or degraded mode—see route files).

## Stripe (source code checkout)

`POST /api/stripe/create-checkout-session` creates a **Checkout Session** with dynamic `price_data` from the request body (`sourceCodeId`, `title`, `price`). Requires `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_BASE_URL` for success/cancel URLs.

Client code should use `@stripe/stripe-js` with a publishable key as appropriate for your checkout flow.

## Contact form

`POST /api/contact` sends email via Nodemailer using `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_EMAIL` (see [`frontend/app/api/contact/route.ts`](../frontend/app/api/contact/route.ts)).

## Resume

Resume download or PDF routes under `frontend/app/api/resume/` serve or track resume assets depending on configuration.

## Vercel / observability

`@vercel/speed-insights` is included in the frontend dependencies for Real User Monitoring on Vercel when enabled in the project.

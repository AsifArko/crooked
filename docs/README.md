# Crooked — documentation

This folder describes how the application is structured, which data lives in Sanity, and how the Next.js API routes fit together. It replaces older job/archive spec folders; treat these files as the current source of truth alongside the code.

## Reading order

1. **[architecture.md](architecture.md)** — What runs where (workspaces, major subsystems).
2. **[content-and-studio.md](content-and-studio.md)** — Sanity types and the Studio sidebar (dashboards).
3. **[jobs-geography-companies.md](jobs-geography-companies.md)** — Ingestion pipelines for jobs, places, countries/cities, companies.
4. **[analytics-and-integrations.md](analytics-and-integrations.md)** — Client and server telemetry, Stripe, contact email, GitHub.
5. **[api-spec.md](api-spec.md)** — Route inventory and purpose.
6. **[environment-and-deployment.md](environment-and-deployment.md)** — Configuration, cron, and deployment considerations.

## Conventions

- Paths are relative to the repository root unless stated otherwise.
- **Frontend** means the Next.js app in `frontend/`.
- **Studio** means the Sanity Studio package in `studio/` (schemas) and the Studio route embedded in the Next.js app under `frontend/app/studio/`.

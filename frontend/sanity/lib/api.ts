/**
 * As this file is reused in several other files, try to keep it lean and small.
 * Importing other npm packages here could lead to needlessly increasing the client bundle size, or end up in a server-only function that don't need it.
 */

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-28";

/**
 * Used to configure edit intent links, Presentation Mode, and where the Studio is mounted.
 * Set NEXT_PUBLIC_BASE_URL (and optionally NEXT_PUBLIC_SANITY_STUDIO_PATH) in production.
 */
const studioPath =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH?.trim() &&
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH !== "studio"
    ? `/${process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH.trim()}`
    : "/studio";
const baseUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3333";
export const studioUrl =
  baseUrl.endsWith("/")
    ? `${baseUrl.slice(0, -1)}${studioPath}`
    : `${baseUrl}${studioPath}`;

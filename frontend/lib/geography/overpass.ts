/**
 * Overpass API client for fetching OpenStreetMap place data.
 * Used for bulk city queries by country.
 * @see https://wiki.openstreetmap.org/wiki/Overpass_API
 */

// Multiple endpoints for fallback when primary times out (504) or is overloaded
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];
const USER_AGENT = "CrookedGeography/1.0 (https://github.com/crooked; contact@example.com)";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

export type OverpassNode = {
  type: "node";
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

export type OverpassElement = OverpassNode;

export type OverpassResponse = {
  elements: OverpassElement[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch cities/towns/villages from a country via Overpass API.
 * Returns nodes with place=city|town|village.
 * Uses retries and fallback endpoints to handle 504 Gateway Timeout.
 */
export async function fetchCitiesByCountry(
  countryCode: string
): Promise<OverpassNode[]> {
  const iso = countryCode.toUpperCase();
  // Overpass area lookup: ISO3166-1 alpha-2. Some codes may need mapping (e.g. UK -> GB).
  const areaCode = iso === "UK" ? "GB" : iso;

  const query = `
[out:json][timeout:90];
area["ISO3166-1"="${areaCode}"][admin_level=2]->.a;
(
  node["place"~"city|town|village"](area.a);
);
out body;
  `.trim();

  let lastError: Error | null = null;

  for (const baseUrl of OVERPASS_ENDPOINTS) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          await sleep(RETRY_DELAY_MS * attempt);
        }

        const res = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": USER_AGENT,
          },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (!res.ok) {
          const err = new Error(`Overpass API error: ${res.status} ${res.statusText}`);
          lastError = err;
          // 504 Gateway Timeout or 429 Too Many Requests: retry same endpoint, or try next
          if (res.status === 504 || res.status === 429) {
            if (attempt < MAX_RETRIES) continue;
            break; // try next endpoint
          }
          throw err;
        }

        const data = (await res.json()) as OverpassResponse;
        return (data.elements ?? []).filter((e): e is OverpassNode => e.type === "node");
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        if (attempt < MAX_RETRIES) continue;
      }
    }
  }

  throw lastError ?? new Error("Overpass API: all endpoints failed");
}

/**
 * Parse population from OSM tags (can be string or number in tags).
 */
export function parsePopulation(tags: Record<string, string> | undefined): number | undefined {
  if (!tags?.population) return undefined;
  const n = parseInt(tags.population, 10);
  return isNaN(n) ? undefined : n;
}

/**
 * Get display name for a city from OSM tags.
 * Prefer name:en, then name, then addr:city.
 */
export function getCityName(tags: Record<string, string> | undefined): string {
  if (!tags) return "";
  return tags["name:en"] || tags.name || tags["addr:city"] || "";
}

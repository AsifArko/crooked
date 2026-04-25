/**
 * Nominatim API client for OpenStreetMap geocoding.
 * Rate limit: 1 request per second (strict).
 * @see https://nominatim.org/release-docs/develop/api/Search/
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const USER_AGENT = "CrookedGeography/1.0 (https://github.com/crooked; contact@example.com)";

let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1100; // Slightly over 1s to be safe

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((r) => setTimeout(r, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestTime = Date.now();
}

export type NominatimResult = {
  place_id: number;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    state_district?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
  };
  boundingbox?: [string, string, string, string];
  importance?: number;
};

/**
 * Search for a place by name. Returns best match.
 * Rate-limited to 1 req/sec.
 */
export async function searchPlace(
  query: string,
  options?: { countrycodes?: string; limit?: number }
): Promise<NominatimResult | null> {
  await rateLimit();

  const params = new URLSearchParams({
    q: query,
    format: "json",
    addressdetails: "1",
    limit: String(options?.limit ?? 1),
  });
  if (options?.countrycodes) {
    params.set("countrycodes", options.countrycodes);
  }

  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim API error: ${res.status}`);
  }

  const data = (await res.json()) as NominatimResult[];
  return data?.[0] ?? null;
}

/**
 * Search for a country by name to get its center coordinates.
 */
export async function searchCountry(countryName: string): Promise<{
  lat: number;
  lon: number;
  countryCode?: string;
} | null> {
  const result = await searchPlace(countryName, { limit: 1 });
  if (!result) return null;
  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    countryCode: result.address?.country_code,
  };
}

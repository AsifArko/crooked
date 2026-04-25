/**
 * Seed country and city data from OpenStreetMap.
 * - Countries: from ISO 3166 (countries-data.json) - accurate UN data
 * - Cities: from Overpass API (OSM) - accurate geolocation, population
 *
 * Supports batch processing, resume, and history tracking.
 */

import type { SanityClient } from "@sanity/client";
import countriesData from "../countries-data.json";
import {
  fetchCitiesByCountry,
  getCityName,
  parsePopulation,
  type OverpassNode,
} from "./overpass";

type CountryRow = {
  name: string;
  "alpha-2": string;
  region?: string;
  "sub-region"?: string;
};

const COUNTRIES = countriesData as CountryRow[];

/** Skip territories/tiny islands that may not have Overpass area data */
const SKIP_COUNTRY_CODES = new Set([
  "AQ", "BV", "HM", "GS", "UM", "TK", "PN", "NF", "CX", "CC",
]);

export function getSeedableCountryCodes(): string[] {
  return COUNTRIES
    .filter((r) => r["alpha-2"] && r.name && !SKIP_COUNTRY_CODES.has(r["alpha-2"].toUpperCase()))
    .map((r) => r["alpha-2"].toUpperCase());
}

export async function seedCountries(
  client: SanityClient
): Promise<{ created: number; updated: number; skipped: number }> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const existing = await client.fetch<
    Array<{ _id: string; countryCode: string }>
  >(`*[_type == "country"]{ _id, countryCode }`);

  const byCode = new Map(existing.map((e) => [e.countryCode, e]));

  for (const row of COUNTRIES) {
    const code = row["alpha-2"]?.toUpperCase();
    if (!code || !row.name) {
      skipped++;
      continue;
    }
    if (SKIP_COUNTRY_CODES.has(code)) {
      skipped++;
      continue;
    }

    const slug = code.toLowerCase();
    const region = row.region || row["sub-region"] || undefined;

    if (byCode.has(code)) {
      await client
        .patch(byCode.get(code)!._id)
        .set({ name: row.name, region: region || undefined })
        .commit();
      updated++;
    } else {
      await client.create({
        _type: "country",
        name: row.name,
        countryCode: code,
        slug,
        region,
      });
      created++;
    }
  }

  return { created, updated, skipped };
}

export async function seedCitiesForCountry(
  client: SanityClient,
  countryCode: string,
  options?: { minPopulation?: number; limit?: number }
): Promise<{ created: number; updated: number; errors: number }> {
  const code = countryCode.toUpperCase();

  const [country, existingCities] = await Promise.all([
    client.fetch<{ _id: string } | null>(
      `*[_type == "country" && countryCode == $code][0]{ _id }`,
      { code }
    ),
    client.fetch<
      Array<{ _id: string; name: string; geolocation?: { lat?: number; lng?: number } }>
    >(
      `*[_type == "city" && countryCode == $code]{ _id, name, geolocation }`,
      { code }
    ),
  ]);

  if (!country) {
    throw new Error(`Country not found: ${countryCode}. Seed countries first.`);
  }

  const existingByKey = new Map(
    existingCities.map((c) => {
      const lat = c.geolocation?.lat?.toFixed(4);
      const lng = c.geolocation?.lng?.toFixed(4);
      return [`${c.name}|${lat}|${lng}`, c];
    })
  );

  let nodes: OverpassNode[];
  try {
    nodes = await fetchCitiesByCountry(code);
  } catch (e) {
    console.error(`Overpass fetch failed for ${code}:`, e);
    return { created: 0, updated: 0, errors: 1 };
  }

  const minPop = options?.minPopulation ?? 0;
  const limit = options?.limit; // 0 or undefined = no limit (all cities)

  const filtered = nodes
    .map((n) => {
      const name = getCityName(n.tags);
      const pop = parsePopulation(n.tags);
      const state = n.tags?.["addr:state"] || n.tags?.["is_in:state"] || undefined;
      const postcode = n.tags?.["addr:postcode"] || undefined;
      return { node: n, name, pop, state, postcode };
    })
    .filter((x) => x.name && (minPop === 0 || (x.pop != null && x.pop >= minPop)))
    .sort((a, b) => (b.pop ?? 0) - (a.pop ?? 0));
  const sliced = limit && limit > 0 ? filtered.slice(0, limit) : filtered;

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const { node, name, pop, state, postcode } of sliced) {
    const key = `${name}|${node.lat.toFixed(4)}|${node.lon.toFixed(4)}`;
    const existing = existingByKey.get(key);

    const doc = {
      _type: "city" as const,
      name,
      country: { _type: "reference" as const, _ref: country._id },
      countryCode: code,
      state: state || undefined,
      postcode: postcode || undefined,
      geolocation: {
        _type: "geopoint" as const,
        lat: node.lat,
        lng: node.lon,
      },
      population: pop ?? undefined,
      crawlEnabled: true,
    };

    try {
      if (existing) {
        await client
          .patch(existing._id)
          .set({
            population: doc.population,
            state: doc.state,
            postcode: doc.postcode,
          })
          .commit();
        updated++;
      } else {
        await client.create(doc);
        created++;
        existingByKey.set(key, { _id: "new", name, geolocation: { lat: node.lat, lng: node.lon } });
      }
    } catch (e) {
      console.error(`Failed to create city ${name}:`, e);
      errors++;
    }
  }

  return { created, updated, errors };
}

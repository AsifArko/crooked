# Geography Schema – OpenStreetMap World Map Data

## Purpose

Map the entire world by countries, states/regions, cities, and districts using **OpenStreetMap** data. Our internal `place` schema extends OSM structures so we can:

- Filter jobs by geographic hierarchy (country → region → city → district)
- Geocode job locations and link them to canonical places
- Display location filters in the Jobs dashboard

**All geography data comes from OpenStreetMap** – Nominatim (search/reverse geocode) and Overpass API (bulk queries). No paid geocoding services.

---

## OpenStreetMap Concepts

### 1. Nominatim API

- **Base URL:** `https://nominatim.openstreetmap.org`
- **Use:** Search places by name, reverse geocode (lat/lon → address)
- **Rate limit:** 1 request per second (strict – use User-Agent)
- **Output:** `place_id`, `osm_type`, `osm_id`, `lat`, `lon`, `display_name`, `address` (with `addressdetails=1`)

**Address hierarchy (with `addressdetails=1`):**
```json
{
  "address": {
    "city": "London",
    "state_district": "Greater London",
    "state": "England",
    "ISO3166-2-lvl4": "GB-ENG",
    "postcode": "SW1A 2DU",
    "country": "United Kingdom",
    "country_code": "gb"
  }
}
```

### 2. Overpass API

- **Base URL:** `https://overpass-api.de/api/interpreter` (or `overpass.kumi.systems`)
- **Use:** Bulk query OSM data (cities in a country, admin boundaries)
- **Rate limit:** Reasonable use – avoid heavy queries; use `[out:json]` for JSON
- **Query language:** Overpass QL

**Example – cities in Germany:**
```overpass
[out:json][timeout:60];
area["ISO3166-1"="DE"][admin_level=2]->.country;
(
  node["place"~"city|town"](area.country);
);
out body;
```

### 3. Admin Level Hierarchy (OSM)

OSM uses `admin_level` for administrative boundaries. **Not globally uniform** – each country differs:

| admin_level | Typical meaning (varies by country) |
|-------------|-------------------------------------|
| 2 | Country |
| 3 | State, province, region |
| 4 | County, department |
| 5–8 | Municipality, district, city, borough |
| 9–11 | Neighborhood, ward |

**Place nodes** use `place=` tag: `city`, `town`, `village`, `suburb`, `neighbourhood`, etc.

---

## Internal `place` Schema (Extends OSM)

Our Sanity `place` document stores OSM-derived data with a stable internal structure:

```ts
// place – geographic location (country, region, city, district)
{
  name: 'place',
  type: 'document',
  fields: [
    // OSM identifiers (use osm_type + osm_id for persistence; place_id can change)
    { name: 'osmType', type: 'string', title: 'OSM Type' },      // node, way, relation
    { name: 'osmId', type: 'string', title: 'OSM ID' },
    { name: 'placeId', type: 'number', title: 'Nominatim Place ID' }, // optional, may change

    // Hierarchy
    { name: 'placeType', type: 'string', title: 'Place Type' },  // country, state, city, district, etc.
    { name: 'adminLevel', type: 'number', title: 'Admin Level' }, // 2=country, 3-11=subdivisions
    { name: 'parent', type: 'reference', to: [{ type: 'place' }], title: 'Parent Place' },

    // Names and display
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'displayName', type: 'string', title: 'Display Name' }, // full address string
    { name: 'nameEn', type: 'string', title: 'Name (English)' },

    // Geography
    { name: 'lat', type: 'number', title: 'Latitude' },
    { name: 'lon', type: 'number', title: 'Longitude' },
    { name: 'boundingBox', type: 'array', of: [{ type: 'number' }], title: 'Bounding Box' }, // [minLat, maxLat, minLon, maxLon]

    // Address components (from Nominatim address object)
    { name: 'countryCode', type: 'string', title: 'Country Code' },   // ISO 3166-1 alpha-2
    { name: 'country', type: 'string', title: 'Country Name' },
    { name: 'state', type: 'string', title: 'State/Region' },
    { name: 'stateDistrict', type: 'string', title: 'State District' },
    { name: 'city', type: 'string', title: 'City' },
    { name: 'district', type: 'string', title: 'District' },
    { name: 'postcode', type: 'string', title: 'Postcode' },

    // Metadata
    { name: 'population', type: 'number', title: 'Population' },     // from extratags if available
    { name: 'importance', type: 'number', title: 'Importance' },       // Nominatim importance rank
    { name: 'lastSyncedAt', type: 'datetime', title: 'Last Synced' },
  ]
}
```

**Unique constraint:** `osmType` + `osmId` (or `placeId` as fallback) – used for deduplication when syncing from OSM.

---

## Geography Seed Strategy

### Phase 1: Countries (One-time)

- Use existing `countries-data.json` or ISO 3166-1 list
- For each country: Nominatim search `country_name` → get `osm_type`, `osm_id`, `lat`, `lon`, `country_code`
- Create `place` with `placeType: 'country'`, `adminLevel: 2`

### Phase 2: Major Cities (Bulk via Overpass)

- Overpass query: `node[place=city]` or `node[place~"city|town"]` within each country
- Filter by population if `population` tag exists (e.g. > 100k)
- Create `place` with `placeType: 'city'` or `placeType: 'town'`, link to country `parent`

### Phase 3: On-Demand (Lazy Load)

- When a job has location "Berlin, Germany" → Nominatim search
- If place doesn't exist in Sanity, create from Nominatim result
- Build hierarchy: city → state → country (create parents if missing)

---

## Geocoding Job Locations

Job APIs return location as strings, e.g.:
- "Berlin, Germany"
- "Remote"
- "New York, NY, USA"
- "London, UK"

**Geocoding flow:**

1. **Remote:** No geocode; `place` = null or special "Remote" place
2. **String location:** Call Nominatim search with `q={location}&format=json&addressdetails=1&limit=1`
3. **Parse result:** Extract `osm_type`, `osm_id`, `lat`, `lon`, `address`
4. **Resolve place:** Lookup Sanity `place` by `osmType`+`osmId`; if not found, create from Nominatim result
5. **Link job:** Set `jobListing.place` = ref to `place`

**Rate limiting:** 1 req/sec for Nominatim. Use queue or batch with delays.

---

## Overpass Query Examples

### Cities in a country (by ISO code)

```overpass
[out:json][timeout:90];
area["ISO3166-1"="US"][admin_level=2]->.a;
node["place"~"city|town|village"](area.a);
out body;
```

### Admin boundaries (states) in a country

```overpass
[out:json][timeout:90];
area["ISO3166-1"="DE"][admin_level=2]->.a;
relation["boundary"="administrative"]["admin_level"~"3|4"](area.a);
out body;
```

---

## API Endpoints for Geography

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/jobs/places/search` | GET | Search places by name (proxies to Nominatim, caches in Sanity) |
| `/api/jobs/places/geocode` | POST | Geocode a location string → return or create `place` |
| `/api/jobs/places` | GET | List places with filters (country, type, parent) |
| `/api/admin/jobs/places/seed` | POST | Trigger seed (countries, or cities for a country) |

---

## Caching & Performance

- **Nominatim:** Cache results in Sanity `place` – avoid re-geocoding same location
- **Overpass:** Seed in batches; run during off-peak (cron at night)
- **Dashboard filters:** Pre-aggregate country/region/city lists from `place` documents for fast dropdowns

---

## Attribution

- **OpenStreetMap:** © OpenStreetMap contributors, ODbL 1.0. [https://osm.org/copyright](https://osm.org/copyright)
- **Nominatim:** [https://nominatim.org/](https://nominatim.org/) – follow [usage policy](https://operations.osmfoundation.org/policies/nominatim/)

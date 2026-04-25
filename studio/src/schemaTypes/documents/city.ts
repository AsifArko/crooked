import { defineField, defineType } from "sanity";

export default defineType({
  name: "city",
  title: "City",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "City Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "country",
      type: "reference",
      to: [{ type: "country" }],
      title: "Country",
    }),
    defineField({
      name: "countryCode",
      type: "string",
      title: "Country Code",
      description: "Denormalized for filtering (e.g. US, GB)",
    }),
    defineField({
      name: "state",
      type: "string",
      title: "State / Region",
      description: "State, province, or region name",
    }),
    defineField({
      name: "postcode",
      type: "string",
      title: "Postal / Zip Code",
      description: "Primary postal or zip code for the city (e.g. 10001, SW1A 1AA)",
    }),
    defineField({
      name: "postcodes",
      type: "array",
      of: [{ type: "string" }],
      title: "Postal / Zip Codes",
      description: "All postal codes in this city (for cities with multiple codes)",
    }),
    defineField({
      name: "geolocation",
      type: "geopoint",
      title: "Geolocation",
      description: "City center coordinates (lat/lon). Used by crawlers for location-based search.",
    }),
    defineField({
      name: "population",
      type: "number",
      title: "Population",
    }),
    defineField({
      name: "timezone",
      type: "string",
      title: "Timezone",
      description: "e.g. America/New_York, Europe/London",
    }),
    defineField({
      name: "boundingBox",
      type: "array",
      of: [{ type: "number" }],
      title: "Bounding Box",
      description: "[minLon, minLat, maxLon, maxLat] for search area",
    }),
    defineField({
      name: "companiesCount",
      type: "number",
      title: "Companies Count",
      description: "Cached count of IT/software companies in this city",
      readOnly: true,
    }),
    defineField({
      name: "lastCrawledAt",
      type: "datetime",
      title: "Last Crawled",
      description: "When companies were last crawled for this city",
    }),
    defineField({
      name: "crawlEnabled",
      type: "boolean",
      title: "Crawl Enabled",
      description: "Include this city in company crawls",
      initialValue: true,
    }),
  ],
  preview: {
    select: { name: "name", countryCode: "countryCode", country: "country" },
    prepare({ name, countryCode, country }) {
      const countryRef = country as { name?: string } | undefined;
      const loc = countryRef?.name || countryCode || "";
      return {
        title: name || "Untitled",
        subtitle: loc ? `${loc}` : undefined,
      };
    },
  },
});

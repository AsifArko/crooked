import { defineField, defineType } from "sanity";

export default defineType({
  name: "country",
  title: "Country",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Country Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "countryCode",
      type: "string",
      title: "Country Code (ISO 3166-1 alpha-2)",
      description: "e.g. US, GB, DE",
      validation: (r) => r.required().length(2),
    }),
    defineField({
      name: "slug",
      type: "string",
      title: "Slug",
      description: "URL-friendly identifier",
    }),
    defineField({
      name: "region",
      type: "string",
      title: "Region",
      description: "e.g. Europe, North America",
    }),
    defineField({
      name: "population",
      type: "number",
      title: "Population",
    }),
    defineField({
      name: "lastSyncedAt",
      type: "datetime",
      title: "Last Synced",
      description: "When cities/locations were last synced from external source",
    }),
  ],
  preview: {
    select: { name: "name", countryCode: "countryCode" },
    prepare({ name, countryCode }) {
      return {
        title: name || countryCode || "Untitled",
        subtitle: countryCode ? `(${countryCode})` : undefined,
      };
    },
  },
});

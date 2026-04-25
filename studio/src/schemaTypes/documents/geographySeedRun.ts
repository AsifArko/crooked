import { defineField, defineType } from "sanity";

export default defineType({
  name: "geographySeedRun",
  title: "Geography Seed Run",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "startedAt", type: "datetime", title: "Started At" }),
    defineField({ name: "finishedAt", type: "datetime", title: "Finished At" }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { value: "running", title: "Running" },
          { value: "completed", title: "Completed" },
          { value: "failed", title: "Failed" },
          { value: "partial", title: "Partial (interrupted)" },
        ],
      },
    }),
    defineField({
      name: "mode",
      type: "string",
      title: "Mode",
      options: {
        list: [
          { value: "countries", title: "Countries only" },
          { value: "cities", title: "Cities (single country)" },
          { value: "cities_all", title: "Cities (all countries)" },
        ],
      },
    }),
    defineField({
      name: "params",
      type: "object",
      title: "Params",
      fields: [
        { name: "countryCode", type: "string", title: "Country Code" },
        { name: "countryCodes", type: "array", of: [{ type: "string" }], title: "Country Codes" },
        { name: "minPopulation", type: "number", title: "Min Population" },
        { name: "limit", type: "number", title: "Limit per country" },
        { name: "batchSize", type: "number", title: "Batch Size" },
      ],
    }),
    defineField({
      name: "countriesCreated",
      type: "number",
      title: "Countries Created",
    }),
    defineField({
      name: "countriesUpdated",
      type: "number",
      title: "Countries Updated",
    }),
    defineField({
      name: "countriesSkipped",
      type: "number",
      title: "Countries Skipped",
    }),
    defineField({
      name: "citiesCreated",
      type: "number",
      title: "Cities Created",
    }),
    defineField({
      name: "citiesUpdated",
      type: "number",
      title: "Cities Updated",
    }),
    defineField({
      name: "citiesErrors",
      type: "number",
      title: "Cities Errors",
    }),
    defineField({
      name: "durationMs",
      type: "number",
      title: "Duration (ms)",
    }),
    defineField({
      name: "processedCountries",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "countryCode", type: "string", title: "Country Code" },
            { name: "created", type: "number", title: "Created" },
            { name: "updated", type: "number", title: "Updated" },
            { name: "errors", type: "number", title: "Errors" },
          ],
        },
      ],
      title: "Processed Countries",
    }),
    defineField({
      name: "remainingCountries",
      type: "array",
      of: [{ type: "string" }],
      title: "Remaining Countries",
      description: "Countries not yet processed (for resume)",
    }),
    defineField({
      name: "lastProcessedCountry",
      type: "string",
      title: "Last Processed Country",
      description: "For resume from interruption",
    }),
    defineField({
      name: "log",
      type: "array",
      of: [{ type: "string" }],
      title: "Log",
      description: "Progress log entries (what is being crawled, progress, etc.)",
    }),
    defineField({ name: "errorLog", type: "text", title: "Error Log" }),
  ],
  preview: {
    select: {
      status: "status",
      mode: "mode",
      startedAt: "startedAt",
      citiesCreated: "citiesCreated",
    },
    prepare({ status, mode, startedAt, citiesCreated }) {
      const date = startedAt ? new Date(startedAt).toLocaleString() : "—";
      const count = citiesCreated != null ? ` (${citiesCreated} cities)` : "";
      return {
        title: `Seed ${mode ?? "—"} — ${status}${count}`,
        subtitle: date,
      };
    },
  },
});

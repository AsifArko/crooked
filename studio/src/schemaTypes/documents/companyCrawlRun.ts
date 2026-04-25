import { defineField, defineType } from "sanity";

export default defineType({
  name: "companyCrawlRun",
  title: "Company Crawl Run",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "startedAt", type: "datetime", title: "Started At" }),
    defineField({ name: "finishedAt", type: "datetime", title: "Finished At" }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: { list: ["running", "completed", "failed", "skipped"] },
    }),
    defineField({
      name: "trigger",
      type: "string",
      title: "Trigger",
      options: {
        list: [
          { value: "manual", title: "Manual (dashboard)" },
          { value: "cron", title: "Cron (scheduled)" },
        ],
      },
    }),
    defineField({
      name: "params",
      type: "object",
      title: "Crawl Params",
      fields: [
        { name: "cityId", type: "string", title: "City ID" },
        { name: "countryCode", type: "string", title: "Country Code" },
        { name: "crawlSource", type: "string", title: "Crawl Source" },
        { name: "limit", type: "number", title: "Limit" },
      ],
    }),
    defineField({
      name: "totalFetched",
      type: "number",
      title: "Total Fetched",
    }),
    defineField({
      name: "totalCreated",
      type: "number",
      title: "Total Created",
    }),
    defineField({
      name: "totalUpdated",
      type: "number",
      title: "Total Updated",
    }),
    defineField({
      name: "totalErrors",
      type: "number",
      title: "Total Errors",
    }),
    defineField({
      name: "durationMs",
      type: "number",
      title: "Duration (ms)",
    }),
    defineField({
      name: "cityStats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", type: "string", title: "City" },
            { name: "country", type: "string", title: "Country" },
            { name: "fetched", type: "number", title: "Fetched" },
            { name: "created", type: "number", title: "Created" },
            { name: "updated", type: "number", title: "Updated" },
            { name: "errors", type: "number", title: "Errors" },
          ],
        },
      ],
      title: "City Stats",
    }),
    defineField({ name: "errorLog", type: "text", title: "Error Log" }),
  ],
  preview: {
    select: {
      status: "status",
      startedAt: "startedAt",
      totalFetched: "totalFetched",
    },
    prepare({ status, startedAt, totalFetched }) {
      const date = startedAt ? new Date(startedAt).toLocaleString() : "—";
      const count = totalFetched != null ? ` (${totalFetched} companies)` : "";
      return {
        title: `Company crawl — ${status}${count}`,
        subtitle: date,
      };
    },
  },
});

import { defineField, defineType } from "sanity";

export default defineType({
  name: "crawlRun",
  title: "Crawl Run",
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
      name: "crawlType",
      type: "string",
      title: "Crawl Type",
      description: "What was crawled: jobs (APIs/RSS), locations (SerpApi), or feeds",
      options: {
        list: [
          { value: "jobs", title: "Jobs (APIs & RSS)" },
          { value: "locations", title: "Locations (SerpApi)" },
          { value: "feeds", title: "Feeds" },
        ],
      },
    }),
    defineField({
      name: "trigger",
      type: "string",
      title: "Trigger",
      description: "How the crawl was started",
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
      description: "Parameters passed to the crawl (search, country, location, source)",
      fields: [
        { name: "search", type: "string", title: "Search" },
        { name: "countryCode", type: "string", title: "Country Code" },
        { name: "location", type: "string", title: "Location / City" },
        { name: "source", type: "string", title: "Source" },
      ],
    }),
    defineField({
      name: "totalJobs",
      type: "number",
      title: "Total Jobs Fetched",
      description: "Sum of jobs fetched across all sources",
    }),
    defineField({
      name: "totalCreated",
      type: "number",
      title: "Total Created",
      description: "New job listings created",
    }),
    defineField({
      name: "totalUpdated",
      type: "number",
      title: "Total Updated",
      description: "Existing job listings updated",
    }),
    defineField({
      name: "durationMs",
      type: "number",
      title: "Duration (ms)",
      description: "Crawl duration in milliseconds",
    }),
    defineField({
      name: "sourceStats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "source", type: "string", title: "Source" },
            { name: "fetched", type: "number", title: "Fetched" },
            { name: "created", type: "number", title: "Created" },
            { name: "updated", type: "number", title: "Updated" },
            { name: "errors", type: "number", title: "Errors" },
          ],
        },
      ],
      title: "Source Stats",
      description: "Per-source breakdown (APIs, RSS feeds)",
    }),
    defineField({
      name: "locationStats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", type: "string", title: "City" },
            { name: "country", type: "string", title: "Country" },
            { name: "queries", type: "number", title: "Queries" },
            { name: "jobsFound", type: "number", title: "Jobs Found" },
            { name: "created", type: "number", title: "Created" },
            { name: "updated", type: "number", title: "Updated" },
          ],
        },
      ],
      title: "Location Stats",
      description: "Per-location breakdown (for location-based crawls)",
    }),
    defineField({ name: "errorLog", type: "text", title: "Error Log" }),
    defineField({
      name: "metadata",
      type: "object",
      title: "Metadata",
      description: "Additional crawl metadata",
      fields: [
        { name: "environment", type: "string", title: "Environment" },
        { name: "version", type: "string", title: "Crawler Version" },
        { name: "notes", type: "text", title: "Notes" },
      ],
    }),
  ],
  preview: {
    select: {
      status: "status",
      crawlType: "crawlType",
      startedAt: "startedAt",
      totalJobs: "totalJobs",
    },
    prepare({ status, crawlType, startedAt, totalJobs }) {
      const date = startedAt ? new Date(startedAt).toLocaleString() : "—";
      const type = crawlType || "jobs";
      const jobs = totalJobs != null ? ` (${totalJobs} jobs)` : "";
      return {
        title: `${type} crawl — ${status}${jobs}`,
        subtitle: date,
      };
    },
  },
});

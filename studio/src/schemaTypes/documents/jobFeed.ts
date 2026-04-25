import { defineField, defineType } from "sanity";

export default defineType({
  name: "jobFeed",
  title: "Job Feed",
  type: "document",
  fields: [
    defineField({ name: "url", type: "url", title: "Feed URL", validation: (r) => r.required() }),
    defineField({
      name: "source",
      type: "reference",
      to: [{ type: "jobSource" }],
      title: "Source",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "Optional category for grouping (e.g. remote-software, programming, design)",
    }),
    defineField({
      name: "feedType",
      type: "string",
      title: "Feed Type",
      initialValue: "rss",
      options: {
        list: [
          { title: "RSS", value: "rss" },
          { title: "Atom", value: "atom" },
          { title: "Greenhouse RSS", value: "greenhouse_rss" },
          { title: "Lever RSS", value: "lever_rss" },
          { title: "Workable RSS", value: "workable_rss" },
        ],
      },
    }),
    defineField({ name: "enabled", type: "boolean", title: "Enabled", initialValue: true }),
    defineField({ name: "lastCrawledAt", type: "datetime", title: "Last Crawled At" }),
    defineField({ name: "lastError", type: "string", title: "Last Error" }),
  ],
});

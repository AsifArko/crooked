import { defineField, defineType } from "sanity";

export default defineType({
  name: "jobSource",
  title: "Job Source",
  type: "document",
  fields: [
    defineField({ name: "slug", type: "string", title: "Slug", validation: (r) => r.required() }),
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({ name: "url", type: "url", title: "URL" }),
    defineField({ name: "attribution", type: "string", title: "Attribution Text" }),
    defineField({
      name: "sourceType",
      type: "string",
      title: "Source Type",
      description: "How jobs are fetched: API, RSS, or Greenhouse",
      options: {
        list: [
          { title: "API", value: "api" },
          { title: "RSS / Atom", value: "rss" },
          { title: "Greenhouse", value: "greenhouse" },
        ],
      },
    }),
    defineField({ name: "enabled", type: "boolean", title: "Enabled", initialValue: true }),
    defineField({ name: "rateLimitPerMinute", type: "number", title: "Rate Limit (per min)" }),
  ],
});

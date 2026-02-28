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
    defineField({ name: "enabled", type: "boolean", title: "Enabled", initialValue: true }),
    defineField({ name: "rateLimitPerMinute", type: "number", title: "Rate Limit (per min)" }),
  ],
});

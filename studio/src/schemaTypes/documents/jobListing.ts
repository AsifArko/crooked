import { defineField, defineType } from "sanity";

export default defineType({
  name: "jobListing",
  title: "Job Listing",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "externalId", type: "string", title: "External ID" }),
    defineField({
      name: "source",
      type: "reference",
      to: [{ type: "jobSource" }],
      title: "Source",
    }),
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "companyName", type: "string", title: "Company Name" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "url", type: "url", title: "Job URL" }),
    defineField({ name: "locationRaw", type: "string", title: "Location (Raw)" }),
    defineField({
      name: "place",
      type: "reference",
      to: [{ type: "place" }],
      title: "Place",
    }),
    defineField({ name: "remote", type: "boolean", title: "Remote", initialValue: false }),
    defineField({
      name: "jobType",
      type: "string",
      title: "Job Type",
      options: {
        list: ["full-time", "part-time", "contract", "internship", "freelance"],
      },
    }),
    defineField({ name: "salaryMin", type: "number", title: "Salary Min" }),
    defineField({ name: "salaryMax", type: "number", title: "Salary Max" }),
    defineField({ name: "currency", type: "string", title: "Currency" }),
    defineField({ name: "postedAt", type: "datetime", title: "Posted At" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }], title: "Tags" }),
    defineField({ name: "category", type: "string", title: "Category" }),
    defineField({ name: "urlDomain", type: "string", title: "URL Domain" }),
    defineField({ name: "lastCrawledAt", type: "datetime", title: "Last Crawled At" }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: { list: ["active", "expired", "filled"] },
      initialValue: "active",
    }),
    defineField({ name: "lastSeenAt", type: "datetime", title: "Last Seen At" }),
  ],
});

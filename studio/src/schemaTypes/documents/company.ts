import { defineField, defineType } from "sanity";

export default defineType({
  name: "company",
  title: "Company",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Company Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "string",
      title: "Slug",
      description: "URL-friendly identifier",
    }),
    defineField({
      name: "website",
      type: "url",
      title: "Website",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
    }),
    defineField({
      name: "industry",
      type: "string",
      title: "Industry",
      description: "IT/Software, SaaS, FinTech, etc.",
      options: {
        list: [
          { title: "Software / SaaS", value: "software" },
          { title: "IT Services", value: "it_services" },
          { title: "FinTech", value: "fintech" },
          { title: "HealthTech", value: "healthtech" },
          { title: "EdTech", value: "edtech" },
          { title: "E-commerce", value: "ecommerce" },
          { title: "Gaming", value: "gaming" },
          { title: "AI / ML", value: "ai_ml" },
          { title: "Cybersecurity", value: "cybersecurity" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "city",
      type: "reference",
      to: [{ type: "city" }],
      title: "City",
      description: "Primary city/headquarters location",
    }),
    defineField({
      name: "country",
      type: "reference",
      to: [{ type: "country" }],
      title: "Country",
    }),
    defineField({
      name: "addressRaw",
      type: "string",
      title: "Address (Raw)",
      description: "Full address as scraped",
    }),
    defineField({
      name: "employeeCount",
      type: "string",
      title: "Employee Count",
      description: "e.g. 11-50, 51-200, 1001-5000",
    }),
    defineField({
      name: "foundedYear",
      type: "number",
      title: "Founded Year",
    }),
    defineField({
      name: "linkedInUrl",
      type: "url",
      title: "LinkedIn URL",
    }),
    defineField({
      name: "externalId",
      type: "string",
      title: "External ID",
      description: "ID from source (e.g. LinkedIn, Crunchbase)",
    }),
    defineField({
      name: "crawlSource",
      type: "string",
      title: "Crawl Source",
      description: "Which crawler found this company",
      options: {
        list: [
          { title: "Job APIs", value: "job_apis" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Google Maps", value: "google_maps" },
          { title: "Crunchbase", value: "crunchbase" },
          { title: "Manual", value: "manual" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "lastCrawledAt",
      type: "datetime",
      title: "Last Crawled At",
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      title: "Tags",
    }),
  ],
  preview: {
    select: { name: "name", industry: "industry", city: "city" },
    prepare({ name, industry, city }) {
      const cityRef = city as { name?: string } | undefined;
      const loc = cityRef?.name || "";
      return {
        title: name || "Untitled",
        subtitle: [industry, loc].filter(Boolean).join(" • ") || undefined,
      };
    },
  },
});

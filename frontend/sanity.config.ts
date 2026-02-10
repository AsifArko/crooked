import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../studio/src/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Portfolio CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath:
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH?.trim() &&
    process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH !== "studio"
      ? `/${process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH.trim()}`
      : "/studio",
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});

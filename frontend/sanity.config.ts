import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "../studio/src/schemaTypes";
import { structure } from "./sanity/structure";

const studioTheme = buildLegacyTheme({
  /* Base */
  "--black": "#0f172a",
  "--white": "#ffffff",
  "--gray": "#64748b",
  "--gray-base": "#64748b",
  "--component-bg": "#ffffff",
  "--component-text-color": "#0f172a",
  /* Brand */
  "--brand-primary": "#2563eb",
  /* Sidebar - elegant dark slate */
  "--main-navigation-color": "#0f172a",
  "--main-navigation-color--inverted": "#f8fafc",
  /* Buttons */
  "--default-button-color": "#64748b",
  "--default-button-primary-color": "#2563eb",
  "--default-button-success-color": "#059669",
  "--default-button-warning-color": "#d97706",
  "--default-button-danger-color": "#dc2626",
  /* State */
  "--state-info-color": "#2563eb",
  "--state-success-color": "#059669",
  "--state-warning-color": "#d97706",
  "--state-danger-color": "#dc2626",
  "--focus-color": "#2563eb",
});

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
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  theme: studioTheme,
});

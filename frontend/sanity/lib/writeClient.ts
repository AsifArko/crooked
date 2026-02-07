import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";

const writeToken =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!writeToken) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});

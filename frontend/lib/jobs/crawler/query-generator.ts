import type { LocationSeed } from "../geography/locations";

const KEYWORDS = [
  "software engineer",
  "software developer",
  "developer",
  "programmer",
  "data scientist",
  "backend developer",
  "frontend developer",
  "full stack developer",
  "devops engineer",
  "machine learning engineer",
];

/**
 * Generate search queries for a given location.
 * Returns 3–5 queries to balance coverage vs API cost.
 */
export function generateQueries(loc: LocationSeed): string[] {
  const queries: string[] = [];
  const city = loc.city;
  const country = loc.countryName;

  queries.push(`software engineer jobs ${city} ${country}`);
  queries.push(`developer jobs ${city}`);
  queries.push(`software developer ${city}`);

  return queries;
}

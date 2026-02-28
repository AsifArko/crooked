/**
 * Location queue for round-robin crawling.
 * Tracks which locations to crawl next. Persists to Sanity or uses in-memory rotation.
 */

import type { LocationSeed } from "./locations";
import { LOCATIONS } from "./locations";

const BATCH_SIZE = 50;

/**
 * Get the next batch of locations to crawl.
 * Uses date-based rotation so each run gets a different slice.
 */
export function getNextLocationBatch(): LocationSeed[] {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const start = (dayOfYear * BATCH_SIZE) % LOCATIONS.length;
  const batch: LocationSeed[] = [];
  for (let i = 0; i < BATCH_SIZE && i < LOCATIONS.length; i++) {
    const idx = (start + i) % LOCATIONS.length;
    batch.push(LOCATIONS[idx]);
  }
  return batch;
}

/**
 * Total number of locations in the seed.
 */
export function getTotalLocations(): number {
  return LOCATIONS.length;
}

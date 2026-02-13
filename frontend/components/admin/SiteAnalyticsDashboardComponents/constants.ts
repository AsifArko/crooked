import type { Overview } from "./types";

export const PAGE_SIZE = 5;

export const CACHE_KEY = "site-analytics-dashboard";
export const CACHE_TTL_MS = 30_000;

export const MY_SESSION_IDS_KEY = "crooked_my_session_ids";

export function loadOverviewCache(): Overview | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { overview, ts } = JSON.parse(raw) as { overview: Overview; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return overview;
  } catch {
    return null;
  }
}

export function saveOverviewCache(overview: Overview): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ overview, ts: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export function getMySessionIds(currentSessionId: string): string[] {
  if (typeof window === "undefined")
    return currentSessionId ? [currentSessionId] : [];
  try {
    const raw = localStorage.getItem(MY_SESSION_IDS_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    const set = new Set(parsed.filter(Boolean));
    if (currentSessionId) set.add(currentSessionId);
    return Array.from(set);
  } catch {
    return currentSessionId ? [currentSessionId] : [];
  }
}

export function addMySessionId(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    const raw = localStorage.getItem(MY_SESSION_IDS_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    const next = [...new Set([...parsed, sessionId])];
    localStorage.setItem(MY_SESSION_IDS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

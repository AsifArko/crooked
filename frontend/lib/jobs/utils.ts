export function extractUrlDomain(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

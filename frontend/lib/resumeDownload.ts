import { getOrCreateSessionId } from "./useSessionId";

export async function downloadResume(): Promise<void> {
  const sessionId = getOrCreateSessionId();
  const res = await fetch("/api/resume/download", {
    headers: { "X-Session-Id": sessionId },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

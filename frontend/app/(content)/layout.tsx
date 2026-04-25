import { SanityLive } from "@/sanity/lib/live";
import { handleError } from "@/app/client-utils";

/**
 * SanityLive only wraps portfolio/content routes—not /studio.
 * Per Sanity docs: "Including SanityLive in your studio route can cause unexpected reloads."
 */
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SanityLive onError={handleError} />
      {children}
    </>
  );
}

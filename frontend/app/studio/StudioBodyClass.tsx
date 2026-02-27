"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const STUDIO_PATH =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH?.trim() || "studio";

export function StudioBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const isStudio =
      pathname?.startsWith("/studio") ||
      pathname === `/${STUDIO_PATH}` ||
      pathname?.startsWith(`/${STUDIO_PATH}/`);

    if (isStudio) {
      document.documentElement.classList.add("studio-full-height");
      document.body.classList.add("studio-full-height");
    } else {
      document.documentElement.classList.remove("studio-full-height");
      document.body.classList.remove("studio-full-height");
    }
    return () => {
      document.documentElement.classList.remove("studio-full-height");
      document.body.classList.remove("studio-full-height");
    };
  }, [pathname]);

  return null;
}

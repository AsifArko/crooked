import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STUDIO_COOKIE = "studio_access";

// Use NEXT_PUBLIC_ so the value is available in Edge middleware (inlined at build time)
const STUDIO_PATH = (
  typeof process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH === "string"
    ? process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH.trim()
    : ""
).replace(/^\/+/, ""); // strip leading slashes
const USE_OBSCURE_PATH = STUDIO_PATH.length > 0 && STUDIO_PATH !== "studio";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If an obscure path is configured, block direct access to /studio (return 404)
  if (USE_OBSCURE_PATH && (pathname === "/studio" || pathname.startsWith("/studio/"))) {
    return new NextResponse(null, { status: 404 });
  }

  // If no obscure path is configured, do not protect (backwards compat)
  if (!USE_OBSCURE_PATH) {
    return NextResponse.next();
  }

  const studioPrefix = `/${STUDIO_PATH}`;
  const isStudioRoute =
    pathname === studioPrefix || pathname.startsWith(`${studioPrefix}/`);

  if (!isStudioRoute) {
    return NextResponse.next();
  }

  // Studio route: require password if SANITY_STUDIO_ACCESS_SECRET is set
  const accessSecret = process.env.SANITY_STUDIO_ACCESS_SECRET;
  if (accessSecret?.trim()) {
    const cookie = request.cookies.get(STUDIO_COOKIE)?.value;
    if (cookie !== accessSecret) {
      const loginUrl = new URL("/studio-login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Rewrite to the internal /studio route so the app still serves from /studio
  const rewritePath =
    pathname === studioPrefix ? "/studio" : `/studio${pathname.slice(studioPrefix.length)}`;
  return NextResponse.rewrite(new URL(rewritePath, request.url));
}

export const config = {
  matcher: [
    /*
     * Run on all pathnames except static assets and API routes.
     * We need to run on the studio path and on /studio to block/rewrite.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

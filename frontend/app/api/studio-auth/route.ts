import { NextResponse } from "next/server";

const STUDIO_COOKIE = "studio_access";
const STUDIO_PATH =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_PATH?.trim() ||
  process.env.SANITY_STUDIO_PATH?.trim() ||
  "studio";

export async function POST(request: Request) {
  const secret = process.env.SANITY_STUDIO_ACCESS_SECRET;
  if (!secret?.trim()) {
    return NextResponse.json(
      { error: "Studio access is not configured." },
      { status: 503 }
    );
  }

  let body: { password?: string; redirect?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = body.password?.trim();
  const redirectPath =
    body.redirect?.trim() && body.redirect.startsWith("/")
      ? body.redirect
      : `/${STUDIO_PATH}`;

  if (password !== secret) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({
    redirect: redirectPath,
  });
  res.cookies.set(STUDIO_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

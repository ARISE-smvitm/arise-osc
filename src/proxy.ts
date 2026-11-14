import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Presence check only — keeps the proxy light. Real verification (and the
// ADMIN role check for /newsroom/new) happens server-side in getSessionUser()
// inside the page/route, so a forged or expired cookie never grants access.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = Boolean(request.cookies.get("arise_session")?.value);
  if (!hasSession) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/newsroom/new"] };

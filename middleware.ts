import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({ req: request });
  if (!token) return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url));
  if ((pathname.startsWith("/admin") || pathname === "/newsroom/new") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/newsroom/new"] };

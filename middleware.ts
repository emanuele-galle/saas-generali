import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/api/contact", "/api/health", "/api/vcard", "/api/auth", "/robots.txt", "/sitemap.xml"];

// Main app hostname - requests from other hosts are treated as custom domains
const APP_HOSTNAME = process.env.NEXT_PUBLIC_APP_HOSTNAME ?? "localhost";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host")?.split(":")[0] ?? "";

  // Custom domain routing: if host is not the main app domain and not localhost,
  // rewrite to the landing page resolver which will look up the domain in DB
  if (
    hostname !== APP_HOSTNAME &&
    hostname !== "localhost" &&
    !hostname.endsWith(".fodivps1.cloud")
  ) {
    // Rewrite to a special route that resolves custom domains
    // The [slug] page will handle domain lookup
    const url = req.nextUrl.clone();
    url.pathname = `/domain/${hostname}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Allow public API paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow landing page routes (single slug, public)
  if (pathname.match(/^\/[a-z0-9-]+$/) && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow tRPC routes (auth handled by tRPC procedures)
  if (pathname.startsWith("/api/trpc")) {
    return NextResponse.next();
  }

  // Check for auth session token (NextAuth JWT cookie)
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists - allow through (role checks done in tRPC/server components)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|fonts|uploads).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { verifySessionTokenEdge } from "@/lib/auth-jwt-edge";
import { ROUTES } from "@/lib/routes";

function buildApiCorsHeaders(request: NextRequest): Headers {
  const origin = request.headers.get("origin");
  const raw =
    process.env.MOBILE_APP_ORIGINS ??
    "http://localhost:5173,http://127.0.0.1:5173";
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const headers = new Headers();
  if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return headers;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const cors = buildApiCorsHeaders(request);
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: cors });
    }
    const res = NextResponse.next();
    cors.forEach((value, key) => {
      res.headers.set(key, value);
    });
    return res;
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionTokenEdge(token) : null;

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = ROUTES.roleLogin;
      url.searchParams.set("next", pathname);
      url.searchParams.set("tab", "admin");
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/customer")) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.roleLogin;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/api/:path*"],
};

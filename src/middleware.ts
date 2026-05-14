import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { verifySessionTokenEdge } from "@/lib/auth-jwt-edge";
import { ROUTES } from "@/lib/routes";

function isDevTrustedOrigin(origin: string): boolean {
  if (origin.startsWith("exp://")) return true;
  try {
    const u = new URL(origin);
    if (u.protocol === "exp:") return true;
    const host = u.hostname;
    if (host === "localhost" || host === "127.0.0.1") return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
    if (/^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  } catch {
    return false;
  }
  return false;
}

function buildApiCorsHeaders(request: NextRequest): Headers {
  const origin = request.headers.get("origin");
  const raw =
    process.env.MOBILE_APP_ORIGINS ??
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006,http://127.0.0.1:19006";
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const headers = new Headers();
  let allowOrigin: string | null = null;
  if (origin) {
    if (allowed.includes(origin)) {
      allowOrigin = origin;
    } else if (process.env.NODE_ENV === "development" && isDevTrustedOrigin(origin)) {
      allowOrigin = origin;
    }
  }
  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return headers;
}

function redirectToLogin(request: NextRequest, tab: "admin" | "customer") {
  const url = request.nextUrl.clone();
  const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = ROUTES.roleLogin;
  url.searchParams.set("next", next);
  url.searchParams.set("tab", tab);
  return NextResponse.redirect(url);
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
      return redirectToLogin(request, "admin");
    }
  }

  if (pathname.startsWith("/customer")) {
    if (!session || session.role !== "CUSTOMER") {
      return redirectToLogin(request, "customer");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/api/:path*"],
};

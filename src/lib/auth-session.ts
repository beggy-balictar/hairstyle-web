import { cookies, headers } from "next/headers";
import type { UserRole } from "@prisma/client";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth-constants";
import type { SessionPayload } from "@/lib/auth-jwt";
import { signSessionToken, verifySessionToken } from "@/lib/auth-jwt";
import { prisma } from "@/lib/db";

export type { SessionPayload };

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getVerifiedSessionFromCookies(role: UserRole): Promise<SessionPayload | null> {
  const session = await getSessionFromCookies();
  if (!session || session.role !== role) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, status: true },
  });

  if (!user || user.role !== role || user.status !== "ACTIVE") {
    return null;
  }

  return session;
}

/**
 * Resolves session for API routes.
 * Bearer token is checked before cookies so a browser admin `stylehair_session` cookie
 * cannot override a customer's `Authorization: Bearer` token on the same request.
 */
export async function getSessionFromIncomingRequest(
  request?: Request,
): Promise<SessionPayload | null> {
  const tryBearer = async (raw: string | null) => {
    if (!raw?.startsWith("Bearer ")) return null;
    return verifySessionToken(raw.slice(7));
  };

  if (request) {
    const fromReq = await tryBearer(request.headers.get("authorization"));
    if (fromReq) return fromReq;
  }

  const fromHeader = await tryBearer(headers().get("authorization"));
  if (fromHeader) return fromHeader;

  return getSessionFromCookies();
}

/** @deprecated Use getSessionFromIncomingRequest — kept for any external imports */
export async function getSessionFromRequest(): Promise<SessionPayload | null> {
  return getSessionFromIncomingRequest();
}

export { signSessionToken, verifySessionToken };

export function sessionCookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

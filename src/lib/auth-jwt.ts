import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { SESSION_MAX_AGE_SEC } from "@/lib/auth-constants";

export type SessionPayload = {
  sub: string;
  role: UserRole;
};

function getSecretBytes() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV !== "production") {
    return new TextEncoder().encode("local-dev-auth-secret-change-me-32c");
  }
  throw new Error("AUTH_SECRET must be set and at least 32 characters long in production.");
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SEC}s`)
    .sign(getSecretBytes());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretBytes());
    const sub = payload.sub;
    const role = payload.role as UserRole | undefined;
    if (!sub || (role !== "ADMIN" && role !== "CUSTOMER")) {
      return null;
    }
    return { sub, role };
  } catch {
    return null;
  }
}

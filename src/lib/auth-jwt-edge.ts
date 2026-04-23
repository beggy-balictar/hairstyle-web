import type { UserRole } from "@prisma/client";

type SessionPayload = {
  sub: string;
  role: UserRole;
};

function getSecretString() {
  const secret = process.env.AUTH_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "local-dev-auth-secret-change-me-32c";
  }
  return null;
}

function base64UrlToBytes(input: string) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * HS256 verify compatible with tokens issued by `jose` SignJWT (middleware runs on Edge; avoid importing `jose` there).
 */
export async function verifySessionTokenEdge(token: string): Promise<SessionPayload | null> {
  const secret = getSecretString();
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h64, p64, s64] = parts;

  let payloadJson: { sub?: string; role?: string; exp?: number };
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(p64));
    payloadJson = JSON.parse(json) as { sub?: string; role?: string; exp?: number };
  } catch {
    return null;
  }

  if (typeof payloadJson.exp === "number" && payloadJson.exp * 1000 < Date.now()) {
    return null;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const data = new TextEncoder().encode(`${h64}.${p64}`);
  const signature = base64UrlToBytes(s64);

  let valid = false;
  try {
    valid = await crypto.subtle.verify("HMAC", key, signature, data);
  } catch {
    return null;
  }
  if (!valid) return null;

  const sub = payloadJson.sub;
  const role = payloadJson.role as UserRole | undefined;
  if (!sub || (role !== "ADMIN" && role !== "CUSTOMER")) {
    return null;
  }
  return { sub, role };
}

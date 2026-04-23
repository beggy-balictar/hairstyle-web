import type { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSessionFromIncomingRequest } from "@/lib/auth-session";

export async function requireRole(role: UserRole, request?: Request) {
  const session = await getSessionFromIncomingRequest(request);
  if (!session || session.role !== role) {
    return { session: null as null, error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
  return { session, error: null as null };
}

export async function requireCustomerSession(request?: Request) {
  return requireRole("CUSTOMER", request);
}

export async function requireAdminSession(request?: Request) {
  return requireRole("ADMIN", request);
}

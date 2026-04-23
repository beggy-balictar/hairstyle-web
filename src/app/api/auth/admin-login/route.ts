import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { sessionCookieOptions, signSessionToken } from "@/lib/auth-session";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { validateEmail } from "@/lib/validators";
import { prismaErrorToResponse } from "@/lib/prisma-errors";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!password) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }
  if (!email.endsWith("@stylehair.com")) {
    return NextResponse.json({ error: "Admin sign-in requires an @stylehair.com email address." }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }
    if (user.status !== UserStatus.ACTIVE) {
      return NextResponse.json({ error: "This account is not active." }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const token = await signSessionToken({ sub: user.id, role: UserRole.ADMIN });
    const res = NextResponse.json({ ok: true, userId: user.id });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Admin sign-in failed unexpectedly." }, { status: 500 });
  }
}

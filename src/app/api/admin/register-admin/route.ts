import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireAdminSession } from "@/lib/require-session";
import { validateEmail, validatePassword } from "@/lib/validators";

function isStylehairAdminEmail(email: string) {
  return /^[^\s@]+@stylehair\.com$/i.test(email);
}

export async function POST(request: Request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  let body: { email?: string; password?: string; confirmPassword?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string; confirmPassword?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!isStylehairAdminEmail(email)) {
    return NextResponse.json({ error: "Admin email must use an @stylehair.com address." }, { status: 400 });
  }
  if (!validatePassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters and include uppercase, lowercase, and a number." },
      { status: 400 },
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    return NextResponse.json({ ok: true, message: "Administrator account created." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not create administrator account." }, { status: 500 });
  }
}

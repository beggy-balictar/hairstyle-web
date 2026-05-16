import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { validateEmail, validateLettersOnlyName, validatePassword } from "@/lib/validators";

function isStylehairAdminEmail(email: string) {
  return /^[^\s@]+@stylehair\.com$/i.test(email);
}

export async function POST(request: Request) {
  let body: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  try {
    body = (await request.json()) as {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const middleName = body.middleName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!validateLettersOnlyName(firstName)) {
    return NextResponse.json({ error: "First name must contain letters only." }, { status: 400 });
  }
  if (!validateLettersOnlyName(middleName)) {
    return NextResponse.json({ error: "Middle name must contain letters only." }, { status: 400 });
  }
  if (!validateLettersOnlyName(lastName)) {
    return NextResponse.json({ error: "Last name must contain letters only." }, { status: 400 });
  }
  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!isStylehairAdminEmail(email)) {
    return NextResponse.json({ error: "Admin email must use an @stylehair.com address (e.g. your.name@stylehair.com)." }, { status: 400 });
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
    const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
    if (adminCount > 0) {
      return NextResponse.json({ error: "An administrator account already exists. Sign in at the admin tab." }, { status: 403 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "This email is already registered. Use a different @stylehair.com address." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        adminProfile: {
          create: {
            firstName,
            middleName,
            lastName,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, message: "Administrator account created. You can sign in now." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not create administrator account." }, { status: 500 });
  }
}

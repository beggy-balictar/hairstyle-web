import { NextResponse } from "next/server";
import { GenderOption, HairstyleCatalogPreference, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { validateEmail, validatePassword } from "@/lib/validators";

type Body = {
  fullName?: string;
  email?: string;
  password?: string;
};

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "Customer", lastName: "-" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/**
 * Minimal registration for the mobile customer app (full name only).
 * Profile can be completed later in-app or via admin tools.
 */
export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!fullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }
  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!validatePassword(password)) {
    return NextResponse.json(
      {
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      },
      { status: 400 },
    );
  }

  const { firstName, lastName } = splitFullName(fullName);

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    let passwordHash: string;
    try {
      passwordHash = await hashPassword(password);
    } catch (hashErr) {
      console.error("[register-customer-app] hashPassword failed:", hashErr);
      return NextResponse.json(
        { error: "Could not process the password (server hashing failed). Check the Next.js terminal." },
        { status: 500 },
      );
    }

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        customerProfile: {
          create: {
            firstName,
            lastName,
            birthDate: new Date("1990-01-01"),
            gender: GenderOption.PREFER_NOT_TO_SAY,
            hairstyleCatalogPreference: HairstyleCatalogPreference.ALL,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, message: "Account created. You can sign in now." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error("[register-customer-app]", e);
    const devDetail =
      process.env.NODE_ENV === "development" && e instanceof Error ? ` ${e.message}` : "";
    return NextResponse.json(
      { error: `Registration failed unexpectedly.${devDetail}`.trim() },
      { status: 500 },
    );
  }
}

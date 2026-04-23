import { NextResponse } from "next/server";
import { GenderOption, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { validateEmail, validatePassword, validatePhone } from "@/lib/validators";

type Body = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
};

function mapGender(value: string): GenderOption | null {
  if (value === "male") return GenderOption.MALE;
  if (value === "female") return GenderOption.FEMALE;
  if (value === "prefer_not_to_say") return GenderOption.PREFER_NOT_TO_SAY;
  return null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() ?? "";
  const lastName = body.lastName?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const phone = body.phone?.trim() || undefined;
  const birthDateRaw = body.birthDate;
  const gender = body.gender ? mapGender(body.gender) : null;

  if (!firstName) return NextResponse.json({ error: "First name is required." }, { status: 400 });
  if (!lastName) return NextResponse.json({ error: "Last name is required." }, { status: 400 });
  if (!validateEmail(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!validatePassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters and include uppercase, lowercase, and a number." },
      { status: 400 },
    );
  }
  if (phone && !validatePhone(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }
  if (!birthDateRaw) return NextResponse.json({ error: "Birth date is required." }, { status: 400 });
  if (!gender) return NextResponse.json({ error: "Select a valid gender option." }, { status: 400 });

  const birthDate = new Date(birthDateRaw);
  if (Number.isNaN(birthDate.getTime())) {
    return NextResponse.json({ error: "Birth date is invalid." }, { status: 400 });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

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
            phone,
            birthDate,
            gender,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, message: "Account created. You can sign in now." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Registration failed unexpectedly." }, { status: 500 });
  }
}

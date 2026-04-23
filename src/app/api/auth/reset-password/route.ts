import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { validatePassword } from "@/lib/validators";

type Body = {
  token?: string;
  password?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const token = body.token?.trim() ?? "";
  const password = body.password ?? "";

  if (!token) {
    return NextResponse.json({ error: "Reset code is required." }, { status: 400 });
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

  try {
    const row = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!row || row.usedAt || row.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This reset code is invalid or has expired. Request a new one." },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: row.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: row.userId },
      }),
    ]);

    return NextResponse.json({ ok: true, message: "Your password has been updated. You can sign in now." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not reset password." }, { status: 500 });
  }
}

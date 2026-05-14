import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireAdminSession } from "@/lib/require-session";
import { validatePassword } from "@/lib/validators";

export async function POST(request: Request) {
  const { session, error } = await requireAdminSession(request);
  if (error || !session) return error;

  let body: { currentPassword?: string; newPassword?: string; confirmPassword?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const currentPassword = body.currentPassword ?? "";
  const newPassword = body.newPassword ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!currentPassword) {
    return NextResponse.json({ error: "Current password is required." }, { status: 400 });
  }
  if (!newPassword) {
    return NextResponse.json({ error: "New password is required." }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "New password and confirmation do not match." }, { status: 400 });
  }
  if (!validatePassword(newPassword)) {
    return NextResponse.json(
      {
        error: "New password must be at least 8 characters and include uppercase, lowercase, and a number.",
      },
      { status: 400 },
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json({ error: "New password must be different from your current password." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return NextResponse.json({ ok: true, message: "Your password has been updated." });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not update password." }, { status: 500 });
  }
}

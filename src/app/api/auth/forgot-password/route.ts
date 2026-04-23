import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { UserRole, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { validateEmail } from "@/lib/validators";
import { prismaErrorToResponse } from "@/lib/prisma-errors";

const RESET_TTL_MS = 60 * 60 * 1000;

/** Shown when the email is not registered (same text as success to avoid account enumeration). */
const GENERIC_OK_MESSAGE =
  "If an account exists for this email, password reset instructions will be sent when email is enabled on the server.";

/**
 * Creates a one-time reset token for active customers.
 *
 * Email is NOT sent automatically — there is no SMTP/SendGrid/etc. hook yet.
 * - Development: set env `PASSWORD_RESET_RETURN_TOKEN=1` to return `resetToken` in this JSON
 *   so the mobile app can show the code (see forgot-password UI).
 * - Production: integrate an email provider here, send a link like
 *   `${APP_ORIGIN}/reset-password?token=...`, and do not return the token in the response body.
 */
export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const exposeToken = process.env.PASSWORD_RESET_RETURN_TOKEN === "1";

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const isCustomer =
      user &&
      user.role === UserRole.CUSTOMER &&
      user.status === UserStatus.ACTIVE;

    if (!isCustomer) {
      return NextResponse.json({
        ok: true,
        message: GENERIC_OK_MESSAGE,
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id, usedAt: null },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    const noEmailConfigured =
      "Password reset is ready on the server, but outbound email is not configured yet, so nothing was sent to your inbox. " +
      "For local testing, set environment variable PASSWORD_RESET_RETURN_TOKEN=1 on the Next.js server, submit again, and the app will show a reset code.";

    const payload: { ok: true; message: string; resetToken?: string } = {
      ok: true,
      message: exposeToken
        ? "Use the reset code below to choose a new password. (Token is only returned because PASSWORD_RESET_RETURN_TOKEN=1 — do not use in production.)"
        : noEmailConfigured,
    };
    if (exposeToken) {
      payload.resetToken = token;
    }

    return NextResponse.json(payload);
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not start password reset." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireAdminSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        adminProfile: {
          select: { firstName: true, middleName: true, lastName: true },
        },
        customerProfile: {
          select: { firstName: true, lastName: true, phone: true },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAdminSession(request);
  if (error || !session) return error;

  let body: { userId?: string };
  try {
    body = (await request.json()) as { userId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const userId = body.userId?.trim();
  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (target.id === session.sub) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    if (target.role === "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the last admin account." }, { status: 400 });
      }
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      include: { hairstyle: true },
    });
    return NextResponse.json({ favorites });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let body: { hairstyleId?: string };
  try {
    body = (await request.json()) as { hairstyleId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hairstyleId = body.hairstyleId?.trim();
  if (!hairstyleId) {
    return NextResponse.json({ error: "hairstyleId is required." }, { status: 400 });
  }

  try {
    const style = await prisma.hairstyle.findFirst({
      where: { id: hairstyleId, isActive: true },
    });
    if (!style) {
      return NextResponse.json({ error: "Hairstyle not found." }, { status: 404 });
    }

    try {
      await prisma.favorite.create({
        data: {
          userId: session.sub,
          hairstyleId,
        },
      });
      return NextResponse.json({ ok: true, created: true });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        return NextResponse.json({ ok: true, created: false, already: true });
      }
      throw e;
    }
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

export async function DELETE(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  const url = new URL(request.url);
  const hairstyleId = url.searchParams.get("hairstyleId")?.trim();
  if (!hairstyleId) {
    return NextResponse.json({ error: "hairstyleId query parameter is required." }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: { userId: session.sub, hairstyleId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

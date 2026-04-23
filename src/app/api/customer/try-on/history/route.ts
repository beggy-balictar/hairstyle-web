import { NextResponse } from "next/server";
import { UploadType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

type PostBody = {
  hairstyleId?: string;
  faceUploadId?: string | null;
  source?: string;
  clientLatencyMs?: number | null;
  feedbackRating?: number | null;
  feedbackNote?: string | null;
};

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const rows = await prisma.tryOnHistory.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        hairstyle: {
          select: { id: true, name: true, sampleImageUrl: true, genderTag: true },
        },
      },
    });
    return NextResponse.json({ history: rows });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const hairstyleId = body.hairstyleId?.trim();
  if (!hairstyleId) {
    return NextResponse.json({ error: "hairstyleId is required." }, { status: 400 });
  }

  const sourceRaw = (body.source ?? "CAMERA").toUpperCase();
  const source = sourceRaw === "UPLOAD" ? UploadType.UPLOAD : UploadType.CAMERA;

  const latency =
    typeof body.clientLatencyMs === "number" && Number.isFinite(body.clientLatencyMs)
      ? Math.max(0, Math.floor(body.clientLatencyMs))
      : null;

  let feedbackRating: number | null = null;
  if (typeof body.feedbackRating === "number" && Number.isInteger(body.feedbackRating)) {
    if (body.feedbackRating >= 1 && body.feedbackRating <= 5) {
      feedbackRating = body.feedbackRating;
    }
  }

  const feedbackNote =
    typeof body.feedbackNote === "string" && body.feedbackNote.trim()
      ? body.feedbackNote.trim().slice(0, 2000)
      : null;

  const faceUploadId =
    typeof body.faceUploadId === "string" && body.faceUploadId.trim() ? body.faceUploadId.trim() : null;

  try {
    const style = await prisma.hairstyle.findFirst({
      where: { id: hairstyleId, isActive: true },
    });
    if (!style) {
      return NextResponse.json({ error: "Hairstyle not found." }, { status: 404 });
    }

    if (faceUploadId) {
      const up = await prisma.faceUpload.findFirst({
        where: { id: faceUploadId, userId: session.sub },
      });
      if (!up) {
        return NextResponse.json({ error: "Face upload not found." }, { status: 404 });
      }
    }

    const row = await prisma.tryOnHistory.create({
      data: {
        userId: session.sub,
        hairstyleId,
        faceUploadId,
        source,
        clientLatencyMs: latency,
        feedbackRating,
        feedbackNote,
      },
    });

    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not save try-on history." }, { status: 500 });
  }
}

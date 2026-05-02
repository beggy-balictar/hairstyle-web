import "@/lib/load-env";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateHairstylePreviewImage, readPublicImageAsBase64 } from "@/lib/gemini-hairstyle-preview";
import { assertHairstylePreviewAllowed, recordHairstylePreviewSuccess } from "@/lib/hairstyle-preview-limits";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  faceUploadId?: string;
  hairstyleName?: string;
  hairstyleDescription?: string | null;
  referenceImageUrl?: string | null;
};

function toAbsoluteAssetUrl(request: Request, imageUrl: string): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "http";
  if (!host) return imageUrl;
  return `${proto}://${host}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  const geminiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  if (!geminiKey) {
    return NextResponse.json(
      {
        error: "AI hairstyle preview is not enabled. Set GEMINI_API_KEY in hairstyle-web .env (or .env.local) and restart the server.",
        code: "GEMINI_DISABLED",
      },
      { status: 503 },
    );
  }
  if (geminiKey.startsWith("http://") || geminiKey.startsWith("https://")) {
    return NextResponse.json(
      {
        error:
          "GEMINI_API_KEY must be the secret key string (usually starts with AIza…), not a website URL. In Google AI Studio open API keys → Create or select a key → Copy and paste that value.",
        code: "GEMINI_BAD_FORMAT",
      },
      { status: 400 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const faceUploadId = body.faceUploadId?.trim();
  const hairstyleName = body.hairstyleName?.trim();
  if (!faceUploadId || !hairstyleName) {
    return NextResponse.json({ error: "faceUploadId and hairstyleName are required." }, { status: 400 });
  }

  const limitCheck = await assertHairstylePreviewAllowed(session.sub);
  if (!limitCheck.ok) {
    const headers: Record<string, string> = {};
    if (limitCheck.code === "PREVIEW_COOLDOWN") {
      headers["Retry-After"] = String(limitCheck.retryAfterSec);
    }
    return NextResponse.json(
      {
        error: limitCheck.message,
        code: limitCheck.code,
        ...(limitCheck.code === "PREVIEW_COOLDOWN"
          ? { retryAfterSec: limitCheck.retryAfterSec }
          : { limit: limitCheck.limit, used: limitCheck.used }),
      },
      { status: limitCheck.status, headers },
    );
  }

  try {
    const upload = await prisma.faceUpload.findFirst({
      where: { id: faceUploadId, userId: session.sub },
    });
    if (!upload) {
      return NextResponse.json({ error: "Face upload not found." }, { status: 404 });
    }

    const { base64, mimeType } = await readPublicImageAsBase64(upload.imageUrl);

    const latestAnalysis = await prisma.faceAnalysis.findUnique({
      where: { faceUploadId: upload.id },
      select: { faceShape: true },
    });
    const faceShape = latestAnalysis?.faceShape || "oval";
    const matchScore = 92;

    const { pngBuffer, model, note } = await generateHairstylePreviewImage({
      faceImageBase64: base64,
      faceMimeType: mimeType,
      faceShape,
      hairstyleName,
      matchScore,
      hairstyleDescription: body.hairstyleDescription ?? null,
      referenceImageUrl: body.referenceImageUrl ?? null,
    });

    const dir = path.join(process.cwd(), "public", "uploads", "generated");
    await mkdir(dir, { recursive: true });
    const filename = `${session.sub}-${randomUUID()}.png`;
    const diskPath = path.join(dir, filename);
    await writeFile(diskPath, pngBuffer);

    await recordHairstylePreviewSuccess(session.sub);

    const imageUrl = `/uploads/generated/${filename}`;
    const imageAbsoluteUrl = toAbsoluteAssetUrl(request, imageUrl);
    return NextResponse.json({ imageUrl, imageAbsoluteUrl, model, note: note ?? null });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error("[hairstyle-preview]", e);
    const message = e instanceof Error ? e.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";
import { scoreHairstyles } from "@/lib/recommendation-engine";
import { FACE_SHAPES } from "@/types/face-shape";
import { HAIR_LENGTHS } from "@/types/hair-length";
import { HAIR_TYPES } from "@/types/hair-type";
import type { FaceShapeAnalysis } from "@/types/face-shape";
import type { HairLengthAnalysis } from "@/types/hair-length";
import type { HairTypeAnalysis } from "@/types/hair-type";

type Body = {
  faceUploadId?: string;
  faceShape?: FaceShapeAnalysis;
  hairType?: HairTypeAnalysis;
  hairLength?: HairLengthAnalysis;
};

function isFaceShape(v: string): v is (typeof FACE_SHAPES)[number] {
  return (FACE_SHAPES as readonly string[]).includes(v);
}

function isHairType(v: string): v is (typeof HAIR_TYPES)[number] {
  return (HAIR_TYPES as readonly string[]).includes(v);
}

function isHairLength(v: string): v is (typeof HAIR_LENGTHS)[number] {
  return (HAIR_LENGTHS as readonly string[]).includes(v);
}

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const faceUploadId = body.faceUploadId;
  const faceShape = body.faceShape;
  const hairType = body.hairType;
  const hairLength = body.hairLength;

  if (!faceUploadId || !faceShape || !hairType || !hairLength) {
    return NextResponse.json({ error: "faceUploadId, faceShape, hairType, and hairLength are required." }, { status: 400 });
  }

  if (!isFaceShape(faceShape.shape) || !isHairType(hairType.type) || !isHairLength(hairLength.length)) {
    return NextResponse.json({ error: "Invalid shape, hair type, or hair length value." }, { status: 400 });
  }

  try {
    const upload = await prisma.faceUpload.findFirst({
      where: { id: faceUploadId, userId: session.sub },
    });
    if (!upload) {
      return NextResponse.json({ error: "Face upload not found." }, { status: 404 });
    }

    const existingAnalysis = await prisma.faceAnalysis.findUnique({
      where: { faceUploadId: upload.id },
    });
    if (existingAnalysis) {
      return NextResponse.json(
        { error: "This photo was already analyzed. Upload a new image to run another recommendation pass." },
        { status: 409 },
      );
    }

    const rawResultJson = {
      faceShape,
      hairType,
      hairLength,
      generatedAt: new Date().toISOString(),
    };

    const hairstyles = await prisma.hairstyle.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    const scored = scoreHairstyles(hairstyles, faceShape.shape, hairType.type, hairLength.length).slice(0, 8);

    const result = await prisma.$transaction(async (tx) => {
      const analysis = await tx.faceAnalysis.create({
        data: {
          userId: session.sub,
          faceUploadId: upload.id,
          faceShape: faceShape.shape,
          confidenceScore: faceShape.confidence,
          rawResultJson,
        },
      });

      const recommendation = await tx.recommendation.create({
        data: {
          userId: session.sub,
          faceAnalysisId: analysis.id,
        },
      });

      await tx.recommendationItem.createMany({
        data: scored.map((row, index) => ({
          recommendationId: recommendation.id,
          hairstyleId: row.hairstyle.id,
          rank: index + 1,
          score: row.score,
          reason: row.reason,
          previewImageUrl: row.hairstyle.sampleImageUrl ?? upload.imageUrl,
        })),
      });

      const items = await tx.recommendationItem.findMany({
        where: { recommendationId: recommendation.id },
        orderBy: { rank: "asc" },
        include: { hairstyle: true },
      });

      return { analysis, recommendation, items };
    }, { maxWait: 10000, timeout: 20000 });

    return NextResponse.json({
      analysisId: result.analysis.id,
      recommendationId: result.recommendation.id,
      faceShape: faceShape.shape,
      hairType: hairType.type,
      hairLength: hairLength.length,
      items: result.items.map((item) => ({
        id: item.id,
        rank: item.rank,
        score: item.score,
        reason: item.reason,
        previewImageUrl: item.previewImageUrl,
        hairstyle: item.hairstyle,
      })),
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Analysis save failed." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const [favoriteCount, analysisCount, ratingCount, lastAnalysis] = await Promise.all([
      prisma.favorite.count({ where: { userId: session.sub } }),
      prisma.faceAnalysis.count({ where: { userId: session.sub } }),
      prisma.satisfaction.count({ where: { userId: session.sub } }),
      prisma.faceAnalysis.findFirst({
        where: { userId: session.sub },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    return NextResponse.json({
      favoriteCount,
      analysisCount,
      ratingCount,
      lastAnalysisAt: lastAnalysis?.createdAt ?? null,
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

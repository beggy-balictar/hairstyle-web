import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const analyses = await prisma.faceAnalysis.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        faceShape: true,
        confidenceScore: true,
        createdAt: true,
        faceUpload: { select: { imageUrl: true } },
      },
    });

    return NextResponse.json({ analyses });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not load history." }, { status: 500 });
  }
}

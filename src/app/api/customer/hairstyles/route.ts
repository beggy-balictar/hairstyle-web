import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

/** Active catalog for live try-on overlays and previews (customer-authenticated). */
export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const rows = await prisma.hairstyle.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        genderTag: true,
        sampleImageUrl: true,
        suitableFaceShapes: true,
      },
    });
    return NextResponse.json({ hairstyles: rows });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not load catalog." }, { status: 500 });
  }
}

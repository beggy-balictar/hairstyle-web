import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireAdminSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const rows = await prisma.hairstyle.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ hairstyles: rows });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Failed to load hairstyles." }, { status: 500 });
  }
}

type PostBody = {
  name?: string;
  description?: string;
  category?: string;
  maintenanceLevel?: string;
  sampleImageUrl?: string;
  suitableFaceShapes?: string[];
  genderTag?: string;
  isActive?: boolean;
};

export async function POST(request: Request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const shapes = Array.isArray(body.suitableFaceShapes)
    ? body.suitableFaceShapes.map((s) => String(s).toLowerCase().trim()).filter(Boolean)
    : [];

  try {
    const created = await prisma.hairstyle.create({
      data: {
        name,
        description: body.description?.trim() || null,
        category: body.category?.trim() || null,
        maintenanceLevel: body.maintenanceLevel?.trim() || null,
        sampleImageUrl: body.sampleImageUrl?.trim() || null,
        suitableFaceShapes: shapes.length ? shapes : undefined,
        genderTag: body.genderTag?.trim() || null,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ hairstyle: created });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not create hairstyle." }, { status: 500 });
  }
}

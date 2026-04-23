import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";

export async function GET() {
  try {
    const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
    return NextResponse.json({ needsSetup: adminCount === 0, adminCount });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    return NextResponse.json({ error: "Could not check setup status." }, { status: 500 });
  }
}

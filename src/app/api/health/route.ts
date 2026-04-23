import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * No auth. Use from the Flutter app ("Test API connection").
 * Always returns 200 so mobile clients can read JSON without treating it as a transport error.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      ok: true,
      service: "hairstyle-web",
      database: "reachable",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[api/health] database check failed:", e);
    return NextResponse.json({
      ok: false,
      service: "hairstyle-web",
      database: "unreachable",
      error: message,
      hint:
        "Set DATABASE_URL in hairstyle-web/.env.local, start PostgreSQL, then run: npx prisma db push",
    });
  }
}

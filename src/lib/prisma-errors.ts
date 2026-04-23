import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const DB_SETUP_MESSAGE =
  "Database is not configured or unreachable. Create .env.local with DATABASE_URL (PostgreSQL), run npx prisma db push, npm run db:seed, then restart npm run dev.";

export function prismaErrorToResponse(error: unknown): NextResponse | null {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return NextResponse.json({ error: DB_SETUP_MESSAGE }, { status: 503 });
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P1001") {
      return NextResponse.json(
        { error: "Cannot reach PostgreSQL. Check DATABASE_URL and that the database server is running." },
        { status: 503 },
      );
    }
  }
  if (error instanceof Error && error.message.includes("Environment variable not found: DATABASE_URL")) {
    return NextResponse.json({ error: DB_SETUP_MESSAGE }, { status: 503 });
  }
  return null;
}

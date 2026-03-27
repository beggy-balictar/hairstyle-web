import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Hairstyle catalog endpoint scaffolded. Add CRUD handlers and PostgreSQL access here.",
    },
    { status: 501 }
  );
}

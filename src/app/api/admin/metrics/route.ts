import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Admin metrics endpoint scaffolded. Add total user count and average satisfaction aggregation here.",
    },
    { status: 501 }
  );
}

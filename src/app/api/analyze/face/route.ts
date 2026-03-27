import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Face analysis endpoint scaffolded. Add AI model request, recommendation scoring, and preview generation here.",
    },
    { status: 501 }
  );
}

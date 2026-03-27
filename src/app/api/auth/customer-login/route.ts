import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Customer login endpoint scaffolded. Add credential verification and session creation here.",
    },
    { status: 501 }
  );
}

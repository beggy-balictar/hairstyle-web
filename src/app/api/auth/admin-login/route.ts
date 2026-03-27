import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Admin login endpoint scaffolded. Add role validation and secure session creation here.",
    },
    { status: 501 }
  );
}

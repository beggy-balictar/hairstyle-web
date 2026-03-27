import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Face upload endpoint scaffolded. Add file validation, storage upload, and database persistence here.",
    },
    { status: 501 }
  );
}

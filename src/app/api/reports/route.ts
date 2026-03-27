import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Customer report endpoint scaffolded. Add report validation and persistence here.",
    },
    { status: 501 }
  );
}

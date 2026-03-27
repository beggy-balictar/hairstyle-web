import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message: "Registration endpoint scaffolded. Add validation, password hashing, and PostgreSQL persistence here.",
    },
    { status: 501 }
  );
}

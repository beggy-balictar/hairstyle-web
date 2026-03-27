import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Admin users endpoint scaffolded. Connect this route to Prisma user queries and filters.",
    },
    { status: 501 }
  );
}

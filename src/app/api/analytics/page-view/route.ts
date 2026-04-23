import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth-session";
import { prismaErrorToResponse } from "@/lib/prisma-errors";

export async function POST(request: Request) {
  let body: { path?: string };
  try {
    body = (await request.json()) as { path?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const path = String(body.path ?? "")
    .trim()
    .slice(0, 400);
  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "path must start with /." }, { status: 400 });
  }

  try {
    const session = await getSessionFromCookies();
    const userId = session?.role === "CUSTOMER" ? session.sub : null;

    await prisma.pageView.create({
      data: {
        path,
        userId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not record view." }, { status: 500 });
  }
}

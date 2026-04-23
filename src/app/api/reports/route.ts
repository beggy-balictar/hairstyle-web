import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

const MAX_LEN = 4000;

export async function POST(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let body: { message?: string };
  try {
    body = (await request.json()) as { message?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim() ?? "";
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_LEN) {
    return NextResponse.json({ error: `Message must be at most ${MAX_LEN} characters.` }, { status: 400 });
  }

  try {
    await prisma.customerReport.create({
      data: {
        userId: session.sub,
        message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not save report." }, { status: 500 });
  }
}

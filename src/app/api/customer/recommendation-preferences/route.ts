import { NextResponse } from "next/server";
import type { HairstyleCatalogPreference } from "@prisma/client";
import { GenderOption } from "@prisma/client";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireCustomerSession } from "@/lib/require-session";

const ALLOWED: HairstyleCatalogPreference[] = ["MENS", "WOMENS", "ALL"];

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const profile = await prisma.customerProfile.findUnique({
      where: { userId: session.sub },
      select: { hairstyleCatalogPreference: true },
    });
    return NextResponse.json({
      hairstyleCatalogPreference: profile?.hairstyleCatalogPreference ?? "ALL",
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

export async function PATCH(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  let body: { hairstyleCatalogPreference?: string };
  try {
    body = (await request.json()) as { hairstyleCatalogPreference?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const pref = body.hairstyleCatalogPreference as HairstyleCatalogPreference | undefined;
  if (!pref || !ALLOWED.includes(pref)) {
    return NextResponse.json(
      { error: "hairstyleCatalogPreference must be MENS, WOMENS, or ALL." },
      { status: 400 },
    );
  }

  try {
    await prisma.customerProfile.upsert({
      where: { userId: session.sub },
      create: {
        userId: session.sub,
        firstName: "Customer",
        lastName: "-",
        birthDate: new Date("1990-01-01"),
        gender: GenderOption.PREFER_NOT_TO_SAY,
        hairstyleCatalogPreference: pref,
      },
      update: { hairstyleCatalogPreference: pref },
    });
    return NextResponse.json({ ok: true, hairstyleCatalogPreference: pref });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Could not update preferences." }, { status: 500 });
  }
}

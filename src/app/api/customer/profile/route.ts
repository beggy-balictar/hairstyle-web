import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { buildCustomerDisplayName } from "@/lib/customer-display-name";
import { requireCustomerSession } from "@/lib/require-session";

export async function GET(request: Request) {
  const { session, error } = await requireCustomerSession(request);
  if (error) return error;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.sub },
      select: {
        email: true,
        customerProfile: { select: { firstName: true, lastName: true } },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const displayName = buildCustomerDisplayName(user.email, user.customerProfile);

    return NextResponse.json({
      email: user.email,
      displayName,
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    throw e;
  }
}

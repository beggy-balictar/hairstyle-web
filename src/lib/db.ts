import "@/lib/load-env";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const noisyClosedConnection = "Error in PostgreSQL connection: Error { kind: Closed, cause: None }";

const prismaLogConfig =
  process.env.NODE_ENV === "development"
    ? ([
        { emit: "event", level: "error" },
        { emit: "stdout", level: "warn" },
      ] as const)
    : (["error"] as const);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: prismaLogConfig,
  });

if (process.env.NODE_ENV === "development") {
  prisma.$on("error", (event: Prisma.LogEvent) => {
    // Neon/PgBouncer may close idle pooled sockets; avoid flooding terminal with this known noise.
    if (event.message.includes(noisyClosedConnection)) return;
    console.error(`prisma:error ${event.message}`);
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

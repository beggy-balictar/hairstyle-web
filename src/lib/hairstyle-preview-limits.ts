import { prisma } from "@/lib/db";

export type PreviewLimitError =
  | { ok: false; status: 429; code: "PREVIEW_COOLDOWN"; message: string; retryAfterSec: number }
  | { ok: false; status: 429; code: "PREVIEW_DAILY_CAP"; message: string; limit: number; used: number };

export type PreviewLimitOk = { ok: true };

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

/** 0 = no daily cap. */
export function getHairstylePreviewMaxPerUserPerDay(): number {
  return parsePositiveInt(process.env.HAIRSTYLE_PREVIEW_MAX_PER_USER_PER_DAY?.trim(), 10);
}

/** 0 = no cooldown between previews. */
export function getHairstylePreviewMinSecondsBetween(): number {
  return parsePositiveInt(process.env.HAIRSTYLE_PREVIEW_MIN_SECONDS_BETWEEN?.trim(), 60);
}

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

export async function assertHairstylePreviewAllowed(userId: string): Promise<PreviewLimitOk | PreviewLimitError> {
  const maxPerDay = getHairstylePreviewMaxPerUserPerDay();
  const minSec = getHairstylePreviewMinSecondsBetween();
  const now = new Date();

  if (minSec > 0) {
    const last = await prisma.hairstylePreviewLog.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (last) {
      const elapsedSec = (now.getTime() - last.createdAt.getTime()) / 1000;
      if (elapsedSec < minSec) {
        const retryAfterSec = Math.ceil(minSec - elapsedSec);
        return {
          ok: false,
          status: 429,
          code: "PREVIEW_COOLDOWN",
          message: `Please wait ${retryAfterSec}s before generating another preview.`,
          retryAfterSec,
        };
      }
    }
  }

  if (maxPerDay > 0) {
    const dayStart = startOfUtcDay(now);
    const used = await prisma.hairstylePreviewLog.count({
      where: { userId, createdAt: { gte: dayStart } },
    });
    if (used >= maxPerDay) {
      return {
        ok: false,
        status: 429,
        code: "PREVIEW_DAILY_CAP",
        message: `Daily preview limit reached (${maxPerDay} per day). Try again tomorrow or contact support.`,
        limit: maxPerDay,
        used,
      };
    }
  }

  return { ok: true };
}

export async function recordHairstylePreviewSuccess(userId: string): Promise<void> {
  await prisma.hairstylePreviewLog.create({ data: { userId } });
}

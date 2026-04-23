import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { prismaErrorToResponse } from "@/lib/prisma-errors";
import { requireAdminSession } from "@/lib/require-session";

type GrowthBucket = {
  label: string;
  customers: number;
  pageViews: number;
  reports: number;
  analyses: number;
  ratingSum: number;
  ratingCount: number;
};

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function buildGrowthBuckets(monthCount = 6): { startDate: Date; buckets: GrowthBucket[]; keys: string[] } {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (monthCount - 1), 1));
  const keys: string[] = [];
  const buckets: GrowthBucket[] = [];
  for (let i = 0; i < monthCount; i += 1) {
    const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    keys.push(monthKey(d));
    buckets.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      customers: 0,
      pageViews: 0,
      reports: 0,
      analyses: 0,
      ratingSum: 0,
      ratingCount: 0,
    });
  }
  return { startDate: start, buckets, keys };
}

export async function GET(request: Request) {
  const { error } = await requireAdminSession(request);
  if (error) return error;

  try {
    const { startDate, buckets, keys } = buildGrowthBuckets();
    const bucketByKey = new Map(keys.map((key, index) => [key, index]));

    const [
      userCount,
      customerCount,
      satisfactionAgg,
      reportCount,
      analysisCount,
      hairstyleCount,
      pageViewCount,
      recentReports,
      recentCustomers,
      recentPageViews,
      recentSatisfaction,
      recentReportRows,
      recentAnalyses,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.satisfaction.aggregate({ _avg: { rating: true }, _count: { id: true } }),
      prisma.customerReport.count(),
      prisma.faceAnalysis.count(),
      prisma.hairstyle.count({ where: { isActive: true } }),
      prisma.pageView.count(),
      prisma.customerReport.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          message: true,
          createdAt: true,
          user: { select: { email: true } },
        },
      }),
      prisma.user.findMany({
        where: { role: "CUSTOMER", createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.satisfaction.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true, rating: true },
      }),
      prisma.customerReport.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.faceAnalysis.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
    ]);

    for (const row of recentCustomers) {
      const i = bucketByKey.get(monthKey(row.createdAt));
      if (i != null) buckets[i].customers += 1;
    }
    for (const row of recentPageViews) {
      const i = bucketByKey.get(monthKey(row.createdAt));
      if (i != null) buckets[i].pageViews += 1;
    }
    for (const row of recentSatisfaction) {
      const i = bucketByKey.get(monthKey(row.createdAt));
      if (i != null) {
        buckets[i].ratingSum += row.rating;
        buckets[i].ratingCount += 1;
      }
    }
    for (const row of recentReportRows) {
      const i = bucketByKey.get(monthKey(row.createdAt));
      if (i != null) buckets[i].reports += 1;
    }
    for (const row of recentAnalyses) {
      const i = bucketByKey.get(monthKey(row.createdAt));
      if (i != null) buckets[i].analyses += 1;
    }

    const growth = buckets.map((b) => ({
      label: b.label,
      customers: b.customers,
      pageViews: b.pageViews,
      reports: b.reports,
      analyses: b.analyses,
      avgSatisfaction: b.ratingCount > 0 ? Math.round((b.ratingSum / b.ratingCount) * 100) / 100 : null,
    }));

    return NextResponse.json({
      totalUsers: userCount,
      customerUsers: customerCount,
      satisfactionResponses: satisfactionAgg._count.id,
      averageSatisfaction: satisfactionAgg._avg.rating ?? null,
      customerReports: reportCount,
      faceAnalyses: analysisCount,
      activeHairstyles: hairstyleCount,
      pageViews: pageViewCount,
      recentReports,
      growth,
    });
  } catch (e) {
    const pr = prismaErrorToResponse(e);
    if (pr) return pr;
    console.error(e);
    return NextResponse.json({ error: "Failed to load metrics." }, { status: 500 });
  }
}

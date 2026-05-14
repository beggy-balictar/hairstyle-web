"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, MessageSquareWarning, Scissors, Star, User, Users } from "lucide-react";
import { AdminGrowthCharts, type GrowthChartRow } from "@/components/admin/admin-growth-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

type Metrics = {
  totalUsers: number;
  customerUsers: number;
  satisfactionResponses: number;
  averageSatisfaction: number | null;
  customerReports: number;
  faceAnalyses: number;
  activeHairstyles: number;
  pageViews: number;
  recentReports: { id: string; message: string; createdAt: string; user: { email: string } }[];
  growth: GrowthChartRow[];
};

function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string | number | undefined;
  hint: string;
  icon: typeof Users;
}) {
  return (
    <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-950">{title}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value ?? "—"}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminDashboardMetrics() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/metrics", { credentials: "include" });
      const json = (await res.json()) as Metrics & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load metrics.");
        return;
      }
      setData(json);
    })();
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        {error}
      </div>
    );
  }

  const avg = data?.averageSatisfaction != null ? data.averageSatisfaction.toFixed(2) : "—";
  const growth = data?.growth ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total users" value={data?.totalUsers} hint="All roles in the system" icon={Users} />
        <KpiCard title="Customers" value={data?.customerUsers} hint="Accounts with customer role" icon={User} />
        <KpiCard title="Avg. satisfaction" value={avg} hint="Mean of all ratings (1–5)" icon={Star} />
        <KpiCard title="Reports" value={data?.customerReports} hint="Customer feedback & concerns" icon={MessageSquareWarning} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard title="Hairstyles in catalog" value={data?.activeHairstyles} hint="Active entries" icon={Scissors} />
        <KpiCard title="Face analyses" value={data?.faceAnalyses} hint="Completed analysis runs (usage)" icon={ClipboardList} />
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Growth &amp; usage analytics</h2>
            <p className="text-sm text-slate-600">Last six months from your database.</p>
          </div>
        </div>
        <AdminGrowthCharts data={growth} />
      </div>

      <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4">
          <div>
            <CardTitle className="text-base font-semibold">Recent customer reports</CardTitle>
            <p className="text-xs text-slate-500">Newest submissions first</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href={ROUTES.adminReports}>Manage all reports</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {!data ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : data.recentReports.length === 0 ? (
            <p className="text-sm text-slate-500">No reports yet.</p>
          ) : (
            data.recentReports.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm">
                <div className="mb-1 text-xs text-slate-500">
                  {r.user.email} · {new Date(r.createdAt).toLocaleString()}
                </div>
                <p className="text-slate-800">{r.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

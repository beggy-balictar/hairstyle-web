"use client";

import { useEffect, useState } from "react";
import { StatusCard } from "@/components/shared/status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Metrics = {
  satisfactionResponses: number;
  averageSatisfaction: number | null;
  customerReports: number;
  pageViews: number;
  recentReports: { id: string; message: string; createdAt: string; user: { email: string } }[];
};

export function AdminReportsInsights() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/metrics", { credentials: "include" });
      const json = (await res.json()) as Metrics & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load data.");
        return;
      }
      setData(json);
    })();
  }, []);

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  const avg = data?.averageSatisfaction != null ? data.averageSatisfaction.toFixed(2) : "—";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Avg. rating" subtitle="All time" value={avg} />
        <StatusCard title="Ratings count" subtitle="Submissions" value={data?.satisfactionResponses} />
        <StatusCard title="Written reports" subtitle="Customer messages" value={data?.customerReports} />
        <StatusCard title="Page views" subtitle="Customer app" value={data?.pageViews} />
      </div>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All recent reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!data ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : data.recentReports.length === 0 ? (
            <p className="text-sm text-slate-500">No reports yet.</p>
          ) : (
            data.recentReports.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm">
                <div className="mb-1 text-xs text-slate-500">
                  {r.user.email} · {new Date(r.createdAt).toLocaleString()}
                </div>
                <p className="whitespace-pre-wrap text-slate-800">{r.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

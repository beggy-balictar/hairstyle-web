"use client";

import { useEffect, useState } from "react";
import { StatusCard } from "@/components/shared/status-card";

type Overview = {
  favoriteCount: number;
  analysisCount: number;
  ratingCount: number;
  lastAnalysisAt: string | null;
};

export function CustomerDashboardMetrics() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/customer/overview", { credentials: "include" });
      const json = (await res.json()) as Overview & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load overview.");
        return;
      }
      setData(json);
    })();
  }, []);

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  const last = data?.lastAnalysisAt ? new Date(data.lastAnalysisAt).toLocaleDateString() : "—";

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatusCard title="Saved styles" subtitle="Favorites count" value={data ? data.favoriteCount : undefined} />
      <StatusCard title="Face analyses" subtitle="Saved scans" value={data ? data.analysisCount : undefined} />
      <StatusCard title="Ratings sent" subtitle="Satisfaction submissions" value={data ? data.ratingCount : undefined} />
      <StatusCard title="Last analysis" subtitle="Most recent save" value={data ? last : undefined} />
    </div>
  );
}

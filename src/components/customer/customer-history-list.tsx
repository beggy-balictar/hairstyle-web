"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Row = {
  id: string;
  faceShape: string | null;
  confidenceScore: number | null;
  createdAt: string;
  faceUpload: { imageUrl: string };
};

export function CustomerHistoryList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/customer/history", { credentials: "include" });
    const json = (await res.json()) as { analyses?: Row[]; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Could not load history.");
      setRows([]);
    } else {
      setRows(json.analyses ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <p className="text-sm text-slate-500">Loading history…</p>;
  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (rows.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
        No saved analyses yet. Use Analyze, then “Save scan & load recommendations” to store a result here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <Card key={r.id} className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={r.faceUpload.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
          <CardContent className="space-y-1 p-4 text-sm">
            <div className="font-semibold capitalize text-slate-900">{r.faceShape ?? "Unknown shape"}</div>
            <div className="text-xs text-slate-500">
              {r.confidenceScore != null ? `${Math.round(r.confidenceScore * 100)}% confidence · ` : null}
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

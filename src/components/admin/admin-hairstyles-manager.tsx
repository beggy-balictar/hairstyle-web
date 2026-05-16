"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Hairstyle = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  maintenanceLevel: string | null;
  isActive: boolean;
};

export function AdminHairstylesManager() {
  const [rows, setRows] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [maintenanceLevel, setMaintenanceLevel] = useState("");
  const [shapes, setShapes] = useState("oval, round, square");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/hairstyles", { credentials: "include" });
    const json = (await res.json()) as { hairstyles?: Hairstyle[]; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Could not load catalog.");
      setRows([]);
    } else {
      setRows(json.hairstyles ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!name.trim()) {
      setFormMsg("Name is required.");
      return;
    }
    setSaving(true);
    setFormMsg(null);
    const suitableFaceShapes = shapes
      .split(/[,\s]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const res = await fetch("/api/admin/hairstyles", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        maintenanceLevel: maintenanceLevel.trim() || undefined,
        suitableFaceShapes,
      }),
    });
    const data = (await res.json()) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setFormMsg(data.error ?? "Save failed.");
      return;
    }
    setName("");
    setDescription("");
    setCategory("");
    setMaintenanceLevel("");
    setShapes("oval, round, square");
    setFormMsg("Saved.");
    setToastMessage("Hairstyle Saved!");
    void load();
  }

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Add hairstyle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input className="h-11 rounded-2xl" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            className="min-h-[100px] rounded-2xl"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input className="h-11 rounded-2xl" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input
              className="h-11 rounded-2xl"
              placeholder="Maintenance level"
              value={maintenanceLevel}
              onChange={(e) => setMaintenanceLevel(e.target.value)}
            />
          </div>
          <Input
            className="h-11 rounded-2xl"
            placeholder="Suitable face shapes (comma-separated)"
            value={shapes}
            onChange={(e) => setShapes(e.target.value)}
          />
          {formMsg ? <p className="text-sm text-slate-600">{formMsg}</p> : null}
          <Button className="h-11 min-h-[44px] rounded-2xl" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save to catalog"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Catalog ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {!loading && !error ? (
            <ul className="space-y-3">
              {rows.map((h) => (
                <li key={h.id} className="rounded-2xl border border-slate-200 p-4 text-sm">
                  <div className="font-semibold text-slate-900">{h.name}</div>
                  <div className="text-xs text-slate-500">
                    {h.category ?? "—"} · {h.isActive ? "active" : "inactive"}
                  </div>
                  {h.description ? <p className="mt-2 text-slate-600">{h.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
      {toastMessage ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white shadow-xl shadow-slate-900/30">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}

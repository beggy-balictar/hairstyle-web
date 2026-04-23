"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FavoriteRow = {
  id: string;
  hairstyleId: string;
  hairstyle: {
    id: string;
    name: string;
    description: string | null;
    sampleImageUrl: string | null;
    category: string | null;
  };
};

export function FavoritesList() {
  const [items, setItems] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/favorites", { credentials: "include" });
    const json = (await res.json()) as { favorites?: FavoriteRow[]; error?: string };
    if (!res.ok) {
      setError(json.error ?? "Could not load favorites.");
      setItems([]);
      setLoading(false);
      return;
    }
    setItems(json.favorites ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(hairstyleId: string) {
    const res = await fetch(`/api/favorites?hairstyleId=${encodeURIComponent(hairstyleId)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((f) => f.hairstyleId !== hairstyleId));
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading favorites…</p>;
  }
  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }
  if (items.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
        No saved styles yet. Run an analysis, save recommendations, then tap the heart on a style to add it here.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <Card key={f.id} className="overflow-hidden rounded-3xl border-slate-200 shadow-sm">
          <div className="relative aspect-[4/3] bg-slate-100">
            {f.hairstyle.sampleImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.hairstyle.sampleImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                <Heart className="h-10 w-10" />
              </div>
            )}
          </div>
          <CardContent className="space-y-3 p-4">
            <div>
              <h3 className="font-semibold text-slate-900">{f.hairstyle.name}</h3>
              {f.hairstyle.category ? (
                <p className="text-xs uppercase tracking-wide text-slate-500">{f.hairstyle.category}</p>
              ) : null}
              {f.hairstyle.description ? <p className="mt-2 text-sm text-slate-600">{f.hairstyle.description}</p> : null}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 min-h-[44px] w-full rounded-xl touch-manipulation"
              onClick={() => void remove(f.hairstyleId)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

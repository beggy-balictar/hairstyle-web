"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SatisfactionDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = () => {
    if (!rating) return;
    void (async () => {
      setSubmitting(true);
      setMessage(null);
      try {
        const res = await fetch("/api/satisfaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setMessage(data.error ?? "Could not save rating.");
          setSubmitting(false);
          return;
        }
        setOpen(false);
        setRating(0);
        setMessage(null);
      } catch {
        setMessage("Network error. Try again.");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 min-h-[44px] rounded-2xl touch-manipulation">
          <Star className="mr-2 h-5 w-5" /> Rate visit
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>1–5 stars. Stored for admin analytics to track how the shop and app are performing.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="min-h-[44px] min-w-[44px] rounded-full p-2 transition hover:scale-110 touch-manipulation"
            >
              <Star className={cn("h-9 w-9", value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
            </button>
          ))}
        </div>
        {message ? <p className="text-center text-sm text-rose-600">{message}</p> : null}
        <DialogFooter>
          <Button className="h-11 min-h-[44px] w-full rounded-2xl" onClick={submit} disabled={!rating || submitting}>
            {submitting ? "Saving…" : "Submit rating"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

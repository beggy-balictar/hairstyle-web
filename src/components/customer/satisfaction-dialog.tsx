"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SatisfactionDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const submit = () => {
    if (!rating) return;
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-14 rounded-2xl"><Star className="mr-2 h-5 w-5" /> Satisfaction</Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate your experience</DialogTitle>
          <DialogDescription>Choose a score from 1 to 5 stars. This can be stored in PostgreSQL and reflected in admin analytics.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} onClick={() => setRating(value)} className="rounded-full p-1 transition hover:scale-110">
              <Star className={cn("h-9 w-9", value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button className="w-full rounded-2xl" onClick={submit} disabled={!rating}>Submit rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
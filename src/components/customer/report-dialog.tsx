"use client";

import { useState } from "react";
import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReportDialog() {
  const [open, setOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = () => {
    if (!reportText.trim()) return;
    void (async () => {
      setSubmitting(true);
      setMessage(null);
      try {
        const res = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: reportText.trim() }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setMessage(data.error ?? "Could not send report.");
          setSubmitting(false);
          return;
        }
        setOpen(false);
        setReportText("");
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
          <FileText className="mr-2 h-5 w-5" /> Report issue
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit a report</DialogTitle>
          <DialogDescription>Issues, ideas, or service feedback. Admins read these in the dashboard.</DialogDescription>
        </DialogHeader>
        <Textarea
          className="min-h-[140px] rounded-2xl text-base sm:text-sm"
          placeholder="Describe what happened…"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />
        {message ? <p className="text-sm text-rose-600">{message}</p> : null}
        <DialogFooter>
          <Button
            className="h-11 min-h-[44px] rounded-2xl"
            onClick={submit}
            disabled={!reportText.trim() || submitting}
          >
            <Send className="mr-2 h-4 w-4" /> {submitting ? "Sending…" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

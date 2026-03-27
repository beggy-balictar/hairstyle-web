"use client";

import { useState } from "react";
import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function ReportDialog() {
  const [open, setOpen] = useState(false);
  const [reportText, setReportText] = useState("");

  const submit = () => {
    if (!reportText.trim()) return;
    setOpen(false);
    setReportText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-14 rounded-2xl"><FileText className="mr-2 h-5 w-5" /> Report</Button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit a report</DialogTitle>
          <DialogDescription>Describe an issue, concern, or suggestion. This popup is ready for a PostgreSQL-backed customer report table.</DialogDescription>
        </DialogHeader>
        <Textarea className="min-h-[160px] rounded-2xl" placeholder="Type your report here..." value={reportText} onChange={(e) => setReportText(e.target.value)} />
        <DialogFooter>
          <Button className="rounded-2xl" onClick={submit} disabled={!reportText.trim()}><Send className="mr-2 h-4 w-4" /> Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
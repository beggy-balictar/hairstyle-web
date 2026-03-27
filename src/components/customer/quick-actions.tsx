"use client";

import { useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDialog } from "@/components/customer/report-dialog";
import { SatisfactionDialog } from "@/components/customer/satisfaction-dialog";
import { useFaceActions } from "@/hooks/use-face-actions";

export function QuickActions() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { permissionMessage, onScan, onUploadChange } = useFaceActions();

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>These actions are connected to browser permissions and future backend flows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Button className="h-14 rounded-2xl" onClick={onScan}><Camera className="mr-2 h-5 w-5" /> Scan face</Button>
          <>
            <input
              ref={fileRef}
              id="face-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onUploadChange(e.target.files?.[0])}
            />
            <Button variant="outline" className="h-14 rounded-2xl" onClick={() => fileRef.current?.click()}><Upload className="mr-2 h-5 w-5" /> Upload file</Button>
          </>
          <SatisfactionDialog />
          <ReportDialog />
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Permission and action status</CardTitle>
          <CardDescription>This feedback area confirms browser-level action readiness before backend processing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            {permissionMessage || "No scan or upload action has been triggered yet."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDialog } from "@/components/customer/report-dialog";
import { SatisfactionDialog } from "@/components/customer/satisfaction-dialog";
import { ROUTES } from "@/lib/routes";

export function QuickActions() {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump to analysis or send feedback for barbershop analytics.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        <Button asChild className="h-12 min-h-[44px] rounded-2xl touch-manipulation">
          <Link href={ROUTES.customerAnalyze}>
            <Camera className="mr-2 h-5 w-5" /> Analyze photo
          </Link>
        </Button>
        <SatisfactionDialog />
        <ReportDialog />
      </CardContent>
    </Card>
  );
}

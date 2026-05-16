import { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { FirstAdminSetupForm } from "@/components/forms/first-admin-setup-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Create Admin | StyleHair",
};

export default function FirstAdminSetupPage() {
  return (
    <AppShell>
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.2),transparent)]" />
        <div className="relative mx-auto max-w-lg">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-lg backdrop-blur-xl">
            <Brand />
            <Button asChild variant="ghost" className="rounded-2xl">
              <Link href={ROUTES.roleLogin}>Back to login</Link>
            </Button>
          </div>
          <Card className="overflow-hidden rounded-[2rem] border-slate-200/80 bg-white/95 shadow-2xl shadow-indigo-100/50 backdrop-blur">
            <CardHeader className="space-y-3 border-b border-slate-100 bg-gradient-to-br from-indigo-50/80 to-white p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <KeyRound className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-bold">Create first administrator</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                One-time step when no admin exists yet. Use any @stylehair.com email and a strong password. After this, add more admins from the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6">
              <FirstAdminSetupForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

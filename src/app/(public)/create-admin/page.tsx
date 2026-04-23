import Link from "next/link";
import { KeyRound, ShieldCheck, UserPlus } from "lucide-react";
import { CreateAdminGateway } from "@/components/public/create-admin-gateway";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export default function CreateAdminHelpPage() {
  return (
    <AppShell>
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.22),transparent),radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(236,72,153,0.12),transparent)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 px-5 py-4 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
            <Brand />
            <Button asChild variant="ghost" className="rounded-2xl">
              <Link href={ROUTES.landing}>Home</Link>
            </Button>
          </div>

          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-600">StyleHair</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Create an admin account</h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">Choose the path that matches your barbershop setup.</p>
          </div>

          <CreateAdminGateway />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-md backdrop-blur">
              <CardHeader className="pb-2">
                <ShieldCheck className="mb-2 h-8 w-8 text-indigo-600" />
                <CardTitle className="text-base">Already have an admin?</CardTitle>
                <CardDescription>Sign in, then use Create admin in the sidebar to invite teammates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full rounded-2xl bg-slate-900">
                  <Link href={ROUTES.roleLogin}>Go to admin login</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-md backdrop-blur">
              <CardHeader className="pb-2">
                <KeyRound className="mb-2 h-8 w-8 text-violet-600" />
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>All admin emails must be @stylehair.com. Passwords are stored as secure hashes.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-end">
                <p className="text-xs text-slate-500">Customer accounts are managed in the mobile app, not on this site.</p>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            <UserPlus className="mr-1 inline h-4 w-4 align-text-bottom" />
            Need help? Your lead admin can create accounts from the dashboard after signing in.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

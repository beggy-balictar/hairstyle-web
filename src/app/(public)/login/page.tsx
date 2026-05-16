import { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Login | StyleHair",
};

type Props = {
  searchParams: { tab?: string; next?: string };
};

export default function RoleLoginPage({ searchParams }: Props) {
  const nextPath = searchParams.next?.startsWith("/") ? searchParams.next : undefined;
  return (
    <AppShell>
      <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_10%_-10%,rgba(99,102,241,0.28),transparent),radial-gradient(ellipse_70%_50%_at_90%_20%,rgba(244,114,182,0.18),transparent),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.12),transparent)]" />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-lg shadow-indigo-100/50 backdrop-blur-xl">
            <Brand />
            <Button asChild variant="ghost" className="rounded-2xl text-slate-600">
              <Link href={ROUTES.landing}>Home</Link>
            </Button>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-white/20 bg-gradient-to-br from-slate-900 via-indigo-900 to-violet-900 text-white shadow-2xl shadow-indigo-900/40">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <CardHeader className="relative space-y-2 p-8 pb-4">
              <div className="flex items-center gap-2 text-indigo-200">
                <Shield className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">Secure access</span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-white">Admin sign in</CardTitle>
              <CardDescription className="text-base leading-relaxed text-white">
                This website is for administrators only. Customers use the StyleHair mobile app.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6 p-8 pt-2">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-3">
                  <Shield className="mt-0.5 h-5 w-5 shrink-0 text-indigo-200" />
                  <div>
                    <div className="font-medium text-white">Protected dashboard</div>
                    <div className="mt-1 text-sm text-slate-200">
                      Use your @stylehair.com email. New teammates can be added once you are signed in.
                    </div>
                  </div>
                </div>
              </div>
              <AdminLoginForm nextPath={nextPath} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

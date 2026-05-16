import { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Settings, Shield, Users } from "lucide-react";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Dashboard | StyleHair",
};

export default function LandingPage() {
  return (
    <AppShell>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_24%)]" />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-10 lg:px-14">
            <div>
              <Brand />
            </div>

            <div className="max-w-4xl py-10 sm:py-14">
              <h1 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Admin dashboard for hairstyle system management, analytics, and growth monitoring.
              </h1>
              <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
                StyleHair web is designed for administrators to control users, maintain the hairstyle catalog, review customer reports, and monitor
                performance trends.
              </p>
            </div>

            <div className="grid gap-4 pb-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">User Management</div>
                <div className="mt-1 text-sm text-slate-300">Manage and monitor admin and customer records</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">Catalog Management</div>
                <div className="mt-1 text-sm text-slate-300">Maintain hairstyle entries used by recommendations</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">Growth Analytics</div>
                <div className="mt-1 text-sm text-slate-300">Track usage, feedback, and satisfaction trends</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <div className="space-y-5">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Enter admin portal</h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                  Sign in with your administrator credentials to access dashboard controls and real analytics.
                </p>
              </div>
            </div>

            <Card className="w-full rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/60">
              <CardHeader className="space-y-3 p-8 pb-2">
                <CardTitle className="text-3xl tracking-tight">Continue to admin login</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Only authorized admin credentials can access the web dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-8 pt-4">
                <Button asChild className="h-14 w-full rounded-2xl text-base">
                  <Link href={ROUTES.roleLogin}>
                    <Shield className="mr-2 h-5 w-5" /> Sign in as administrator
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <Users className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Organized records</div>
                <div className="mt-1 text-sm text-slate-500">Focused user management with clean navigation.</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <BarChart3 className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Live growth charts</div>
                <div className="mt-1 text-sm text-slate-500">Clear analytics for usage, trends, and satisfaction.</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                <Settings className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Admin controls</div>
                <div className="mt-1 text-sm text-slate-500">Update system content and maintain operations.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

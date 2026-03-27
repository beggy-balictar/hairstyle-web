import { ArrowRight, Camera, Shield, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_24%)]" />
          <div className="relative z-10">
            <Brand />
          </div>
          <div className="relative z-10 max-w-2xl py-16 lg:py-0">
            <Badge className="mb-5 rounded-full bg-white/10 px-4 py-1.5 text-white hover:bg-white/10">System-first project foundation</Badge>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Facial analysis, hairstyle recommendations, and role-based dashboards in one responsive web system.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
              StylehAIr is prepared for PostgreSQL persistence, secure authentication, AI-based face analysis, recommendation generation, preview rendering, and customer history storage without hardcoded dashboard data.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-2xl bg-white text-slate-950 hover:bg-slate-100" size="lg">
                <Link href={ROUTES.roleLogin}>
                  Enter system <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 bg-transparent text-white hover:bg-white/10">
                <Link href={ROUTES.register}>Create customer account</Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">Admin dashboard</div>
              <div className="mt-1 text-sm text-slate-300">Users, hairstyles, reports, satisfaction insights, settings</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">Customer experience</div>
              <div className="mt-1 text-sm text-slate-300">Scan, upload, top 5 results, previews, history, profile, feedback</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">Backend-ready structure</div>
              <div className="mt-1 text-sm text-slate-300">Auth, PostgreSQL, Prisma, AI services, media storage hooks</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <Card className="w-full max-w-xl rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/60">
            <CardHeader className="space-y-3 p-8 pb-2">
              <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">Responsive landing + entry flow</Badge>
              <CardTitle className="text-3xl tracking-tight">Choose how you want to enter</CardTitle>
              <CardDescription className="text-sm leading-6">
                The first screen routes users into the correct authentication path. Admins go straight to admin login. Customers proceed to a dedicated customer sign-in page with account creation access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-4">
              <Button asChild className="h-14 w-full rounded-2xl text-base">
                <Link href={ROUTES.roleLogin}>
                  <Shield className="mr-2 h-5 w-5" /> Continue to role login
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 w-full rounded-2xl text-base">
                <Link href={ROUTES.register}>
                  <User className="mr-2 h-5 w-5" /> Create customer account
                </Link>
              </Button>
              <Alert className="rounded-2xl border-slate-200">
                <AlertTitle>Structure only</AlertTitle>
                <AlertDescription>
                  This preview intentionally contains no sample users, reports, analytics, or recommendation entries. All panels are empty-state ready for live integrations.
                </AlertDescription>
              </Alert>
              <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <Sparkles className="mb-3 h-4 w-4 text-slate-900" />
                  AI face analysis service
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <Camera className="mb-3 h-4 w-4 text-slate-900" />
                  Camera and upload permissions
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <User className="mb-3 h-4 w-4 text-slate-900" />
                  Customer profile history
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

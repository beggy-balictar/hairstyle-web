import { ArrowRight, Camera, Shield, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
  return (
    <AppShell>
      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_24%)]" />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-10 lg:px-14">
            <div>
              <Brand />
            </div>

            <div className="max-w-4xl py-10 sm:py-14">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Facial analysis, hairstyle recommendations, and role-based dashboards in one responsive web system.
              </h1>
              <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
                StyleHᴀɪR provides personalized hairstyle recommendations, allows users to preview suggested styles on their own face, and saves these results for future reference.
              </p>
            </div>

            <div className="grid gap-4 pb-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">Face Shape Analysis</div>
                <div className="mt-1 text-sm text-slate-300">Understand your face shape</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">Hair Type Detector</div>
                <div className="mt-1 text-sm text-slate-300">Know your hair texture and styling needs</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-sm font-medium">AI-Powered Hairstyle Preview</div>
                <div className="mt-1 text-sm text-slate-300">See styles on your face instantly</div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
            <div className="space-y-5">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Get started with StyleHᴀɪR</h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                  Continue to login, choose your role, and move into the admin dashboard or customer dashboard flow. This stacked layout keeps the first impression cleaner and gives the call-to-action section its own breathing room.
                </p>
              </div>
            </div>

            <Card className="w-full rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/60">
              <CardHeader className="space-y-3 p-8 pb-2">
                <CardTitle className="text-3xl tracking-tight">Continue to login</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Start the authentication flow here, then continue to the correct dashboard based on the selected role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-8 pt-4">
                <Button asChild className="h-14 w-full rounded-2xl text-base">
                  <Link href={ROUTES.roleLogin}>
                    <Shield className="mr-2 h-5 w-5" /> Continue to role login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-14 w-full rounded-2xl text-base">
                  <Link href={ROUTES.register}>Create customer account</Link>
                </Button>
                <Alert className="rounded-2xl border-slate-200">
                  <AlertTitle>Before proceeding</AlertTitle>
                  <AlertDescription>
                    Admins can go directly to the admin sign-in flow, while customers can sign in or create a new account first before accessing their dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <Sparkles className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Smart analysis</div>
                <div className="mt-1 text-sm text-slate-500">Prepared for AI-based face and hairstyle matching workflows.</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <Camera className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Scan or upload</div>
                <div className="mt-1 text-sm text-slate-500">Ready for camera permission and local image upload interactions.</div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                <User className="mb-3 h-5 w-5 text-slate-900" />
                <div className="text-sm font-medium text-slate-900">Profile history</div>
                <div className="mt-1 text-sm text-slate-500">Structured for storing recommendation history and customer references.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

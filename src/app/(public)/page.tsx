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
            
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Facial analysis, hairstyle recommendations, and role-based dashboards in one responsive web system.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg">
              StyleHᴀɪR provides personalized hairstyle recommendations, allows users to preview suggested styles on their own face, and saves these results for future reference.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-2xl border-white/20 bg-white text-black/85 hover:bg-white/10 hover:text-white" size="lg">
                <Link href={ROUTES.roleLogin}>
                  Enter system <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/20 bg-transparent text-black hover:bg-white/10 hover:text-white">
                <Link href={ROUTES.register}>Create customer account</Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">Face Shape Analysis</div>
              <div className="mt-1 text-sm text-slate-300">Understand your face shape</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">Hair Type Detector</div>
              <div className="mt-1 text-sm text-slate-300">Know your hair type </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm font-medium">AI-powered Hairstyle Preview</div>
              <div className="mt-1 text-sm text-slate-300">See styles on your face instantly</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10">
          <Card className="w-full max-w-xl rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/60">
            <CardHeader className="space-y-3 p-8 pb-2">
    
              <CardTitle className="text-3xl tracking-tight">Get Started with StyleHᴀɪR</CardTitle>
              
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-4">
              <Button asChild className="h-14 w-full rounded-2xl text-base">
                <Link href={ROUTES.roleLogin}>
                  <Shield className="mr-2 h-5 w-5" /> Continue to role login
                </Link>
              </Button>
              <Alert className="rounded-2xl border-slate-200">
                <AlertTitle>Any questions?</AlertTitle>
                <AlertDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut, quo adipisci vero ullam saepe eveniet sit commodi numquam tempore velit mollitia impedit iusto eum enim, quis voluptatem, assumenda repudiandae dignissimos?
                </AlertDescription>
              </Alert>
              <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <Sparkles className="mb-3 h-4 w-4 text-slate-900" />
                  lorem ipsum
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <Camera className="mb-3 h-4 w-4 text-slate-900" />
                  lorem ipsum
                </div>
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  <User className="mb-3 h-4 w-4 text-slate-900" />
                  lorem ipsum
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

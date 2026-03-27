import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { CustomerLoginForm } from "@/components/forms/customer-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";

export default function CustomerLoginPage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.06),transparent_36%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <Brand />
            <div className="flex gap-2">
              <Button asChild variant="ghost" className="rounded-2xl"><Link href={ROUTES.roleLogin}>Back</Link></Button>
              <Button asChild variant="outline" className="rounded-2xl"><Link href={ROUTES.register}>Create account</Link></Button>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm">
              <CardHeader className="p-8">
                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">Customer sign-in</Badge>
                <CardTitle className="pt-2 text-3xl tracking-tight">Welcome back</CardTitle>
                <CardDescription>Use your customer email and password to continue to your dashboard and stored recommendations.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <CustomerLoginForm />
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200 shadow-sm">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl">Customer access rules</CardTitle>
                <CardDescription>This login screen is intentionally separate from the admin flow and can connect directly to your customer account table and session logic.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 p-8 pt-0 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="text-sm font-medium">Validation-ready inputs</div>
                  <div className="mt-1 text-sm text-slate-500">Email format and required-password validation are enforced at the interface level before backend checks.</div>
                </div>
                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="text-sm font-medium">Auth.js compatible</div>
                  <div className="mt-1 text-sm text-slate-500">This page is structured for secure session creation, hashed-password verification, and PostgreSQL-backed identity lookup.</div>
                </div>
                <div className="rounded-3xl border border-slate-200 p-5 sm:col-span-2">
                  <div className="text-sm font-medium">Recommended backend behavior</div>
                  <div className="mt-1 text-sm text-slate-500">Check email existence, verify password hash, create session, redirect to /customer/dashboard, and return clear error states for invalid credentials.</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { RegisterForm } from "@/components/forms/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <Brand />
            <Button asChild variant="ghost" className="rounded-2xl"><Link href={ROUTES.customerLogin}>Back to customer login</Link></Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm">
              <CardHeader className="p-8">
                <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">Create customer account</Badge>
                <CardTitle className="pt-2 text-3xl tracking-tight">Set up your profile securely</CardTitle>
                <CardDescription>Each field is designed to map cleanly to PostgreSQL columns and standard account-creation validation rules.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <RegisterForm />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Mapped for standard account creation</CardTitle>
                  <CardDescription>These fields cover the core customer identity and account data most systems need before profile expansion.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-8 pt-0">
                  <div className="rounded-3xl border border-slate-200 p-5 text-sm text-slate-500">Store passwords only as secure hashes in PostgreSQL, never in plain text.</div>
                  <div className="rounded-3xl border border-slate-200 p-5 text-sm text-slate-500">Use unique-email constraints, server-side validation, and verification flow if email confirmation is added later.</div>
                  <div className="rounded-3xl border border-slate-200 p-5 text-sm text-slate-500">After successful registration, redirect the user to the customer login page and show a success message.</div>
                </CardContent>
              </Card>
              <Card className="rounded-[2rem] border-slate-200 shadow-sm">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl">Suggested PostgreSQL fields</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-8 pt-0 text-sm text-slate-500">
                  <div className="rounded-2xl border border-slate-200 px-4 py-3">users.email</div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3">users.password_hash</div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3">users.role</div>
                  <div className="rounded-2xl border border-slate-200 px-4 py-3">customer_profiles.first_name / last_name / phone / birth_date / gender</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
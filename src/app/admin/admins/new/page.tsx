import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { CreateAdminAccountForm } from "@/components/forms/create-admin-account-form";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Create Admin | StyleHair",
};

export default function AdminCreateAdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="rounded-xl text-slate-600">
          <Link href={ROUTES.adminUsers}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to users
          </Link>
        </Button>
      </div>

      <SectionHeader
        title="Create admin account"
        description="Invite another @stylehair.com administrator. They will use the same secure login as you."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">New teammate</CardTitle>
                <CardDescription>Strong password required. Email must end with @stylehair.com.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <CreateAdminAccountForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="rounded-3xl border-violet-100 bg-gradient-to-b from-violet-50/90 to-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-violet-950">Why here?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-600">
              <p>Only signed-in admins can create more admins. That keeps the barbershop control panel protected.</p>
              <p className="text-xs text-slate-500">First install with no admin yet? Use the one-time setup instead.</p>
              <Button asChild variant="outline" className="mt-2 w-full rounded-2xl border-violet-200">
                <Link href={ROUTES.firstAdminSetup}>First-time setup</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

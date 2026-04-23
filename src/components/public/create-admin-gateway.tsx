"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export function CreateAdminGateway() {
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/setup-status");
        const data = (await res.json()) as { needsSetup?: boolean };
        setNeedsSetup(res.ok ? data.needsSetup === true : false);
      } catch {
        setNeedsSetup(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card className="rounded-3xl border-slate-200/80 bg-white/80 p-8 text-center shadow-lg backdrop-blur">
        <p className="text-sm text-slate-500">Checking your setup…</p>
      </Card>
    );
  }

  if (needsSetup) {
    return (
      <Card className="overflow-hidden rounded-3xl border-indigo-200/60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px] shadow-xl shadow-indigo-500/20">
        <div className="rounded-[calc(1.5rem-1px)] bg-white/95 p-8 backdrop-blur">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-slate-900">First-time installation</CardTitle>
              <CardDescription className="mt-1 text-base text-slate-600">
                No administrator exists yet. Create the first account once—then use the dashboard to add more admins anytime.
              </CardDescription>
              <Button asChild className="mt-6 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg">
                <Link href={ROUTES.firstAdminSetup}>Create first admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Add another administrator</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          An admin account already exists. For security, only a signed-in administrator can create additional @stylehair.com accounts.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-12 flex-1 rounded-2xl bg-slate-900">
          <Link href={ROUTES.roleLogin}>Sign in as admin</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 flex-1 rounded-2xl border-slate-300">
          <Link href={ROUTES.adminCreateAdmin}>Open Create admin (after login)</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

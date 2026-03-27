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
                <CardTitle className="pt-2 text-3xl tracking-tight">Login</CardTitle>
                
              </CardHeader>
              <CardContent className="p-8 pt-2">
                <CustomerLoginForm />
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>
    </AppShell>
  );
}
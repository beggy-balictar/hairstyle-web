import Link from "next/link";
import { Shield, User, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { AdminLoginForm } from "@/components/forms/admin-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROUTES } from "@/lib/routes";

export default function RoleLoginPage() {
  return (
    <AppShell>
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <Brand />
            <Button asChild variant="ghost" className="rounded-2xl">
              <Link href={ROUTES.landing}>Back to landing</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl">Role selection</CardTitle>
                <CardDescription>Choose whether you are signing in as an admin or continuing as a customer.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <Tabs defaultValue="admin" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1">
                    <TabsTrigger value="admin" className="rounded-2xl">Admin</TabsTrigger>
                    <TabsTrigger value="customer" className="rounded-2xl">Customer</TabsTrigger>
                  </TabsList>
                  <TabsContent value="admin" className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 h-5 w-5 text-slate-700" />
                        <div>
                          <div className="font-medium">Admin Access</div>
                          <div className="mt-1 text-sm text-slate-500">Securely sign in to manage users, hairstyles, and system data through the admin dashboard.</div>
                        </div>
                      </div>
                    </div>
                    <AdminLoginForm />
                  </TabsContent>
                  <TabsContent value="customer" className="mt-6 space-y-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start gap-3">
                        <User className="mt-0.5 h-5 w-5 text-slate-700" />
                        <div>
                          <div className="font-medium">Customer Access</div>
                          <div className="mt-1 text-sm text-slate-500">Sign in or create an account to explore personalized hairstyle recommendations and preview styles on your face.</div>
                        </div>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="h-12 w-full rounded-2xl">
                      <Link href={ROUTES.customerLogin}>Continue as customer</Link>
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppShell>
  );
}

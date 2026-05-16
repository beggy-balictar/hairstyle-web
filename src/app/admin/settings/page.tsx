import { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Settings | StyleHair",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" description="Administrator accounts and deployment configuration." />

      <Card className="rounded-2xl border-slate-200/80 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Administrators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>Create additional @stylehair.com admins from this section.</p>
          <Button asChild className="rounded-xl bg-slate-900">
            <Link href={ROUTES.adminCreateAdmin}>Create admin account</Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}

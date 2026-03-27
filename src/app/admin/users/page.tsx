import { Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="User management" description="" />
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>User controls</CardTitle>
          
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="font-medium">Search and filter users</div>
            <p className="mt-2 text-sm text-slate-500">Connect to searchable user tables, role filters, active/disabled status filters, and server-side pagination.</p>
            <Input className="mt-4 h-11 rounded-2xl" placeholder="Search by name or email" />
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="font-medium">Update account status</div>
            <p className="mt-2 text-sm text-slate-500">Enable or disable user access and record changes in audit logs.</p>
            <div className="mt-4 flex gap-2">
              <Button className="rounded-2xl">Enable</Button>
              <Button variant="outline" className="rounded-2xl">Disable</Button>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="font-medium">Inspect account details</div>
            
            <Button variant="outline" className="mt-4 rounded-2xl">Open details panel</Button>
          </div>
        </CardContent>
      </Card>
      <EmptyPanel title="User table " description="" icon={Users} />
    </div>
  );
}
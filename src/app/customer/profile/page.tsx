import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Profile settings" description="Manage personal information, account settings, and privacy controls." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Customer profile form</CardTitle>
            <CardDescription>These fields align with PostgreSQL profile columns and editable account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input className="h-11 rounded-2xl" placeholder="First name" />
              <Input className="h-11 rounded-2xl" placeholder="Last name" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input className="h-11 rounded-2xl" placeholder="Email" />
              <Input className="h-11 rounded-2xl" placeholder="Phone number" />
            </div>
            <Textarea className="min-h-[120px] rounded-2xl" placeholder="Style preferences or notes" />
            <Button className="rounded-2xl">Save profile changes</Button>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Privacy and account controls</CardTitle>
            <CardDescription>Reserve these actions for account-level policies and customer self-service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-3xl border border-slate-200 p-5">
              <div>
                <div className="font-medium">Allow history retention</div>
                <div className="text-sm text-slate-500">Store image and recommendation history for future reference.</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="rounded-3xl border border-slate-200 p-5 text-sm text-slate-500">Connect account deletion, password update, and privacy requests to secure backend flows.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}   
import { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Profile Settings | StyleHair",
};

export default function CustomerProfilePage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Profile settings" description="" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Customer profile</CardTitle>
            
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
            
            <Button className="rounded-2xl">Save profile changes</Button>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Privacy and account controls</CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
           
           
          </CardContent>
        </Card>
      </div>
    </div>
  );
}   
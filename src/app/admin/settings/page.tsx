"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const [profilePublic, setProfilePublic] = useState(false);

  return (
    <div className="space-y-6">
      <SectionHeader title="System settings" description="" />
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Interface and policy controls</CardTitle>
          
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between rounded-3xl border border-slate-200 p-5">
            <div>
              <div className="font-medium">Allow customer profile visibility</div>
              <div className="text-sm text-slate-500">Optional setting for future public style-sharing features.</div>
            </div>
            <Switch checked={profilePublic} onCheckedChange={setProfilePublic} />
          </div>
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="font-medium">Integration placeholders</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input className="h-11 rounded-2xl" placeholder="AI service base URL" />
              <Input className="h-11 rounded-2xl" placeholder="Cloudinary cloud name" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
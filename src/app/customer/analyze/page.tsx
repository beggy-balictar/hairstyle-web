import { Camera } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { QuickActions } from "@/components/customer/quick-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerAnalyzePage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Analyze" description="" />
      <QuickActions />
      <div className="grid gap-4 lg:grid-cols-2">
        
      </div>
      <EmptyPanel title="preview" description="" icon={Camera} />
    </div>
  );
}
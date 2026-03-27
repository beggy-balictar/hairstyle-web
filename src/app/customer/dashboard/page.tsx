import { Scissors } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { QuickActions } from "@/components/customer/quick-actions";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Customer dashboard" description="" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Profile status" subtitle="" />
        <StatusCard title="Recent analysis" subtitle="" />
        <StatusCard title="Saved styles" subtitle="" />
        <StatusCard title="Feedback status" subtitle="" />
      </div>
      
      <EmptyPanel title="Recommendation" description="" icon={Scissors} />
    </div>
  );
}
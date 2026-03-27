import { BarChart3, Settings } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Admin dashboard" description="" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Total users" subtitle="" />
        <StatusCard title="Average customer satisfaction" subtitle="" />
        <StatusCard title="Total hairstyles" subtitle="" />
        <StatusCard title="Recent admin actions" subtitle="" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <EmptyPanel title="User growth analytics" description="graph" icon={BarChart3} />
      </div>
    </div>
  );
}
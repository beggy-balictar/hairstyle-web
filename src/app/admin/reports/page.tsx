import { FileText, Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports and insights" description="" />
      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard title="Average satisfaction" subtitle="" />
        <StatusCard title="Total analysis" subtitle="" />
        <StatusCard title="Completed feedback forms" subtitle="" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <EmptyPanel title="Satisfaction trend" description="" icon={Star} />
        <EmptyPanel title="report export" description="" icon={FileText} />
      </div>
    </div>
  );
}

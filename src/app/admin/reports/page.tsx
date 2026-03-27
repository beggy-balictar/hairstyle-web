import { FileText, Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports and insights" description="Monitor platform usage and customer satisfaction trends using live queries and filtered date ranges." />
      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard title="Average satisfaction" subtitle="1-5 star aggregation from customer feedback records" />
        <StatusCard title="Total analyses" subtitle="Count from face analysis or recommendation session records" />
        <StatusCard title="Completed feedback forms" subtitle="Count from reports and satisfaction inputs" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <EmptyPanel title="Satisfaction trend view" description="Reserve for time-series charts on average star rating, report volume, and completion rates." icon={Star} />
        <EmptyPanel title="Operational reporting" description="Reserve for export-ready reports on user growth, analysis activity, and hairstyle utilization." icon={FileText} />
      </div>
    </div>
  );
}

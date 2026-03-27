import { Scissors } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";
import { QuickActions } from "@/components/customer/quick-actions";

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Customer dashboard" description="Your personal area for scan, upload, recommendation history, saved styles, reporting, and experience feedback." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Profile status" subtitle="Ready for PostgreSQL-backed customer profile data" />
        <StatusCard title="Recent analysis" subtitle="Ready for latest recommendation session" />
        <StatusCard title="Saved styles" subtitle="Ready for favorites relation" />
        <StatusCard title="Feedback status" subtitle="Ready for star-rating submission state" />
      </div>
      <QuickActions />
      <EmptyPanel title="Recommendation results area" description="This dashboard section is ready to show live AI analysis summaries, top 5 hairstyle recommendations, and generated previews after backend integration." icon={Scissors} />
    </div>
  );
}
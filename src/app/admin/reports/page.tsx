import { SectionHeader } from "@/components/shared/section-header";
import { AdminReportsInsights } from "@/components/admin/admin-reports-insights";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports & feedback" description="Review customer concerns and satisfaction submissions." />
      <AdminReportsInsights />
    </div>
  );
}

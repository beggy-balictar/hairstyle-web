import { SectionHeader } from "@/components/shared/section-header";
import { AdminDashboardMetrics } from "@/components/admin/admin-dashboard-metrics";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Overview"
        description="Monitor users, catalog health, customer feedback, and live analytics."
      />
      <AdminDashboardMetrics />
    </div>
  );
}

import { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { QuickActions } from "@/components/customer/quick-actions";
import { CustomerDashboardMetrics } from "@/components/customer/customer-dashboard-metrics";

export const metadata: Metadata = {
  title: "Dashboard | StyleHair",
};

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Dashboard" description="Your activity, favorites, and feedback at a glance." />
      <CustomerDashboardMetrics />
      <QuickActions />
    </div>
  );
}

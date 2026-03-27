import { BarChart3, Settings } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Admin dashboard" description="Operational control center for user management, hairstyle catalog management, reports, and system settings." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Total users" subtitle="Connect to COUNT(*) from users table" />
        <StatusCard title="Average customer satisfaction" subtitle="Connect to AVG(rating) from satisfaction records" />
        <StatusCard title="Total hairstyles" subtitle="Connect to active hairstyle catalog count" />
        <StatusCard title="Recent admin actions" subtitle="Connect to audit trail summary" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <EmptyPanel title="User growth and satisfaction analytics" description="Reserve this section for PostgreSQL-backed charts, filtered date ranges, and analytics APIs. Recommendation logs and image moderation are intentionally removed as requested." icon={BarChart3} />
        <EmptyPanel title="Quick admin actions" description="Use this panel for buttons like Add hairstyle, Create admin account, Export reports, and Review account status changes." icon={Settings} />
      </div>
    </div>
  );
}
import { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { AdminReportsInsights } from "@/components/admin/admin-reports-insights";

export const metadata: Metadata = {
  title: "Reports | StyleHair",
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Reports & Feedback" description="Review customer concerns and satisfaction submissions." />
      <AdminReportsInsights />
    </div>
  );
}

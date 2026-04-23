import { SectionHeader } from "@/components/shared/section-header";
import { AdminHairstylesManager } from "@/components/admin/admin-hairstyles-manager";

export default function AdminHairstylesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Hairstyle catalog" description="Maintain active styles used by the recommendation system." />
      <AdminHairstylesManager />
    </div>
  );
}

import { SectionHeader } from "@/components/shared/section-header";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="User management" description="View and organize registered accounts from the database." />
      <AdminUsersTable />
    </div>
  );
}

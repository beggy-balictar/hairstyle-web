import { SectionHeader } from "@/components/shared/section-header";
import { CustomerHistoryList } from "@/components/customer/customer-history-list";

export default function CustomerHistoryPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Analysis history" description="Saved scans stored in your account." />
      <CustomerHistoryList />
    </div>
  );
}

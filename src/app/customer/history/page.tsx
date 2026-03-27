import { History } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function CustomerHistoryPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="History" description="" />
      <EmptyPanel
        title="History list"
        description=""
        icon={History}
      />
    </div>
  );
}

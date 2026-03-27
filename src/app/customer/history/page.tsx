import { History } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function CustomerHistoryPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Recommendation history" description="A structured area for previous scans, uploads, and hairstyle recommendation sessions." />
      <EmptyPanel
        title="History list ready for PostgreSQL queries"
        description="Attach this page to customer face uploads, analyses, recommendations, and preview-image records. No sample history rows are shown here."
        icon={History}
      />
    </div>
  );
}

import { Heart } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function CustomerFavoritesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Saved hairstyles" description="" />
      <EmptyPanel title="Saved list" description="" icon={Heart} />
    </div>
  );
}
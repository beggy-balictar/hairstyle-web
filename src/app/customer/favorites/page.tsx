import { Heart } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyPanel } from "@/components/shared/empty-panel";

export default function CustomerFavoritesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Saved hairstyles" description="Store and revisit preferred hairstyle recommendations from previous sessions." />
      <EmptyPanel title="Favorites collection" description="Connect this page to the favorites relation and hairstyle catalog records so customers can revisit preferred styles later." icon={Heart} />
    </div>
  );
}
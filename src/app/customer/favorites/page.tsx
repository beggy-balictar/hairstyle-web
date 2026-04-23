import { SectionHeader } from "@/components/shared/section-header";
import { FavoritesList } from "@/components/customer/favorites-list";

export default function CustomerFavoritesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Saved hairstyles" description="Styles you saved with the heart button after recommendations." />
      <FavoritesList />
    </div>
  );
}

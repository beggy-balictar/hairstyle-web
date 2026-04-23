import type { Hairstyle, HairstyleCatalogPreference } from "@prisma/client";

/**
 * Filters catalog rows by user-selected preference (men / women / all).
 * Uses `genderTag`, `category`, `name`, and `description` text — not user identity.
 * If the filter would remove every row, returns the original list so the app stays usable.
 */
export function filterHairstylesForCatalog(
  hairstyles: Hairstyle[],
  pref: HairstyleCatalogPreference,
): Hairstyle[] {
  if (pref === "ALL") return hairstyles;

  const keywords =
    pref === "MENS"
      ? ["men", "male", "guy", "gent", "barber", "masculine"]
      : ["women", "female", "lady", "girl", "fem", "feminine"];

  const filtered = hairstyles.filter((h) => {
    const blob = `${h.genderTag ?? ""} ${h.category ?? ""} ${h.name} ${h.description ?? ""}`.toLowerCase();
    return keywords.some((k) => blob.includes(k));
  });

  return filtered.length > 0 ? filtered : hairstyles;
}

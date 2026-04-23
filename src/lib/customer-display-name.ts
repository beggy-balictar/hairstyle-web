export function buildCustomerDisplayName(
  email: string,
  profile: { firstName: string; lastName: string } | null,
): string {
  if (!profile) {
    const local = email.split("@")[0];
    return local || "Customer";
  }
  const last = profile.lastName.trim() === "-" ? "" : profile.lastName.trim();
  const first = profile.firstName.trim();
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || email.split("@")[0] || "Customer";
}

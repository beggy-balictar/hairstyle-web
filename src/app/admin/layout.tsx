import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminLayoutChrome } from "@/components/admin/admin-layout-chrome";
import { getVerifiedSessionFromCookies } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getVerifiedSessionFromCookies("ADMIN");

  if (!session) {
    redirect(`${ROUTES.roleLogin}?tab=admin`);
  }

  return <AdminLayoutChrome>{children}</AdminLayoutChrome>;
}

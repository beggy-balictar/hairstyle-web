import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Camera, History, Heart, User } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { SidebarButton } from "@/components/shared/sidebar-button";
import { CustomerPageViewBeacon } from "@/components/customer/customer-page-view-beacon";
import { CustomerSignOutButton } from "@/components/customer/customer-sign-out-button";
import { getVerifiedSessionFromCookies } from "@/lib/auth-session";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const customerLinks = [
  { href: ROUTES.customerDashboard, label: "Overview", icon: Home },
  { href: ROUTES.customerAnalyze, label: "Analyze", icon: Camera },
  { href: ROUTES.customerHistory, label: "History", icon: History },
  { href: ROUTES.customerFavorites, label: "Favorites", icon: Heart },
  { href: ROUTES.customerProfile, label: "Profile", icon: User },
];

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const session = await getVerifiedSessionFromCookies("CUSTOMER");

  if (!session) {
    redirect(`${ROUTES.roleLogin}?tab=customer`);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <CustomerPageViewBeacon />
      <aside className="hidden border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="flex h-full flex-col gap-6">
          <Brand />
          <div className="space-y-2">
            {customerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <SidebarButton active={false} icon={link.icon} label={link.label} />
              </Link>
            ))}
          </div>
          <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <User className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-sm font-medium">Customer</div>
                
              </div>
            </div>
            <CustomerSignOutButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="font-semibold text-slate-900">StyleHair · Customer</div>
        </header>
        <div className="border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
            {customerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

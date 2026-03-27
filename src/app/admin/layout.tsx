import type { ReactNode } from "react";
import Link from "next/link";
import { Home, Users, Scissors, BarChart3, Settings, Shield, LogOut } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { SidebarButton } from "@/components/shared/sidebar-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";

const adminLinks = [
  { href: ROUTES.adminDashboard, label: "Overview", icon: Home },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
  { href: ROUTES.adminHairstyles, label: "Hairstyles", icon: Scissors },
  { href: ROUTES.adminReports, label: "Reports", icon: BarChart3 },
  { href: ROUTES.adminSettings, label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="flex h-full flex-col gap-6">
          <Brand />
          <div className="space-y-2">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <SidebarButton active={false} icon={link.icon} label={link.label} />
              </Link>
            ))}
          </div>
          <div className="mt-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <Shield className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-slate-500"></div>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full rounded-2xl">
              <Link href={ROUTES.landing}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Link>
            </Button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div>
            
            <div className="font-semibold">Administrator</div>
          </div>
         
        </header>
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
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

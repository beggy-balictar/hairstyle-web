"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Home, Users, Scissors, BarChart3, Settings, Shield, Menu, X } from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { ROUTES } from "@/lib/routes";

const adminLinks = [
  { href: ROUTES.adminDashboard, label: "Overview", icon: Home },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
  { href: ROUTES.adminHairstyles, label: "Hairstyles", icon: Scissors },
  { href: ROUTES.adminReports, label: "Reports", icon: BarChart3 },
  { href: ROUTES.adminSettings, label: "Settings", icon: Settings },
];

export function AdminLayoutChrome({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#f8fafc_0%,#eef2ff_45%,#faf5ff_100%)] md:grid md:grid-cols-[272px_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-white/50 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 px-5 py-6 text-white shadow-xl shadow-indigo-950/20 md:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_0%,rgba(99,102,241,0.35),transparent),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.15),transparent)]" />
        <div className="relative flex h-full flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
            <Brand inverted />
          </div>
          <AdminSidebarNav links={adminLinks} />
          <div className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                <Shield className="h-5 w-5 text-amber-200" />
              </div>
              <div>
                <div className="text-sm font-medium">Control panel</div>
                <div className="text-xs text-slate-300">StyleHair admin</div>
              </div>
            </div>
            <AdminSignOutButton />
          </div>
        </div>
      </aside>
      <div className={sidebarOpen ? "min-w-0 pointer-events-none" : "min-w-0"}>
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200/80 bg-white/75 px-4 py-4 backdrop-blur-md sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">StyleHair admin</p>
              <div className="font-semibold text-slate-900">Control panel</div>
            </div>
          </div>
        </header>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 pointer-events-auto bg-slate-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex h-full w-full">
              <div className="relative z-10 pointer-events-auto flex h-full w-80 flex-col overflow-y-auto border-r border-white/10 bg-slate-950 px-5 py-6 text-white shadow-2xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
                    <Brand inverted />
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:bg-slate-800"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <AdminSidebarNav links={adminLinks} />
                <div className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                      <Shield className="h-5 w-5 text-amber-200" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Control panel</div>
                      <div className="text-xs text-slate-300">StyleHair admin</div>
                    </div>
                  </div>
                  <AdminSignOutButton />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
          <AdminMobileNav links={adminLinks.map(({ href, label }) => ({ href, label }))} />
        </div>
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-40%,rgba(99,102,241,0.12),transparent),radial-gradient(circle_at_100%_0%,rgba(244,114,182,0.08),transparent)]" />
      {children}
    </div>
  );
}

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

export function SidebarButton({
  active,
  icon: Icon,
  label,
  onDark,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
        onDark
          ? active
            ? "bg-white text-slate-900 shadow-lg shadow-black/10"
            : "text-slate-200/90 hover:bg-white/10 hover:text-white"
          : active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: "default" | "secondary";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "secondary" ? "bg-slate-100 text-slate-700" : "bg-slate-900 text-white",
        className
      )}
    >
      {children}
    </span>
  );
}

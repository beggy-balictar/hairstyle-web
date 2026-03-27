import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-slate-50 p-4", className)}>{children}</div>;
}

export function AlertTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("text-sm font-semibold text-slate-900", className)}>{children}</div>;
}

export function AlertDescription({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mt-1 text-sm leading-6 text-slate-500", className)}>{children}</div>;
}

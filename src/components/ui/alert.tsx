import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  className?: string;
  children: ReactNode;
}

interface AlertTitleProps {
  className?: string;
  children: ReactNode;
}

interface AlertDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function Alert({ className, children }: Readonly<AlertProps>) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-slate-50 p-4", className)}>{children}</div>;
}

export function AlertTitle({ className, children }: Readonly<AlertTitleProps>) {
  return <div className={cn("text-sm font-semibold text-slate-900", className)}>{children}</div>;
}

export function AlertDescription({ className, children }: Readonly<AlertDescriptionProps>) {
  return <div className={cn("mt-1 text-sm leading-6 text-slate-500", className)}>{children}</div>;
}

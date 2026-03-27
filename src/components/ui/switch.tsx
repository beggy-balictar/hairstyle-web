"use client";

import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  defaultChecked,
}: {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  defaultChecked?: boolean;
}) {
  const active = checked ?? defaultChecked ?? false;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onCheckedChange?.(!active)}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full transition",
        active ? "bg-slate-900" : "bg-slate-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white transition",
          active ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}

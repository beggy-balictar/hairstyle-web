"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminMobileNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
              active
                ? "border-indigo-200 bg-indigo-50 font-medium text-indigo-900"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

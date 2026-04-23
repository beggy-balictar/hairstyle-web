"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { SidebarButton } from "@/components/shared/sidebar-button";

export function AdminSidebarNav({
  links,
}: {
  links: { href: string; label: string; icon: ComponentType<{ className?: string }> }[];
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-2">
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link key={link.href} href={link.href}>
            <SidebarButton active={active} icon={link.icon} label={link.label} onDark />
          </Link>
        );
      })}
    </div>
  );
}

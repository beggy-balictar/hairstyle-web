"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function CustomerPageViewBeacon() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastSent.current === pathname) return;
    lastSent.current = pathname;

    void fetch("/api/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ path: pathname }),
    });
  }, [pathname]);

  return null;
}

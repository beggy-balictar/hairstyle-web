"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export function AdminSignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="w-full rounded-2xl border-white/25 bg-white/10 text-white hover:bg-white/15 hover:text-white"
      onClick={() => {
        void (async () => {
          await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
          router.push(ROUTES.roleLogin);
          router.refresh();
        })();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" /> Sign out
    </Button>
  );
}

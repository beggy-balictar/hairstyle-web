"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

export function CustomerSignOutButton() {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function signOut() {
    if (sending) {
      return;
    }

    setSending(true);
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push(`${ROUTES.roleLogin}?signedOut=1`);
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      className="h-11 min-h-[44px] w-full rounded-2xl touch-manipulation"
      onClick={() => {
        void signOut();
      }}
      disabled={sending}
    >
      <LogOut className="mr-2 h-4 w-4" /> Sign out
    </Button>
  );
}

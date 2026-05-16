"use client";

import { useEffect, useState } from "react";

type LoginToastProps = {
  show: boolean;
};

export default function LoginToast({ show }: LoginToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      const params = new URLSearchParams(window.location.search);
      params.delete("signedOut");
      const search = params.toString();
      const newUrl = `${window.location.pathname}${search ? `?${search}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [show]);

  if (!show || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white shadow-xl shadow-slate-900/30">
      Account Signed Out!
    </div>
  );
}

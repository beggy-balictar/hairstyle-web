"use client";

import { useEffect, useState } from "react";

type LoginToastProps = {
  show: boolean;
  message?: string;
  clearQueryParam?: string;
};

export default function LoginToast({
  show,
  message = "Account Signed Out!",
  clearQueryParam = "signedOut",
}: LoginToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(() => {
      setIsVisible(false);

      if (!clearQueryParam) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      params.delete(clearQueryParam);
      const search = params.toString();
      const newUrl = `${window.location.pathname}${search ? `?${search}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [show, clearQueryParam]);

  if (!show || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-white shadow-xl shadow-slate-900/30">
      {message}
    </div>
  );
}

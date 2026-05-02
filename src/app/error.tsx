"use client";

import { useEffect } from "react";

/**
 * Required by Next.js App Router when runtime errors occur; without it, dev can
 * return a broken HTML shell that mobile clients would otherwise surface as text.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 p-6 font-sans text-slate-900">
      <h1 className="text-xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-center text-sm text-slate-600">
        {process.env.NODE_ENV === "development" ? error.message : "Please try again later."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}

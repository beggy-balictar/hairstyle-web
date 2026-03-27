import Link from "next/link";
import { AppShell } from "@/components/shared/app-shell";
import { Brand } from "@/components/layout/brand";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <Brand />
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The requested page does not exist in the current StylehAIr UI shell.
          </p>
          <Link
            href={ROUTES.landing}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Return to landing page
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

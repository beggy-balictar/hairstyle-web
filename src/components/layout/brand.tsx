import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/routes";

export function Brand() {
  return (
    <Link href={ROUTES.landing} className="inline-flex items-center gap-3 text-inherit">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
        <Sparkles className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-lg font-semibold tracking-tight">StylehAIr</span>
        <span className="block text-xs opacity-70">AI hairstyle recommendation platform</span>
      </span>
    </Link>
  );
}

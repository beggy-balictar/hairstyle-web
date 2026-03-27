import { Scissors } from "lucide-react";

export function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
        <Scissors className="h-5 w-5" />
      </div>
      <div>
        <div className="brand-rainbow text-lg font-semibold tracking-tight">StyleHᴀɪR</div>
        <div className="text-xs text-slate-500">AI-assisted hairstyle recommendation system</div>
      </div>
    </div>
  );
}

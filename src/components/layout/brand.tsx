import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const BRAND_MARK = `StyleH${"\u1D00"}${"\u026A"}R`;

type BrandProps = {
  /** Frosted mark + light subtitle for dark admin chrome */
  inverted?: boolean;
  /** Solid mark; light subtitle on dark hero sections */
  onDarkBackground?: boolean;
};

export function Brand({ inverted, onDarkBackground }: BrandProps) {
  const lightSubtitle = inverted || onDarkBackground;
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm",
          inverted ? "bg-white/15 text-white ring-1 ring-white/20" : "bg-slate-900 text-white",
        )}
      >
        <Scissors className="h-5 w-5" />
      </div>
      <div>
        <div className="brand-rainbow text-lg font-semibold tracking-tight">{BRAND_MARK}</div>
        <div
          className={cn(
            "text-xs font-medium",
            lightSubtitle ? "text-slate-200" : "text-slate-800",
          )}
        >
          AI-assisted hairstyle recommendation system
        </div>
      </div>
    </div>
  );
}

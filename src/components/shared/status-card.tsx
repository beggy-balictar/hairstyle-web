import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StatusCard({
  title,
  subtitle,
  value,
}: {
  title: string;
  subtitle?: string;
  value?: ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {value !== undefined ? (
          <div className="text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
        ) : (
          <div className="h-10 animate-pulse rounded-2xl bg-slate-100" aria-hidden />
        )}
      </CardContent>
    </Card>
  );
}

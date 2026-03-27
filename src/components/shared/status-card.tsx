import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StatusCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          This area is ready for live PostgreSQL-backed content.
        </div>
      </CardContent>
    </Card>
  );
}
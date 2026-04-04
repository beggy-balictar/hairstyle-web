import { BarChart3, CalendarRange, TrendingUp, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusCard } from "@/components/shared/status-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Admin dashboard" description="" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard title="Total users" subtitle="" />
        <StatusCard title="Average customer satisfaction" subtitle="" />
        <StatusCard title="Total hairstyles" subtitle="" />
        <StatusCard title="Recent admin actions" subtitle="" />
      </div>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>User growth analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-2">
                <Users className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="font-medium">Monthly user growth</div>
                <p className="mt-2 text-sm text-slate-500">
                  Connect this area to PostgreSQL user registrations grouped by month to show how the customer base is growing over time.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-2">
                <TrendingUp className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="font-medium">Growth comparison</div>
                <p className="mt-2 text-sm text-slate-500">
                  Reserve this section for percentage change, new-account trends, and returning activity comparisons across selected periods.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5 md:col-span-2 xl:col-span-1">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-2">
                <CalendarRange className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <div className="font-medium">Date range filters</div>
                <p className="mt-2 text-sm text-slate-500">
                  Keep this ready for filter controls like weekly, monthly, quarterly, or custom date ranges when analytics queries are connected.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 md:col-span-2 xl:col-span-3">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <div className="font-medium text-slate-900">Chart area</div>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Replace this space with a line chart or bar chart for user growth analytics once the dashboard is connected to live metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

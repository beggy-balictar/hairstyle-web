"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type GrowthChartRow = {
  label: string;
  customers: number;
  pageViews: number;
  reports: number;
  analyses: number;
  avgSatisfaction: number | null;
};

const axisTick = { fill: "#64748b", fontSize: 11 };
const grid = { stroke: "#e2e8f0", strokeDasharray: "3 3" as const };

type SatisfactionPoint = {
  label: string;
  avg: number | null;
  changeFromPrev: number | null;
  trend: "up" | "down" | "same" | "none";
};

function buildSatisfactionSeries(data: GrowthChartRow[]): SatisfactionPoint[] {
  let lastVal: number | null = null;
  return data.map((d) => {
    const avg = d.avgSatisfaction;
    if (avg == null) {
      return { label: d.label, avg: null, changeFromPrev: null, trend: "none" as const };
    }
    let changeFromPrev: number | null = null;
    let trend: SatisfactionPoint["trend"] = "none";
    if (lastVal != null) {
      changeFromPrev = Math.round((avg - lastVal) * 100) / 100;
      if (changeFromPrev > 0.01) trend = "up";
      else if (changeFromPrev < -0.01) trend = "down";
      else trend = "same";
    }
    lastVal = avg;
    return { label: d.label, avg, changeFromPrev, trend };
  });
}

function satisfactionPeriodSummary(points: SatisfactionPoint[]) {
  const vals = points.map((p) => p.avg).filter((v): v is number => v != null);
  if (vals.length === 0) return { periodAvg: null as number | null, startEnd: null as string | null, latestDelta: null as string | null };
  const sum = vals.reduce((a, b) => a + b, 0);
  const periodAvg = Math.round((sum / vals.length) * 100) / 100;
  const first = vals[0];
  const last = vals[vals.length - 1];
  const overall = Math.round((last - first) * 100) / 100;
  const startEnd =
    vals.length >= 2
      ? `${overall > 0.01 ? "↑" : overall < -0.01 ? "↓" : "→"} ${overall > 0 ? "+" : ""}${overall.toFixed(2)} from first to last month with ratings`
      : "Only one month with ratings in this window";

  const lastPoint = [...points].reverse().find((p) => p.avg != null);
  let latestDelta: string | null = null;
  if (lastPoint && lastPoint.changeFromPrev != null) {
    const d = lastPoint.changeFromPrev;
    const arrow = d > 0 ? "↑" : d < 0 ? "↓" : "→";
    latestDelta = `Latest step: ${arrow} ${d > 0 ? "+" : ""}${d.toFixed(2)} vs previous month with data`;
  } else if (lastPoint) {
    latestDelta = "Latest month: baseline (no earlier rating to compare)";
  }

  return { periodAvg, startEnd, latestDelta };
}

function SatisfactionDot(props: {
  cx?: number;
  cy?: number;
  payload?: SatisfactionPoint;
}) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || payload?.avg == null) return null;
  const { trend } = payload;
  const fill =
    trend === "up" ? "#059669" : trend === "down" ? "#dc2626" : trend === "same" ? "#64748b" : "#7c3aed";
  return <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number | string; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-semibold text-slate-800">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((p) => (
          <li key={p.name} className="flex items-center gap-2 text-slate-600">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span>
              {p.name}: <span className="font-medium text-slate-900">{p.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface AdminGrowthChartsProps {
  data: GrowthChartRow[];
}

export function AdminGrowthCharts({ data }: Readonly<AdminGrowthChartsProps>) {
  const satisfactionSeries = buildSatisfactionSeries(data);
  const satSummary = satisfactionPeriodSummary(satisfactionSeries);

  if (!data.length) {
    return <p className="text-sm text-slate-500">No analytics data for the selected period yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">Acquisition &amp; activity</h3>
        <p className="mb-4 text-xs text-slate-500">New customer accounts, app sessions (page views), and face analyses per month.</p>
        <div className="h-[280px] w-full min-w-0 md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis yAxisId="left" tick={axisTick} axisLine={false} tickLine={false} width={36} />
              <YAxis yAxisId="right" orientation="right" tick={axisTick} axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar yAxisId="left" dataKey="customers" name="New customers" fill="#312e81" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="pageViews"
                name="Page views"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0ea5e9" }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="analyses"
                name="Face analyses"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3, fill: "#10b981" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">Satisfaction trend</h3>
        <p className="text-xs text-slate-500">
          Average rating per month (1–5). Dots are green when the average <span className="font-medium text-emerald-700">rises</span>, red when it{" "}
          <span className="font-medium text-red-700">falls</span>, gray when flat, purple for the first month with data.
        </p>
        {satSummary.periodAvg != null ? (
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] leading-snug">
            <span className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 font-medium text-violet-900">
              Period average: {satSummary.periodAvg.toFixed(2)}
            </span>
            {satSummary.startEnd ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">{satSummary.startEnd}</span>
            ) : null}
            {satSummary.latestDelta ? (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">{satSummary.latestDelta}</span>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500">No satisfaction submissions yet in this window.</p>
        )}
        <div className="mt-4 h-[280px] w-full min-w-0 md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satisfactionSeries} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis domain={[1, 5]} tick={axisTick} axisLine={false} tickLine={false} width={28} />
              {satSummary.periodAvg != null ? (
                <ReferenceLine
                  y={satSummary.periodAvg}
                  stroke="#94a3b8"
                  strokeDasharray="6 4"
                  label={{
                    value: `Avg ${satSummary.periodAvg.toFixed(2)}`,
                    position: "right",
                    fill: "#64748b",
                    fontSize: 10,
                  }}
                />
              ) : null}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.[0]) return null;
                  const row = payload[0].payload as SatisfactionPoint;
                  const v = row.avg;
                  if (v == null || Number.isNaN(Number(v))) {
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg">
                        {label}: <span className="text-slate-500">No responses</span>
                      </div>
                    );
                  }
                  const delta = row.changeFromPrev;
                  const deltaText =
                    delta == null
                      ? null
                      : `${delta > 0 ? "↑" : delta < 0 ? "↓" : "→"} ${delta > 0 ? "+" : ""}${delta.toFixed(2)} vs prior month with data`;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg">
                      <span className="font-semibold text-slate-800">{label}</span>
                      <p className="mt-1 text-slate-600">
                        Avg. rating: <span className="font-medium text-slate-900">{Number(v).toFixed(2)}</span>
                      </p>
                      {deltaText ? <p className="mt-1 text-slate-600">{deltaText}</p> : null}
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="avg"
                name="Avg. satisfaction"
                stroke="#6d28d9"
                strokeWidth={2.5}
                connectNulls={false}
                dot={(dotProps) => <SatisfactionDot {...dotProps} />}
                activeDot={{ r: 7, stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Dashed line = mean rating across months that have data in this chart.</p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5 lg:col-span-2">
        <h3 className="mb-1 text-sm font-semibold text-slate-900">Customer reports</h3>
        <p className="mb-4 text-xs text-slate-500">Volume of feedback and issue reports submitted each month.</p>
        <div className="h-[240px] w-full min-w-0 md:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid {...grid} />
              <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: "#cbd5e1" }} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="reports" name="Reports" fill="#c4b5fd" stroke="#7c3aed" strokeWidth={2} fillOpacity={0.35} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

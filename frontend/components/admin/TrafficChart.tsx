"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = { date: string; visitors: number; pageViews: number };

function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

type TrafficChartProps = {
  data: DataPoint[];
  metric?: "visitors" | "pageViews";
};

export function TrafficChart({ data, metric = "visitors" }: TrafficChartProps) {
  if (!data.length) return null;

  const chartData = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
    value: d[metric],
  }));

  const maxValue = Math.max(1, ...chartData.map((d) => d.value));
  const yDomain = [0, maxValue] as [number, number];

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e4e4e7"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#71717a" }}
            dy={8}
          />
          <YAxis
            dataKey="value"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#71717a" }}
            width={28}
            tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            domain={yDomain}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{ color: "#3f3f46", fontWeight: 600 }}
            formatter={(value: number | undefined) => [
              value ?? 0,
              metric === "visitors" ? "Visitors" : "Page Views",
            ]}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#trafficGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

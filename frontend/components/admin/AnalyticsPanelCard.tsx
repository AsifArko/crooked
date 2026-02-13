"use client";

import * as React from "react";
import { Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalyticsPanelCardProps = React.ComponentProps<"div"> & {
  title: string;
  metricLabel?: string;
};

function AnalyticsPanelCard({
  title,
  metricLabel = "VISITORS",
  className,
  children,
  ...props
}: AnalyticsPanelCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
          {metricLabel}
        </span>
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

type TopPagesCardProps = {
  items: { path: string; visitors: number }[];
  emptyMessage?: string;
};

function TopPagesCard({ items, emptyMessage = "No data" }: TopPagesCardProps) {
  return (
    <AnalyticsPanelCard title="Top Pages">
      {items.length > 0 ? (
        <div className="max-h-[260px] overflow-y-auto -mx-1">
          {items.map((item, i) => (
            <div
              key={item.path}
              className={cn(
                "flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors",
                i === 0
                  ? "bg-zinc-100/80"
                  : "hover:bg-zinc-50"
              )}
            >
              <span className="text-[13px] text-zinc-700 truncate flex-1 font-mono">
                {item.path || "/"}
              </span>
              <span className="text-[13px] font-semibold text-zinc-900 ml-4 shrink-0 tabular-nums">
                {item.visitors}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-zinc-400 py-10 text-center">
          {emptyMessage}
        </p>
      )}
    </AnalyticsPanelCard>
  );
}

type DeviceItem = { device: string; visitors: number; percentage: number };

type DevicesBreakdownCardProps = {
  items: DeviceItem[];
  emptyMessage?: string;
};

function DevicesBreakdownCard({
  items,
  emptyMessage = "No data",
}: DevicesBreakdownCardProps) {
  return (
    <AnalyticsPanelCard title="Devices">
      {items.length > 0 ? (
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.device}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-zinc-700">{item.device}</span>
                <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-300 rounded-full transition-all duration-300 min-w-[2px]"
                  style={{ width: `${Math.max(item.percentage, 1)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-zinc-400 py-10 text-center">
          {emptyMessage}
        </p>
      )}
    </AnalyticsPanelCard>
  );
}

type CountryItem = {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
};

function countryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2 || countryCode === "??")
    return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
  );
}

type CountriesCardProps = {
  items: CountryItem[];
  emptyMessage?: string;
};

function CountriesCard({
  items,
  emptyMessage = "No data",
}: CountriesCardProps) {
  return (
    <AnalyticsPanelCard title="Countries">
      {items.length > 0 ? (
        <div className="space-y-5 max-h-[260px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.countryCode + item.country}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {item.countryCode && item.countryCode !== "??" && (
                    <span className="text-lg leading-none shrink-0">
                      {countryFlag(item.countryCode)}
                    </span>
                  )}
                  <span className="text-[13px] text-zinc-700 truncate">
                    {item.country}
                  </span>
                </div>
                <span className="text-[13px] font-semibold text-zinc-900 shrink-0 ml-2 tabular-nums">
                  {item.percentage}%
                </span>
              </div>
              <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-300 rounded-full transition-all duration-300 min-w-[2px]"
                  style={{ width: `${Math.max(item.percentage, 1)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-zinc-400 py-10 text-center">
          {emptyMessage}
        </p>
      )}
    </AnalyticsPanelCard>
  );
}

function DeviceIcon({ device }: { device: string }) {
  if (device === "Desktop") return <Monitor className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
  if (device === "Mobile" || device === "Tablet") return <Smartphone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
  return <Monitor className="h-3.5 w-3.5 text-zinc-400 shrink-0" />;
}

function DevicesBreakdownContent({
  items,
  emptyMessage,
}: {
  items: DeviceItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-[13px] text-zinc-400 py-10 text-center">
        {emptyMessage}
      </p>
    );
  }
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.device}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DeviceIcon device={item.device} />
              <span className="text-[13px] text-zinc-700">{item.device}</span>
            </div>
            <span className="text-[13px] font-semibold text-zinc-900 tabular-nums">
              {item.percentage}%
            </span>
          </div>
          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-300 rounded-full transition-all duration-300 min-w-[2px]"
              style={{ width: `${Math.max(item.percentage, 1)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type DevicesBrowsersCardProps = {
  deviceItems: DeviceItem[];
  emptyMessage?: string;
};

function DevicesBrowsersCard({
  deviceItems,
  emptyMessage = "No data",
}: DevicesBrowsersCardProps) {
  const [activeTab, setActiveTab] = React.useState<"devices" | "browsers">(
    "devices"
  );

  return (
    <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("devices")}
            className={cn(
              "text-[13px] font-medium pb-2 -mb-px border-b-2 transition-colors",
              activeTab === "devices"
                ? "text-zinc-900 border-zinc-900"
                : "text-zinc-500 border-transparent hover:text-zinc-700"
            )}
          >
            Devices
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("browsers")}
            className={cn(
              "text-[13px] font-medium pb-2 -mb-px border-b-2 transition-colors",
              activeTab === "browsers"
                ? "text-zinc-900 border-zinc-900"
                : "text-zinc-500 border-transparent hover:text-zinc-700"
            )}
          >
            Browsers
          </button>
        </div>
        <span className="text-[11px] text-zinc-400 uppercase tracking-widest font-medium">
          Visitors
        </span>
      </div>
      <div className="px-5 pb-5 pt-4">
        {activeTab === "devices" ? (
          <DevicesBreakdownContent
            items={deviceItems}
            emptyMessage={emptyMessage}
          />
        ) : (
          <div className="py-10 text-center">
            <p className="text-[13px] text-zinc-400">Browser data coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}

export {
  AnalyticsPanelCard,
  TopPagesCard,
  DevicesBreakdownCard,
  CountriesCard,
  DevicesBrowsersCard,
};
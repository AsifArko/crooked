"use client";

import type { Overview } from "./types";

type OverviewTabProps = {
  overview: Overview | null;
};

export function OverviewTab({ overview }: OverviewTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-lg border border-gray-200 bg-blue-50/50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total Page Views</span>
        </div>
        <p className="text-2xl font-bold mt-1">{overview?.totalPageViews ?? 0}</p>
        <p className="text-xs text-gray-500 mt-1">
          +{overview?.pageViewsChange ?? 0}% from last month
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-amber-50/50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Active Users</span>
        </div>
        <p className="text-2xl font-bold mt-1">{overview?.activeUsers ?? 0}</p>
        <p className="text-xs text-gray-500 mt-1">Unique sessions today</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-emerald-50/50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">System Health</span>
        </div>
        <p className="text-2xl font-bold mt-1">{overview?.systemHealth ?? 0}</p>
        <p className="text-xs text-gray-500 mt-1">Critical/High errors</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Conversions</span>
        </div>
        <p className="text-2xl font-bold mt-1">{overview?.conversions ?? 0}</p>
        <p className="text-xs text-gray-500 mt-1">Total conversions</p>
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { TablePagination } from "./TablePagination";
import { PAGE_SIZE, formatDate } from "./constants";
import type { SystemMetric } from "./types";

type SystemMetricsTabProps = {
  systemMetrics: { items: SystemMetric[]; total: number; page: number } | null;
  onPageChange: (page: number) => void;
};

export function SystemMetricsTab({ systemMetrics, onPageChange }: SystemMetricsTabProps) {
  const items = systemMetrics?.items ?? [];
  const isLoading = systemMetrics === null;
  const isEmpty = !isLoading && items.length === 0;

  return (
    <>
      <h2 className="text-lg font-semibold mb-1">System Metrics</h2>
      <p className="text-sm text-gray-500 mb-4">
        Monitor server performance and resource utilization
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      ) : isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 py-12 px-6 text-center text-sm text-gray-500">
          No system metrics found. Metrics are recorded periodically and when you first view this tab.
        </div>
      ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[26%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Unit</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={row._id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
              >
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {row.metricType ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {row.value != null ? row.value.toFixed(2) : "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {row.unit ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <Badge
                    variant={row.status === "Critical" ? "destructive" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {row.status ?? "Normal"}
                  </Badge>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {formatDate(row.recordedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <TablePagination
        page={systemMetrics?.page ?? 1}
        total={systemMetrics?.total ?? 0}
        limit={PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

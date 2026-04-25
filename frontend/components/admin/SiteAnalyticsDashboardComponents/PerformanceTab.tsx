"use client";

import { TablePagination } from "./TablePagination";
import { PAGE_SIZE, formatDate } from "./constants";
import type { PerformanceMetric } from "./types";

type PerformanceTabProps = {
  performance: { items: PerformanceMetric[]; total: number; page: number } | null;
  onPageChange: (page: number) => void;
};

export function PerformanceTab({ performance, onPageChange }: PerformanceTabProps) {
  const items = performance?.items ?? [];

  return (
    <>
      <h2 className="text-lg font-semibold mb-1">Performance Metrics</h2>
      <p className="text-sm text-gray-500 mb-4">
        Core Web Vitals and performance indicators
      </p>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[30%]" />
            <col className="w-[22%]" />
            <col className="w-[26%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Value (ms)</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Session ID</th>
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
                    {row.metric ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {row.value != null ? String(row.value) : "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span
                    title={row.url ?? ""}
                    className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-700"
                  >
                    {row.url ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span
                    title={row.sessionId ?? ""}
                    className="inline-block max-w-full truncate rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700"
                  >
                    {row.sessionId ?? "—"}
                  </span>
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
      <TablePagination
        page={performance?.page ?? 1}
        total={performance?.total ?? 0}
        limit={PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

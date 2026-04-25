"use client";

import { Badge } from "@/components/ui/badge";
import { TablePagination } from "./TablePagination";
import { PAGE_SIZE, formatDate } from "./constants";
import type { ErrorLog } from "./types";

type ErrorLogsTabProps = {
  errorLogs: { items: ErrorLog[]; total: number; page: number } | null;
  onPageChange: (page: number) => void;
};

export function ErrorLogsTab({ errorLogs, onPageChange }: ErrorLogsTabProps) {
  const items = errorLogs?.items ?? [];
  const isLoading = errorLogs === null;
  const isEmpty = !isLoading && items.length === 0;

  return (
    <>
      <h2 className="text-lg font-semibold mb-1">Error Logs</h2>
      <p className="text-sm text-gray-500 mb-4">
        Track and monitor application errors and issues
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      ) : isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 py-12 px-6 text-center text-sm text-gray-500">
          No error logs found. Errors are captured automatically when they occur in the app.
        </div>
      ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[28%]" />
            <col className="w-[10%]" />
            <col className="w-[20%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Error Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Message</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Severity</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
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
                    {row.errorType ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span
                    title={row.message ?? ""}
                    className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-700"
                  >
                    {row.message ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <Badge
                    variant={
                      row.severity === "critical" || row.severity === "high"
                        ? "destructive"
                        : "secondary"
                    }
                    className="rounded-full text-xs"
                  >
                    {row.severity ?? "—"}
                  </Badge>
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
                  <span className="inline-block max-w-full truncate rounded bg-gray-50 px-2 py-1 text-xs text-gray-600">
                    {formatDate(row.recordedAt)}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <Badge
                    variant={row.status === "Open" ? "destructive" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {row.status ?? "Open"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <TablePagination
        page={errorLogs?.page ?? 1}
        total={errorLogs?.total ?? 0}
        limit={PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

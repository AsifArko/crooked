"use client";

import { TablePagination } from "./TablePagination";
import { PAGE_SIZE } from "./constants";
import type { UserEvent } from "./types";

function trimSessionId(sessionId: string | undefined): string {
  if (!sessionId) return "—";
  return sessionId.replace(/^session_/i, "") || sessionId;
}

function urlPathOnly(url: string | undefined): string {
  if (!url) return "—";
  try {
    const u = new URL(url, "https://_");
    return u.pathname || "/";
  } catch {
    return url;
  }
}

const cellClass = "inline-block max-w-full truncate font-mono text-[11px] text-gray-400";

type EventsTabProps = {
  events: { items: UserEvent[]; total: number; page: number } | null;
  onPageChange: (page: number) => void;
};

export function EventsTab({ events, onPageChange }: EventsTabProps) {
  const items = events?.items ?? [];
  const isLoading = events === null;
  const isEmpty = !isLoading && items.length === 0;

  return (
    <>
      <h2 className="text-lg font-semibold mb-1">User Events</h2>
      <p className="text-sm text-gray-500 mb-4">
        Monitor user interactions and behavior patterns. Events are tracked on navigation and other interactions.
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
        </div>
      ) : isEmpty ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 py-12 px-6 text-center text-sm text-gray-500">
          No events found for this filter. Events appear as users navigate and interact with the site.
        </div>
      ) : (
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Event Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Path</th>
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
                  <span className={cellClass} title={row.eventType ?? ""}>
                    {row.eventType ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className={cellClass} title={row.eventName ?? ""}>
                    {row.eventName ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className={cellClass} title={row.url ?? ""}>
                    {urlPathOnly(row.url)}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span
                    title={row.sessionId ?? ""}
                    className="inline-block max-w-[100px] truncate font-mono text-[10px] text-gray-400"
                  >
                    {trimSessionId(row.sessionId)}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className={cellClass} title={row.recordedAt ?? ""}>
                    {row.recordedAt ?? "—"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <TablePagination
        page={events?.page ?? 1}
        total={events?.total ?? 0}
        limit={PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

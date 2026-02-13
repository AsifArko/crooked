"use client";

import { Monitor, User, Clipboard, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { TablePagination } from "./TablePagination";
import { PAGE_SIZE } from "./constants";
import type { PageView } from "./types";

type PageViewsTabProps = {
  pageViews: { items: PageView[]; total: number; page: number } | null;
  mySessionIds: string[];
  onPageChange: (page: number) => void;
};

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

function countryFlag(countryCode: string | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map(
      (c) => 0x1f1e6 + (c.charCodeAt(0) - 65),
    ),
  );
}

function getDeviceLabel(ua: string | undefined): string {
  if (!ua) return "—";
  const lower = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(lower)) return "ios";
  if (/android/.test(lower)) return "android";
  if (/macintosh|mac os/.test(lower)) return "mac";
  if (/windows/.test(lower)) return "windows";
  if (/linux/.test(lower)) return "linux";
  return "other";
}

function SourceCell({
  row,
  mySessionIds,
}: {
  row: PageView;
  mySessionIds: string[];
}) {
  const isMe = Boolean(row.sessionId && mySessionIds.includes(row.sessionId));

  return isMe ? (
    <span title="This device">
      <Monitor className="h-4 w-4 text-emerald-600 shrink-0" />
    </span>
  ) : (
    <span title="Other device">
      <User className="h-4 w-4 text-gray-400 shrink-0" />
    </span>
  );
}

function UserAgentCopyCell({ userAgent }: { userAgent: string | undefined }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    if (!userAgent) return;
    navigator.clipboard.writeText(userAgent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [userAgent]);

  return (
    <button
      type="button"
      onClick={copy}
      className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      title="Copy user agent"
    >
      {copied ? (
        <Check className="h-3.5 w-3 text-emerald-600" />
      ) : (
        <Clipboard className="h-3.5 w-3" />
      )}
    </button>
  );
}

function PathCopyCell({ url }: { url: string | undefined }) {
  const path = urlPathOnly(url);

  const copy = useCallback(() => {
    if (!path || path === "—") return;
    navigator.clipboard.writeText(path);
  }, [path]);

  return (
    <button
      type="button"
      onClick={copy}
      className="block w-full text-left max-w-[180px] truncate text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer"
      title="Click to copy path"
    >
      {path}
    </button>
  );
}

const DEVICE_STYLES: Record<string, string> = {
  ios: "rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600",
  android:
    "rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700",
  mac: "rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600",
  windows:
    "rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700",
  linux:
    "rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700",
  other:
    "rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500",
};

function CountryCell({
  countryCode,
  country,
}: {
  countryCode?: string;
  country?: string;
}) {
  const flag = countryCode ? countryFlag(countryCode) : "";
  const code = countryCode ?? "—";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1 text-xs text-gray-600"
      title={country ?? code}
    >
      {flag && <span className="text-base leading-none">{flag}</span>}
      <span className="font-medium">{code}</span>
    </span>
  );
}

export function PageViewsTab({
  pageViews,
  mySessionIds,
  onPageChange,
}: PageViewsTabProps) {
  const items = pageViews?.items ?? [];

  return (
    <>
      <h2 className="text-lg font-semibold mb-1">Page Views</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 w-14">
                Source
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Timestamp
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                IP
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Country
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                URL
              </th>
              {/* <th className="text-left py-3 px-4 font-semibold text-gray-700">Session ID</th> */}
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Device
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 w-12">
                User Agent
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr
                key={row._id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50"
              >
                <td className="py-2.5 px-4 align-middle">
                  <SourceCell row={row} mySessionIds={mySessionIds} />
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block max-w-[200px] truncate font-mono text-[11px] text-gray-400">
                    {row.recordedAt ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <span className="inline-block rounded bg-gray-50 px-2 py-1 font-mono text-xs text-gray-600">
                    {row.ipAddress ?? "—"}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <CountryCell
                    countryCode={row.countryCode}
                    country={row.country}
                  />
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <PathCopyCell url={row.url} />
                </td>
                {/* <td className="py-2.5 px-4 align-middle">
                  <span
                    title={row.sessionId ?? ""}
                    className="inline-block max-w-[100px] truncate font-mono text-[10px] text-gray-400"
                  >
                    {trimSessionId(row.sessionId)}
                  </span>
                </td> */}
                <td className="py-2.5 px-4 align-middle">
                  <span
                    className={`inline-block capitalize ${DEVICE_STYLES[getDeviceLabel(row.userAgent)] ?? DEVICE_STYLES.other}`}
                  >
                    {getDeviceLabel(row.userAgent)}
                  </span>
                </td>
                <td className="py-2.5 px-4 align-middle">
                  <UserAgentCopyCell userAgent={row.userAgent} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={pageViews?.page ?? 1}
        total={pageViews?.total ?? 0}
        limit={PAGE_SIZE}
        onPageChange={onPageChange}
      />
    </>
  );
}

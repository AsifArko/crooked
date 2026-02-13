"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

type AnalyticsFiltersProps = {
  search: string;
  onSearchChange: (v: string) => void;
  dateRange: string;
  onDateRangeChange: (v: string) => void;
  eventType: string;
  onEventTypeChange: (v: string) => void;
  severity: string;
  onSeverityChange: (v: string) => void;
  performanceMetric: string;
  onPerformanceMetricChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  requestSource: "all" | "me" | "others";
  onRequestSourceChange: (v: "all" | "me" | "others") => void;
  activeTab: string;
};

export function AnalyticsFilters({
  search,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  eventType,
  onEventTypeChange,
  severity,
  onSeverityChange,
  performanceMetric,
  onPerformanceMetricChange,
  status,
  onStatusChange,
  requestSource,
  onRequestSourceChange,
  activeTab,
}: AnalyticsFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 shrink-0" />
          <Input
            placeholder="Search URL, session ID, event type, error message..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={dateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventType} onValueChange={onEventTypeChange}>
            <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
              <SelectValue placeholder="Events" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="scroll">Scroll</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={onSeverityChange}>
            <SelectTrigger className="w-[150px] h-10 bg-gray-50 border-gray-200">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={performanceMetric} onValueChange={onPerformanceMetricChange}>
            <SelectTrigger className="w-[140px] h-10 bg-gray-50 border-gray-200">
              <SelectValue placeholder="Metrics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="LCP">LCP</SelectItem>
              <SelectItem value="FID">FID</SelectItem>
              <SelectItem value="CLS">CLS</SelectItem>
              <SelectItem value="FCP">FCP</SelectItem>
              <SelectItem value="TTFB">TTFB</SelectItem>
            </SelectContent>
          </Select>
          {(activeTab === "page-views" || activeTab === "events") && (
            <Select value={requestSource} onValueChange={(v) => onRequestSourceChange(v as "all" | "me" | "others")}>
              <SelectTrigger className="w-[160px] h-10 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Request source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All requests</SelectItem>
                <SelectItem value="me">My device only</SelectItem>
                <SelectItem value="others">Others only</SelectItem>
              </SelectContent>
            </Select>
          )}
          {activeTab === "error-logs" && (
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[120px] h-10 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          )}
          {activeTab === "system-metrics" && (
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[120px] h-10 bg-gray-50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}

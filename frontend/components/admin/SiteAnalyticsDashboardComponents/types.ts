export type Overview = {
  totalPageViews: number;
  pageViewsChange?: number;
  activeUsers: number;
  systemHealth: number;
  conversions: number;
};

export type PageView = {
  _id: string;
  url?: string;
  sessionId?: string;
  recordedAt: string;
  loadTimeMs?: number;
  userAgent?: string;
  ipAddress?: string;
  hostname?: string;
  referrer?: string;
  country?: string;
  countryCode?: string;
  webVitals?: { lcp?: number; fcp?: number; cls?: number; ttfb?: number };
};

export type UserEvent = {
  _id: string;
  eventType?: string;
  eventName?: string;
  url?: string;
  sessionId?: string;
  recordedAt: string;
};

export type ErrorLog = {
  _id: string;
  errorType?: string;
  message?: string;
  severity?: string;
  url?: string;
  recordedAt: string;
  status?: string;
};

export type SystemMetric = {
  _id: string;
  metricType?: string;
  value?: number;
  unit?: string;
  status?: string;
  recordedAt: string;
};

export type PerformanceMetric = {
  _id: string;
  metric?: string;
  value?: number;
  url?: string;
  sessionId?: string;
  recordedAt: string;
};

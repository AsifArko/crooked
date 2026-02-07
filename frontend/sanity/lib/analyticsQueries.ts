import { defineQuery } from "next-sanity";

export const pageViewsQuery = defineQuery(`
  *[_type == "pageView"] | order(recordedAt desc) [$from...$to] {
    _id,
    url,
    sessionId,
    ipAddress,
    hostname,
    userAgent,
    loadTimeMs,
    referrer,
    recordedAt
  }
`);

export const pageViewsCountQuery = defineQuery(`
  count(*[_type == "pageView"])
`);

export const userEventsQuery = defineQuery(`
  *[_type == "userEvent"] | order(recordedAt desc) [$from...$to] {
    _id,
    eventType,
    eventName,
    url,
    sessionId,
    ipAddress,
    hostname,
    metadata,
    recordedAt
  }
`);

export const userEventsCountQuery = defineQuery(`
  count(*[_type == "userEvent"])
`);

export const errorLogsQuery = defineQuery(`
  *[_type == "errorLog"] | order(recordedAt desc) [$from...$to] {
    _id,
    errorType,
    message,
    severity,
    url,
    ipAddress,
    hostname,
    stackTrace,
    status,
    recordedAt
  }
`);

export const errorLogsCountQuery = defineQuery(`
  count(*[_type == "errorLog"])
`);

export const systemMetricsQuery = defineQuery(`
  *[_type == "systemMetric"] | order(recordedAt desc) [$from...$to] {
    _id,
    metricType,
    value,
    unit,
    status,
    recordedAt
  }
`);

export const systemMetricsCountQuery = defineQuery(`
  count(*[_type == "systemMetric"])
`);

export const performanceMetricsQuery = defineQuery(`
  *[_type == "performanceMetric"] | order(recordedAt desc) [$from...$to] {
    _id,
    metric,
    value,
    url,
    sessionId,
    ipAddress,
    hostname,
    recordedAt
  }
`);

export const performanceMetricsCountQuery = defineQuery(`
  count(*[_type == "performanceMetric"])
`);

export const resumeDownloadsQuery = defineQuery(`
  *[_type == "resumeDownload"] | order(recordedAt desc) [$from...$to] {
    _id,
    ipAddress,
    hostname,
    userAgent,
    sessionId,
    referrer,
    recordedAt
  }
`);

export const resumeDownloadsCountQuery = defineQuery(`
  count(*[_type == "resumeDownload"])
`);

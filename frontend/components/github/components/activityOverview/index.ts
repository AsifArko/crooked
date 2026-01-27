export { ActivitySummary } from "./ActivitySummary";
export { ActivityGraph } from "./ActivityGraph";
export { ActivityOverview } from "./ActivityOverview";

// New modular components
export { UserAvatar } from "./UserAvatar";
export { OrganizationInfo } from "./OrganizationInfo";
export { RepositoryList } from "./RepositoryList";
export { UserHeader } from "./UserHeader";
export { ActivityTitle } from "./ActivityTitle";
export { EmptyStateIcon } from "./EmptyStateIcon";

// Types and config
export type { ActivitySummaryConfig, ActivitySummaryProps, Organization } from "./types";
export { 
  DEFAULT_ACTIVITY_SUMMARY_CONFIG, 
  COMPACT_ACTIVITY_SUMMARY_CONFIG, 
  LARGE_ACTIVITY_SUMMARY_CONFIG 
} from "./config";

// Radar Chart exports
export type {
  ContributionBreakdown,
  RadarDataPoint,
  RadarChartConfig,
  RadarChartColors,
  ActivityGraphProps,
} from "./ActivityGraph";

export {
  COMPACT_RADAR_CONFIG,
  LARGE_RADAR_CONFIG,
  MINIMAL_RADAR_CONFIG,
  DARK_RADAR_COLORS,
  LIGHT_RADAR_COLORS,
  GREEN_RADAR_COLORS,
} from "./ActivityGraph";

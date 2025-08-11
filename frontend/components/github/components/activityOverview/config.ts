import { ActivitySummaryConfig } from "./types";

export const DEFAULT_ACTIVITY_SUMMARY_CONFIG: ActivitySummaryConfig = {
  // Display options
  showUserHeader: true,
  showTitle: true,
  showRepositoryList: true,

  // Styling options
  variant: "compact", // Use compact variant for original subtle styling
  avatarSize: "sm",

  // Repository list options
  maxRepositories: 3,
  showRepositoryTotal: true,

  // Customization
  title: "Activity overview",
  emptyMessage: "No repositories found",
};

export const COMPACT_ACTIVITY_SUMMARY_CONFIG: ActivitySummaryConfig = {
  ...DEFAULT_ACTIVITY_SUMMARY_CONFIG,
  variant: "compact",
  maxRepositories: 2,
};

export const LARGE_ACTIVITY_SUMMARY_CONFIG: ActivitySummaryConfig = {
  ...DEFAULT_ACTIVITY_SUMMARY_CONFIG,
  variant: "large",
  avatarSize: "md",
  maxRepositories: 4,
};

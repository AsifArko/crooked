import { exitCode } from "process";

// Main Component
export { GitHubContributions } from "./components/contributions/GitHubContributions";

// UI Components
export { LoadingSpinner } from "./components/contributions/LoadingSpinner";
export { ErrorDisplay } from "./components/contributions/ErrorDisplay";
export { Header } from "./components/contributions/Header";
export { Username } from "./components/contributions/Username";
export { MonthLabels } from "./components/contributions/MonthLabels";
export { ContributionGrid } from "./components/contributions/ContributionGrid";
export { Legend } from "./components/contributions/Legend";
export { Tooltip } from "./components/contributions/Tooltip";

// Examples
export { BasicExample } from "./examples/BasicExample";
export { AdvancedExample } from "./examples/AdvancedExample";
export { GithubActivity } from "./components/GithubActivity";

// Types
export type {
  Contribution,
  ContributionDay,
  GitHubContributionsData,
  GitHubContributionsConfig,
  TooltipConfig,
  WeekData,
  MonthLabel,
  ColorScheme,
  GitHubAPIResponse,
} from "./lib/types";

// Constants
export {
  DEFAULT_COLOR_SCHEMES,
  DEFAULT_CONFIG,
  CONTRIBUTION_THRESHOLDS,
  GRID_CONFIG,
  ANIMATION_CONFIG,
  TOOLTIP_CONFIG,
  MONTH_NAMES,
} from "./lib/constants";

// Utilities
export {
  getContributionColor,
  formatTooltipText,
  calculateTooltipPosition,
  generateDateRange,
  createDateMap,
  generateAllDates,
  generateWeeks,
  generateMonthLabels,
  getSquareSize,
  getGapSize,
  formatContributionCount,
  getAccessibilityLabel,
} from "./lib/utils";

// Hooks
export {
  useGitHubContributions,
  useContributionData,
  useColorScheme,
  useTooltipState,
} from "./lib/hooks";

import { ColorScheme } from "./types";

export const DEFAULT_COLOR_SCHEMES: Record<string, ColorScheme> = {
  github: {
    empty: "bg-[#ebedf0] dark:bg-[#161b22]",
    low: "bg-[#9be9a8] dark:bg-[#0e4429]",
    medium: "bg-[#40c463] dark:bg-[#006d32]",
    high: "bg-[#30a14e] dark:bg-[#26a641]",
    veryHigh: "bg-[#216e39] dark:bg-[#39d353]",
  },
  custom: {
    empty: "bg-gray-100 dark:bg-gray-800",
    low: "bg-green-200 dark:bg-green-800",
    medium: "bg-green-400 dark:bg-green-600",
    high: "bg-green-600 dark:bg-green-400",
    veryHigh: "bg-green-800 dark:bg-green-200",
  },
};

export const DEFAULT_CONFIG = {
  compact: false,
  showHeader: true,
  showLegend: true,
  showMonthLabels: true,
  theme: "auto" as const,
  colorScheme: "github" as const,
  tooltipPosition: "auto" as const,
  animation: true,
  accessibility: true,
};

export const CONTRIBUTION_THRESHOLDS = {
  LOW: 3,
  MEDIUM: 6,
  HIGH: 9,
};

export const GRID_CONFIG = {
  WEEKS: 53,
  DAYS_PER_WEEK: 7,
  TOTAL_DAYS: 365,
};

export const ANIMATION_CONFIG = {
  HOVER_SCALE: 1.25,
  TAP_SCALE: 0.9,
  DURATION: 0.15,
};

export const TOOLTIP_CONFIG = {
  OFFSET_Y: 40,
  MIN_X: 100,
  MIN_Y: 50,
  Z_INDEX: 9999,
};

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface Contribution {
  date: string;
  contributionCount: number;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  month: number;
  day: number;
  year: number;
}

export interface GitHubContributionsData {
  contributions: Contribution[];
  totalContributions: number;
  username: string;
}

export interface GitHubContributionsConfig {
  username: string;
  className?: string;
  compact?: boolean;
  showHeader?: boolean;
  showLegend?: boolean;
  showMonthLabels?: boolean;
  theme?: "light" | "dark" | "auto";
  colorScheme?: "github" | "custom";
  customColors?: {
    empty: string;
    low: string;
    medium: string;
    high: string;
    veryHigh: string;
  };
  tooltipPosition?: "top" | "bottom" | "auto";
  animation?: boolean;
  accessibility?: boolean;
}

export interface TooltipConfig {
  position: { x: number; y: number };
  content: string;
  visible: boolean;
}

export interface WeekData {
  weekIndex: number;
  days: ContributionDay[];
}

export interface MonthLabel {
  month: string;
  monthNum: number;
  year: number;
  key: string;
  position: number;
}

export interface ColorScheme {
  empty: string;
  low: string;
  medium: string;
  high: string;
  veryHigh: string;
}

export interface GitHubAPIResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    };
  };
}

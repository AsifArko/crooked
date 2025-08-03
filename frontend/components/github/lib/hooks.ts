import { useState, useEffect, useMemo } from "react";
import {
  Contribution,
  GitHubContributionsData,
  GitHubContributionsConfig,
} from "./types";
import { DEFAULT_COLOR_SCHEMES, DEFAULT_CONFIG } from "./constants";
import {
  generateDateRange,
  createDateMap,
  generateAllDates,
  generateWeeks,
  generateMonthLabels,
} from "./utils";

export function useGitHubContributions(config: GitHubContributionsConfig) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/github/contributions?username=${config.username}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch contributions");
        }

        const data: GitHubContributionsData = await response.json();
        setContributions(data.contributions);
        setTotalContributions(data.totalContributions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch contributions"
        );
      } finally {
        setLoading(false);
      }
    };

    if (config.username) {
      fetchContributions();
    }
  }, [config.username]);

  return {
    contributions,
    loading,
    error,
    totalContributions,
  };
}

export function useContributionData(contributions: Contribution[]) {
  return useMemo(() => {
    if (contributions.length === 0) {
      return {
        weeks: [],
        monthLabels: [],
        dateRange: { startDate: new Date(), endDate: new Date() },
      };
    }

    const { startDate, endDate } = generateDateRange();
    const dateMap = createDateMap(contributions);
    const allDates = generateAllDates(startDate, dateMap);
    const weeks = generateWeeks(allDates);
    const monthLabels = generateMonthLabels(weeks);

    return {
      weeks,
      monthLabels,
      dateRange: { startDate, endDate },
    };
  }, [contributions]);
}

export function useColorScheme(config: GitHubContributionsConfig) {
  return useMemo(() => {
    const colorScheme = config.colorScheme || DEFAULT_CONFIG.colorScheme;
    const customColors = config.customColors;

    if (colorScheme === "custom" && customColors) {
      return customColors;
    }

    return DEFAULT_COLOR_SCHEMES[colorScheme];
  }, [config.colorScheme, config.customColors]);
}

export function useTooltipState() {
  const [hoveredDay, setHoveredDay] = useState<Contribution | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (day: Contribution, event: React.MouseEvent) => {
    console.log("Hovering over:", day.date, day.contributionCount);
    setHoveredDay(day);

    // Find the container for relative positioning
    const container = event.currentTarget.closest(".overflow-hidden");
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = container?.getBoundingClientRect();

    if (containerRect) {
      // Position relative to the container
      let x = rect.left - containerRect.left + rect.width / 2;
      let y = rect.top - containerRect.top - 40;

      // Tooltip dimensions
      const tooltipWidth = 200;
      const tooltipHeight = 60;

      // Horizontal positioning - allow slight overflow
      if (x < 50) x = 50;
      if (x > containerRect.width - 50) x = containerRect.width - 50;

      // Vertical positioning - always show the tooltip
      if (y < 0) {
        // If no space above, show below
        y = rect.bottom - containerRect.top + 10;
      }

      // If it would go below container, show above even if it clips
      if (y > containerRect.height - tooltipHeight) {
        y = rect.top - containerRect.top - tooltipHeight - 10;
      }

      setTooltipPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  return {
    hoveredDay,
    tooltipPosition,
    handleMouseEnter,
    handleMouseLeave,
  };
}

export const useActivityOverview = (username: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/github/activity-overview?username=${username}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch activity overview"
          );
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch activity overview"
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchActivityOverview();
    }
  }, [username]);

  return { data, loading, error };
};

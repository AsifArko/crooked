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
    setHoveredDay(day);
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = rect.left + rect.width / 2;
    let y = rect.top - 40;

    // Ensure tooltip doesn't go off-screen
    if (x < 100) x = 100;
    if (x > viewportWidth - 100) x = viewportWidth - 100;
    if (y < 50) y = rect.bottom + 10;

    setTooltipPosition({ x, y });
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

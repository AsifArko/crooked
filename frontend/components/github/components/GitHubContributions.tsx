"use client";

import { GitHubContributionsConfig } from "../lib/types";
import { DEFAULT_CONFIG } from "../lib/constants";
import {
  useGitHubContributions,
  useContributionData,
  useColorScheme,
  useTooltipState,
} from "../lib/hooks";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorDisplay } from "./ErrorDisplay";
import { Header } from "./Header";
import { Username } from "./Username";
import { MonthLabels } from "./MonthLabels";
import { ContributionGrid } from "./ContributionGrid";
import { Legend } from "./Legend";
import { Tooltip } from "./Tooltip";

interface GitHubContributionsProps extends Partial<GitHubContributionsConfig> {
  username: string;
}

export function GitHubContributions(props: GitHubContributionsProps) {
  const config: GitHubContributionsConfig = {
    username: props.username,
    className: props.className,
    compact: props.compact ?? DEFAULT_CONFIG.compact,
    showHeader: props.showHeader ?? DEFAULT_CONFIG.showHeader,
    showLegend: props.showLegend ?? DEFAULT_CONFIG.showLegend,
    showMonthLabels: props.showMonthLabels ?? DEFAULT_CONFIG.showMonthLabels,
    theme: props.theme ?? DEFAULT_CONFIG.theme,
    colorScheme: props.colorScheme ?? DEFAULT_CONFIG.colorScheme,
    customColors: props.customColors,
    tooltipPosition: props.tooltipPosition ?? DEFAULT_CONFIG.tooltipPosition,
    animation: props.animation ?? DEFAULT_CONFIG.animation,
    accessibility: props.accessibility ?? DEFAULT_CONFIG.accessibility,
  };

  const { contributions, loading, error, totalContributions } =
    useGitHubContributions(config);
  const { weeks, monthLabels } = useContributionData(contributions);
  const colorScheme = useColorScheme(config);
  const { hoveredDay, tooltipPosition, handleMouseEnter, handleMouseLeave } =
    useTooltipState();

  if (loading) {
    return <LoadingSpinner config={config} />;
  }

  if (error) {
    return <ErrorDisplay config={config} error={error} />;
  }

  return (
    <div className={config.className || ""}>
      <Header config={config} totalContributions={totalContributions} />
      <Username config={config} />

      <div className="relative">
        <MonthLabels config={config} monthLabels={monthLabels} />

        <ContributionGrid
          config={config}
          weeks={weeks}
          colorScheme={colorScheme}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {/* <Legend config={config} colorScheme={colorScheme} /> */}
      </div>

      <Tooltip
        config={config}
        hoveredDay={hoveredDay}
        tooltipPosition={tooltipPosition}
      />
    </div>
  );
}

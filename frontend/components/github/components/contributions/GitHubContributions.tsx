"use client";

import { GitHubContributionsConfig } from "../../lib/types";
import { DEFAULT_CONFIG } from "../../lib/constants";
import {
  useGitHubContributions,
  useContributionData,
  useColorScheme,
  useTooltipState,
} from "../../lib/hooks";

import { ErrorDisplay } from "./ErrorDisplay";
import { Header } from "./Header";
import { Username } from "./Username";
import { MonthLabels } from "./MonthLabels";
import { ContributionGrid } from "./ContributionGrid";
import { Legend } from "./Legend";
import { Tooltip } from "./Tooltip";
import { GlassCard } from "../../../ui/card";
import clsx from "clsx";

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
    return (
      <GlassCard className={clsx("flex flex-col", config.className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-muted-foreground">
            Loading contributions...
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return <ErrorDisplay config={config} error={error} />;
  }

  return (
    <GlassCard className={clsx("flex flex-col", config.className)}>
      <div className="flex items-center gap-2 mb-4">
        <a
          href="https://www.github.com/asifarko"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-normal text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
        >
          @{config.username}
        </a>
        <span className="ml-2 px-2 py-0.5 rounded bg-muted/50 text-muted-foreground text-xs font-normal">
          {totalContributions} contributions
        </span>
      </div>
      <div className="relative flex flex-col">
        <MonthLabels config={config} monthLabels={monthLabels} />
        <div className="flex items-center justify-center relative">
          <div className="relative w-full overflow-visible">
            <ContributionGrid
              config={config}
              weeks={weeks}
              colorScheme={colorScheme}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
            <Tooltip
              config={config}
              hoveredDay={hoveredDay}
              tooltipPosition={tooltipPosition}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Legend config={config} colorScheme={colorScheme} />
        </div>
      </div>
    </GlassCard>
  );
}

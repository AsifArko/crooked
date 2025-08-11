"use client";

import React from "react";
import Image from "next/image";
import { ActivitySummary } from "./ActivitySummary";
import { ActivityGraph } from "./ActivityGraph";
import { useActivityOverview } from "../../lib/hooks";
import { DEFAULT_CONFIG } from "../../lib/constants";
import { GitHubContributionsConfig } from "../../lib/types";
import { GlassCard } from "../../../ui/card";
import clsx from "clsx";

interface ActivityOverviewProps extends Partial<GitHubContributionsConfig> {
  username: string;
}

export const ActivityOverview: React.FC<ActivityOverviewProps> = ({
  username,
  className,
  compact = DEFAULT_CONFIG.compact,
  showHeader = DEFAULT_CONFIG.showHeader,
  showLegend = DEFAULT_CONFIG.showLegend,
  showMonthLabels = DEFAULT_CONFIG.showMonthLabels,
  theme = DEFAULT_CONFIG.theme,
  colorScheme = DEFAULT_CONFIG.colorScheme,
  customColors,
  tooltipPosition = DEFAULT_CONFIG.tooltipPosition,
  animation = DEFAULT_CONFIG.animation,
  accessibility = DEFAULT_CONFIG.accessibility,
}) => {
  const config: GitHubContributionsConfig = {
    username,
    className,
    compact,
    showHeader,
    showLegend,
    showMonthLabels,
    theme,
    colorScheme,
    customColors,
    tooltipPosition,
    animation,
    accessibility,
  };

  const { data, loading, error } = useActivityOverview(username);

  if (loading) {
    return (
      <GlassCard className={clsx("flex flex-col", config.className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-muted-foreground">
            Loading activity overview...
          </div>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className={clsx("flex flex-col", config.className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-red-500">Error: {error}</div>
        </div>
      </GlassCard>
    );
  }

  if (!data) {
    return (
      <GlassCard className={clsx("flex flex-col", config.className)}>
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-muted-foreground">No data available</div>
        </div>
      </GlassCard>
    );
  }

  const {
    repositories,
    totalRepositories,
    contributionBreakdown,
    organizations,
  } = data;

  return (
    <GlassCard className={clsx("flex flex-col", config.className)}>
      <div className="flex flex-col sm:flex-row items-stretch justify-between flex-1">
        <ActivitySummary
          repositories={repositories}
          totalRepositories={totalRepositories}
          organizations={organizations}
          username={username}
        />

        {/* Subtle divider */}
        <div className="hidden sm:block w-px bg-border/50 mx-4 self-stretch"></div>

        <ActivityGraph contributionBreakdown={contributionBreakdown} />
      </div>
    </GlassCard>
  );
};

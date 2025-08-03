"use client";

import React from "react";
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
      <div className="flex items-center gap-2 mb-4">
        {organizations && organizations.length > 0 ? (
          <>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800">
              <span className="text-white text-xs font-normal">
                {organizations[0].login.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-normal text-muted-foreground">
              @{organizations[0].login}
            </span>
            {organizations.length > 1 && (
              <>
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800">
                  <span className="text-white text-xs font-normal">
                    {organizations[1].login.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  @{organizations[1].login}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800">
              <span className="text-white text-xs font-normal">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs font-normal text-muted-foreground">
              @{username}
            </span>
          </>
        )}
      </div>

      <div className="flex-1 flex gap-4 items-start">
        <ActivitySummary
          repositories={repositories}
          totalRepositories={totalRepositories}
        />

        {/* Subtle divider */}
        <div className="w-px h-16 bg-border/50 mx-2"></div>

        <ActivityGraph contributionBreakdown={contributionBreakdown} />
      </div>
    </GlassCard>
  );
};

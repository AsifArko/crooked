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
      <div className="flex items-center gap-1.5 mb-3">
        {organizations && organizations.length > 0 ? (
          <>
            <div className="w-5 h-5 rounded-full shadow-sm border border-white dark:border-zinc-800 overflow-hidden">
              <img
                src={organizations[0].avatarUrl}
                alt={organizations[0].login}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="w-full h-full bg-blue-500 flex items-center justify-center hidden">
                <span className="text-white text-[10px] font-normal">
                  {organizations[0].login.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground">
              @{organizations[0].login}
            </span>
            {organizations.length > 1 && (
              <>
                <div className="w-5 h-5 rounded-full shadow-sm border border-white dark:border-zinc-800 overflow-hidden">
                  <img
                    src={organizations[1].avatarUrl}
                    alt={organizations[1].login}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center hidden">
                    <span className="text-white text-[10px] font-normal">
                      {organizations[1].login.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-normal text-muted-foreground">
                  @{organizations[1].login}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-zinc-800">
              <span className="text-white text-[10px] font-normal">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-[11px] font-normal text-muted-foreground">
              @{username}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch justify-between flex-1">
        <ActivitySummary
          repositories={repositories}
          totalRepositories={totalRepositories}
        />

        {/* Subtle divider */}
        <div className="hidden sm:block w-px bg-border/50 mx-4 self-stretch"></div>

        <ActivityGraph contributionBreakdown={contributionBreakdown} />
      </div>
    </GlassCard>
  );
};

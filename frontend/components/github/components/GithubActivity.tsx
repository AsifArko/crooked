import React from "react";
import { GitHubContributions } from "./contributions/GitHubContributions";
import { ActivityOverview } from "./activityOverview/ActivityOverview";

export const GithubActivity = () => {
  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
            <span className="text-xs font-medium text-primary/80 uppercase tracking-[0.25em]">
              Github Activity
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* GitHub Contributions - full width */}
          <div className="flex-1">
            <GitHubContributions
              username="asifarko"
              showHeader={false}
              showLegend={true}
              showMonthLabels={true}
              theme="dark"
              colorScheme="github"
              animation={true}
            />
          </div>

          {/* Activity Overview - full width */}
          <div className="flex-1">
            <ActivityOverview username="asifarko" />
          </div>
        </div>
      </div>
    </section>
  );
};

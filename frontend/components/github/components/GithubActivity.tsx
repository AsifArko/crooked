import React from "react";
import { GitHubContributions } from "./GitHubContributions";

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

        <div className="flex justify-left">
          <div className="w-full max-w-4xl">
            <GitHubContributions
              username="asifarko"
              className="border border-border/50 rounded-lg p-6 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm"
              showHeader={false}
              showLegend={true}
              showMonthLabels={true}
              theme="dark"
              colorScheme="github"
              animation={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import React from "react";

interface ContributionBreakdown {
  commits: number;
  pullRequests: number;
  issues: number;
  codeReviews: number;
}

interface ActivityGraphProps {
  contributionBreakdown: ContributionBreakdown;
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({
  contributionBreakdown,
}) => {
  const { commits, pullRequests, issues, codeReviews } = contributionBreakdown;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div
        className="w-full max-w-full sm:max-w-[180px] flex flex-col justify-center"
        key={`activity-${commits}-${pullRequests}-${issues}-${codeReviews}`}
      >
        {/* Minimal debug to keep progress bars visible */}
        <div className="text-xs text-transparent h-0 overflow-hidden">
          {JSON.stringify({ commits, pullRequests, issues, codeReviews })}
        </div>

        {/* Clean horizontal bar chart */}
        <div className="space-y-3">
          {/* Commits */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 sm:w-16 text-xs text-muted-foreground">
              Commits
            </div>
            <div className="flex-1 bg-gray-200 rounded h-1">
              <div
                className="bg-green-600 h-1 rounded"
                style={{ width: `${commits || 0}%` }}
              ></div>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 text-xs text-muted-foreground text-right">
              {commits || 0}%
            </div>
          </div>

          {/* Pull Requests */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 sm:w-16 text-xs text-muted-foreground">
              PRs
            </div>
            <div className="flex-1 bg-gray-200 rounded h-1">
              <div
                className="bg-green-600 h-1 rounded"
                style={{ width: `${pullRequests || 0}%` }}
              ></div>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 text-xs text-muted-foreground text-right">
              {pullRequests || 0}%
            </div>
          </div>

          {/* Issues */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 sm:w-16 text-xs text-muted-foreground">
              Issues
            </div>
            <div className="flex-1 bg-gray-200 rounded h-1">
              <div
                className="bg-green-600 h-1 rounded"
                style={{ width: `${issues || 0}%` }}
              ></div>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 text-xs text-muted-foreground text-right">
              {issues || 0}%
            </div>
          </div>

          {/* Code Reviews */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-12 sm:w-16 text-xs text-muted-foreground">
              Reviews
            </div>
            <div className="flex-1 bg-gray-200 rounded h-1">
              <div
                className="bg-green-600 h-1 rounded"
                style={{ width: `${codeReviews || 0}%` }}
              ></div>
            </div>
            <div className="hidden sm:block w-6 sm:w-8 text-xs text-muted-foreground text-right">
              {codeReviews || 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

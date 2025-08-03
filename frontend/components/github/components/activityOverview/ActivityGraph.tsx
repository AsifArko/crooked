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
      <div className="w-full max-w-[180px]">
        {/* Clean horizontal bar chart */}
        <div className="space-y-3">
          {/* Commits */}
          <div className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">Commits</div>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-[#238636] h-1 rounded-full transition-all duration-300"
                style={{ width: `${commits}%` }}
              ></div>
            </div>
            <div className="w-8 text-xs text-muted-foreground text-right">
              {commits}%
            </div>
          </div>

          {/* Pull Requests */}
          <div className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">PRs</div>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-[#238636] h-1 rounded-full transition-all duration-300"
                style={{ width: `${pullRequests}%` }}
              ></div>
            </div>
            <div className="w-8 text-xs text-muted-foreground text-right">
              {pullRequests}%
            </div>
          </div>

          {/* Issues */}
          <div className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">Issues</div>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-[#238636] h-1 rounded-full transition-all duration-300"
                style={{ width: `${issues}%` }}
              ></div>
            </div>
            <div className="w-8 text-xs text-muted-foreground text-right">
              {issues}%
            </div>
          </div>

          {/* Code Reviews */}
          <div className="flex items-center gap-3">
            <div className="w-16 text-xs text-muted-foreground">Reviews</div>
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-[#238636] h-1 rounded-full transition-all duration-300"
                style={{ width: `${codeReviews}%` }}
              ></div>
            </div>
            <div className="w-8 text-xs text-muted-foreground text-right">
              {codeReviews}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

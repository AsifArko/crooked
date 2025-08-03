import React from "react";

interface ActivitySummaryProps {
  repositories: string[];
  totalRepositories: number;
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  repositories,
  totalRepositories,
}) => {
  const displayedRepos = repositories?.slice(0, 3) || [];
  const remainingCount = (totalRepositories || 0) - displayedRepos.length;

  if (!repositories || repositories.length === 0) {
    return (
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          Activity overview
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="inline-flex items-center gap-1 mr-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a2 2 0 00-2 2v1H4a2 2 0 01-2-2V6zm5 0a1 1 0 011-1h2a1 1 0 011 1v1H7V6z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          No repositories found
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <h3 className="text-xs font-normal text-muted-foreground mb-2">
        Activity overview
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="inline-flex items-center gap-1 mr-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a2 2 0 00-2 2v1H4a2 2 0 01-2-2V6zm5 0a1 1 0 011-1h2a1 1 0 011 1v1H7V6z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        Contributed to{" "}
        {displayedRepos.map((repo, index) => (
          <React.Fragment key={repo}>
            <a
              href={`https://github.com/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline font-normal transition-colors"
            >
              {repo}
            </a>
            {index < displayedRepos.length - 1 && ", "}
          </React.Fragment>
        ))}
        {remainingCount > 0 && (
          <>
            {" "}
            and{" "}
            <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-normal">
              {remainingCount} other repositories
            </span>
          </>
        )}
      </p>
    </div>
  );
};

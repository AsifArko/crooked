import React from "react";

interface RepositoryListProps {
  repositories: string[];
  totalRepositories: number;
  maxDisplayed?: number;
  showTotal?: boolean;
  className?: string;
  linkClassName?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  totalRepositories,
  maxDisplayed = 3,
  showTotal = true,
  className,
  linkClassName = "text-gray-600 hover:text-gray-800 hover:underline font-normal transition-colors",
  emptyMessage = "No repositories found",
  emptyIcon,
}) => {
  if (!repositories || repositories.length === 0) {
    return (
      <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
        {emptyIcon && (
          <span className="inline-flex items-center gap-1 mr-1">
            {emptyIcon}
          </span>
        )}
        {emptyMessage}
      </p>
    );
  }

  const displayedRepos = repositories.slice(0, maxDisplayed);
  const remainingCount = totalRepositories - displayedRepos.length;

  return (
    <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>
      Contributed to{" "}
      {displayedRepos.map((repo, index) => (
        <React.Fragment key={repo}>
          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {repo.replace(/^[^/]+\//, "")}
          </a>
          {index < displayedRepos.length - 1 && ", "}
        </React.Fragment>
      ))}
      {showTotal && remainingCount > 0 && (
        <>
          {" "}
          and{" "}
          <span className="text-gray-600 hover:text-gray-800 cursor-pointer font-normal">
            {remainingCount} other repositories
          </span>
        </>
      )}
    </p>
  );
};

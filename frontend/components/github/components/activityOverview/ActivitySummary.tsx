import React from "react";
import { UserHeader } from "./UserHeader";
import { ActivityTitle } from "./ActivityTitle";
import { RepositoryList } from "./RepositoryList";
import { EmptyStateIcon } from "./EmptyStateIcon";
import { ActivitySummaryProps } from "./types";
import { DEFAULT_ACTIVITY_SUMMARY_CONFIG } from "./config";
import { cn } from "@/lib/utils";

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  repositories,
  totalRepositories,
  organizations,
  username,
  config = {},
}) => {
  // Merge with default config
  const finalConfig = { ...DEFAULT_ACTIVITY_SUMMARY_CONFIG, ...config };
  
  const {
    showUserHeader,
    showTitle,
    showRepositoryList,
    variant,
    avatarSize,
    maxRepositories,
    showRepositoryTotal,
    title,
    emptyMessage,
    className,
    userHeaderClassName,
    titleClassName,
    repositoryListClassName,
  } = finalConfig;

  // Early return for empty state
  if (!repositories || repositories.length === 0) {
    return (
      <div className={cn("flex-1", className)}>
        {showUserHeader && (
          <UserHeader
            username={username}
            organizations={organizations}
            avatarSize={avatarSize}
            className={cn("mb-3", userHeaderClassName)}
          />
        )}
        
        {showTitle && (
          <ActivityTitle
            title={title}
            variant={variant}
            className={titleClassName}
          />
        )}
        
        {showRepositoryList && (
          <RepositoryList
            repositories={[]}
            totalRepositories={0}
            emptyMessage={emptyMessage}
            emptyIcon={<EmptyStateIcon className="w-3 h-3" />}
            className={repositoryListClassName}
          />
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col justify-center", className)}>
      {showUserHeader && (
        <UserHeader
          username={username}
          organizations={organizations}
          avatarSize={avatarSize}
          className={cn("mb-3", userHeaderClassName)}
        />
      )}
      
      {showTitle && (
        <ActivityTitle
          title={title}
          variant={variant}
          className={cn("mb-2", titleClassName)}
        />
      )}
      
      {showRepositoryList && (
        <RepositoryList
          repositories={repositories}
          totalRepositories={totalRepositories}
          maxDisplayed={maxRepositories}
          showTotal={showRepositoryTotal}
          className={repositoryListClassName}
        />
      )}
    </div>
  );
};

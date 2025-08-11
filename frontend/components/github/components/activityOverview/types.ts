export interface Organization {
  login: string;
  avatarUrl: string;
}

export interface ActivitySummaryConfig {
  // Display options
  showUserHeader?: boolean;
  showTitle?: boolean;
  showRepositoryList?: boolean;
  
  // Styling options
  variant?: "default" | "compact" | "large";
  avatarSize?: "sm" | "md" | "lg";
  
  // Repository list options
  maxRepositories?: number;
  showRepositoryTotal?: boolean;
  
  // Customization
  title?: string;
  emptyMessage?: string;
  className?: string;
  userHeaderClassName?: string;
  titleClassName?: string;
  repositoryListClassName?: string;
}

export interface ActivitySummaryProps {
  repositories: string[];
  totalRepositories: number;
  organizations?: Organization[];
  username: string;
  config?: ActivitySummaryConfig;
}

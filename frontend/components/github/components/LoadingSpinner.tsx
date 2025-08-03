import { GitHubContributionsConfig } from "../lib/types";

interface LoadingSpinnerProps {
  config: GitHubContributionsConfig;
}

export function LoadingSpinner({ config }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center ${config.className || ""}`}
    >
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
    </div>
  );
}

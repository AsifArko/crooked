import { GitHubContributionsConfig } from "../lib/types";

interface ErrorDisplayProps {
  config: GitHubContributionsConfig;
  error: string;
}

export function ErrorDisplay({ config, error }: ErrorDisplayProps) {
  return (
    <div
      className={`text-center text-muted-foreground ${config.className || ""}`}
    >
      <p className="text-xs">Unable to load contributions</p>
      {config.accessibility && (
        <p className="text-xs mt-1 text-muted-foreground/60">{error}</p>
      )}
    </div>
  );
}

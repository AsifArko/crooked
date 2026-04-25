import { GitHubContributionsConfig } from "../../lib/types";

interface UsernameProps {
  config: GitHubContributionsConfig;
}

export function Username({ config }: UsernameProps) {
  if (config.compact || config.showHeader) {
    return null;
  }

  return (
    <div className="mb-1">
      <span className="text-xs text-muted-foreground/60 block">
        @{config.username}
      </span>
    </div>
  );
}

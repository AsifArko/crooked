import { GitHubContributionsConfig } from "../lib/types";
import { formatContributionCount } from "../lib/utils";

interface HeaderProps {
  config: GitHubContributionsConfig;
  totalContributions: number;
}

export function Header({ config, totalContributions }: HeaderProps) {
  if (!config.showHeader || config.compact) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">
          @{config.username}
        </span>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">
          {formatContributionCount(totalContributions)} contributions
        </div>
      </div>
    </div>
  );
}

import { GitHubContributionsConfig } from "../../lib/types";
import { getContributionColor } from "../../lib/utils";

interface LegendProps {
  config: GitHubContributionsConfig;
  colorScheme: Record<string, string>;
}

export function Legend({ config, colorScheme }: LegendProps) {
  if (config.compact || !config.showLegend) {
    return null;
  }

  return (
    <div className="flex items-center justify-end mt-1 space-x-1">
      <span className="text-xs text-muted-foreground mr-1">Less</span>
      <div className="flex space-x-0.5">
        {[0, 1, 3, 6, 9].map((count) => (
          <div
            key={count}
            className={`w-1.5 h-1.5 rounded-sm ${getContributionColor(count, colorScheme)}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">More</span>
    </div>
  );
}

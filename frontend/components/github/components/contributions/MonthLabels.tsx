import { MonthLabel } from "../../lib/types";
import { GitHubContributionsConfig } from "../../lib/types";

interface MonthLabelsProps {
  config: GitHubContributionsConfig;
  monthLabels: MonthLabel[];
}

export function MonthLabels({ config, monthLabels }: MonthLabelsProps) {
  if (config.compact || !config.showMonthLabels) {
    return null;
  }

  if (monthLabels.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-between mb-2 px-0.5">
      {(() => {
        // Create a grid of 53 columns and distribute month labels
        const monthGrid = new Array(53).fill("");

        // Sort month labels by their position
        const sortedMonthLabels = monthLabels.sort(
          (a, b) => a.position - b.position
        );

        // Place month labels at their calculated positions
        sortedMonthLabels.forEach(({ month, position }) => {
          if (position >= 0 && position < 53) {
            monthGrid[position] = month;
          }
        });

        return monthGrid.map((month, index) => (
          <span
            key={index}
            className="text-[10px] text-muted-foreground"
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            {month}
          </span>
        ));
      })()}
    </div>
  );
}

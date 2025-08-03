import { motion } from "framer-motion";
import {
  Contribution,
  ContributionDay,
  WeekData,
  GitHubContributionsConfig,
} from "../../lib/types";
import {
  getContributionColor,
  getSquareSize,
  getGapSize,
  getAccessibilityLabel,
} from "../../lib/utils";

interface ContributionGridProps {
  config: GitHubContributionsConfig;
  weeks: WeekData[];
  colorScheme: Record<string, string>;
  onMouseEnter: (day: Contribution, event: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

export function ContributionGrid({
  config,
  weeks,
  colorScheme,
  onMouseEnter,
  onMouseLeave,
}: ContributionGridProps) {
  const squareSize = getSquareSize(config.compact || false);
  const gapSize = getGapSize(config.compact || false);
  return (
    <div
      className={`grid grid-cols-53 gap-[3.5px] max-w-full overflow-hidden p-2`}
    >
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className={`flex flex-col gap-[3.5px]`}>
          {week.days.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              className={`
                ${squareSize} rounded-md cursor-pointer
                ${getContributionColor(day.contributionCount, colorScheme)}
                focus:outline-none focus:ring-2 focus:ring-primary/50
              `}
              onMouseEnter={(e) => onMouseEnter(day, e)}
              onMouseLeave={onMouseLeave}
              whileHover={
                config.animation
                  ? {
                      scale: 1.1,
                      boxShadow:
                        "0 2px 8px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.06)",
                    }
                  : {}
              }
              whileTap={config.animation ? { scale: 0.98 } : {}}
              tabIndex={config.accessibility ? 0 : -1}
              role={config.accessibility ? "button" : undefined}
              aria-label={
                config.accessibility ? getAccessibilityLabel(day) : undefined
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

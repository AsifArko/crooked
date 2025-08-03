import { motion } from "framer-motion";
import {
  Contribution,
  ContributionDay,
  WeekData,
  GitHubContributionsConfig,
} from "../lib/types";
import {
  getContributionColor,
  getSquareSize,
  getGapSize,
  getAccessibilityLabel,
} from "../lib/utils";

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
    <div className={`grid grid-cols-53 ${gapSize} max-w-full`}>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className={`flex flex-col ${gapSize}`}>
          {week.days.map((day, dayIndex) => (
            <motion.div
              key={day.date}
              className={`
                ${squareSize} rounded-sm cursor-pointer transition-all duration-200
                ${getContributionColor(day.contributionCount, colorScheme)}
                hover:scale-125 hover:ring-1 hover:ring-primary/30
                focus:outline-none focus:ring-2 focus:ring-primary/50
              `}
              onMouseEnter={(e) => onMouseEnter(day, e)}
              onMouseLeave={onMouseLeave}
              whileHover={config.animation ? { scale: 1.25 } : {}}
              whileTap={config.animation ? { scale: 0.9 } : {}}
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

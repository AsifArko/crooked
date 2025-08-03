import { motion, AnimatePresence } from "framer-motion";
import { Contribution, GitHubContributionsConfig } from "../lib/types";
import { formatTooltipText } from "../lib/utils";
import { TOOLTIP_CONFIG } from "../lib/constants";

interface TooltipProps {
  config: GitHubContributionsConfig;
  hoveredDay: Contribution | null;
  tooltipPosition: { x: number; y: number };
}

export function Tooltip({ config, hoveredDay, tooltipPosition }: TooltipProps) {
  if (!config.animation) {
    return null;
  }

  return (
    <AnimatePresence>
      {hoveredDay && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[9999] px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-gray-700"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translateX(-50%)",
          }}
        >
          {formatTooltipText(hoveredDay)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

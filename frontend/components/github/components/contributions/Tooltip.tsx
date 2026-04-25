import { Contribution, GitHubContributionsConfig } from "../../lib/types";
import { formatTooltipText } from "../../lib/utils";

interface TooltipProps {
  config: GitHubContributionsConfig;
  hoveredDay: Contribution | null;
  tooltipPosition: { x: number; y: number };
}

export function Tooltip({ config, hoveredDay, tooltipPosition }: TooltipProps) {
  if (!config.animation || !hoveredDay) {
    return null;
  }

  return (
    <div
      className="absolute z-[9999] px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-gray-700"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: "translateX(-50%)",
      }}
    >
      {formatTooltipText(hoveredDay)}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  );
}

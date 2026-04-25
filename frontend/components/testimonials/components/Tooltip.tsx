import { TESTIMONIALS_CONFIG } from "../config";

interface TooltipProps {
  text: string;
  x: number;
  y: number;
}

/**
 * Tooltip component for displaying truncated text
 */
export function Tooltip({ text, x, y }: TooltipProps) {
  return (
    <div
      className="fixed z-[9999] px-3 py-2 text-xs text-white bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-xl pointer-events-none whitespace-normal border border-gray-700/40"
      style={{
        left: x,
        top: y,
        transform: "translateX(-50%) translateY(-100%)",
        maxWidth: `${TESTIMONIALS_CONFIG.ui.tooltipMaxWidth}px`,
      }}
    >
      {text}
    </div>
  );
}

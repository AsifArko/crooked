import { useState, useCallback } from "react";

interface TooltipState {
  text: string;
  x: number;
  y: number;
}

/**
 * Custom hook for managing tooltip state
 */
export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>, text: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLParagraphElement>) => {
      if (tooltip) {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          ...tooltip,
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }
    },
    [tooltip]
  );

  return {
    tooltip,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  };
}

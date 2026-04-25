import React from "react";
import { MapTooltipProps } from "../types";

export const MapTooltip: React.FC<MapTooltipProps> = ({ tooltip }) => {
  if (!tooltip) return null;

  const isCountry = tooltip.type === "country";

  return (
    <div
      role="tooltip"
      className={
        isCountry
          ? "fixed z-50 pointer-events-none rounded-md border border-emerald-200/50 bg-slate-950/88 px-3 py-1.5 text-xs font-medium tracking-wide text-white shadow-lg shadow-slate-900/30 backdrop-blur-md transition-opacity duration-150"
          : "fixed z-50 pointer-events-none rounded-md border border-border/70 bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md backdrop-blur-md transition-opacity duration-150"
      }
      style={{
        left: tooltip.x + 12,
        top: tooltip.y - 12,
        transform: "translateY(-100%)",
      }}
    >
      {tooltip.content}
    </div>
  );
};

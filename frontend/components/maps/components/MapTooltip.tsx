import React from "react";
import { MapTooltipProps } from "../types";

export const MapTooltip: React.FC<MapTooltipProps> = ({ tooltip }) => {
  if (!tooltip) return null;

  return (
    <div
      className={`fixed z-50 pointer-events-none backdrop-blur-sm border rounded-sm px-2 py-1 shadow-lg text-xs font-medium ${
        tooltip.type === "country"
          ? "bg-black/90 text-white border-gray-700"
          : "bg-white/95 text-black border-gray-300"
      }`}
      style={{
        left: tooltip.x + 10,
        top: tooltip.y - 10,
        transform: "translateY(-100%)",
      }}
    >
      {tooltip.content}
    </div>
  );
};

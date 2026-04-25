import React from "react";
import { MapLegendProps } from "../types";

export const MapLegend: React.FC<MapLegendProps> = ({
  applications,
  colors,
}) => {
  if (applications.length <= 1) return null;

  return (
    <div className="absolute bottom-3 left-3 right-3 z-10">
      <div className="rounded-md border border-border/60 bg-background/92 px-3 py-2 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md dark:ring-white/[0.06]">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {applications.map((app, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full shadow-sm ring-1 ring-black/10"
                style={{
                  backgroundColor: colors[index] || colors[0],
                }}
              />
              <span className="text-xs font-medium text-foreground/75">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

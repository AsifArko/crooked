import React from "react";
import { MapLegendProps } from "../types";

export const MapLegend: React.FC<MapLegendProps> = ({
  applications,
  colors,
}) => {
  if (applications.length <= 1) return null;

  return (
    <div className="absolute bottom-3 left-3 right-3 z-10">
      <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-sm border border-border/50">
        <div className="flex flex-wrap gap-3">
          {applications.map((app, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: colors[index] || colors[0],
                }}
              ></div>
              <span className="text-xs text-foreground/70 font-medium">
                {app.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

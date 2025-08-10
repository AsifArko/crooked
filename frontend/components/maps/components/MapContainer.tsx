import React from "react";
import { MapContainerProps } from "../types";

export const MapContainer: React.FC<MapContainerProps> = ({
  children,
  className = "",
  showGrid = true,
  showGradient = true,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Modern container matching app design */}
      <div className="relative bg-gradient-to-br from-background to-background/50 rounded-sm border border-border/50 overflow-hidden">
        {/* Subtle gradient overlay */}
        {showGradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        )}

        {/* Minimal grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 opacity-5">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
               linear-gradient(rgba(71, 85, 105, 0.4) 1px, transparent 1px),
               linear-gradient(90deg, rgba(71, 85, 105, 0.4) 1px, transparent 1px)
             `,
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

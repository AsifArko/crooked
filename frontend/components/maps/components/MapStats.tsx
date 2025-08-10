import React from "react";
import { MapStatsProps } from "../types";

export const MapStats: React.FC<MapStatsProps> = ({
  applicationsCount,
  countriesCount,
}) => {
  return (
    <>
      {/* Applications header */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-border/50 shadow-sm">
          <span className="text-xs font-medium text-foreground/80 uppercase tracking-wider">
            {applicationsCount} App{applicationsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Countries indicator */}
      {countriesCount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-border/50 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">
              {countriesCount} Countr{countriesCount !== 1 ? "ies" : "y"}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

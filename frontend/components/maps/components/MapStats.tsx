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
        <div className="rounded-md border border-border/60 bg-background/92 px-2.5 py-1 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md dark:ring-white/[0.06]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/85">
            {applicationsCount} App{applicationsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {countriesCount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md border border-border/60 bg-background/92 px-2.5 py-1 shadow-sm ring-1 ring-black/[0.04] backdrop-blur-md dark:ring-white/[0.06]">
            <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
              {countriesCount} Countr{countriesCount !== 1 ? "ies" : "y"}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

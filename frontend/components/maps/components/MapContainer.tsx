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
      <div className="map-shell relative overflow-hidden rounded-md border border-border/60 bg-gradient-to-b from-muted/25 via-background to-background shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
        {showGradient && (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-500/[0.04] via-transparent to-emerald-600/[0.03]"
            aria-hidden
          />
        )}

        {showGrid && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
            aria-hidden
          >
            <div
              className="map-shell-grid h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgb(100 116 139 / 0.09) 1px, transparent 1px),
                  linear-gradient(90deg, rgb(100 116 139 / 0.09) 1px, transparent 1px)
                `,
                backgroundSize: "36px 36px",
              }}
            />
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.55)] dark:shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)]"
          aria-hidden
        />

        {children}
      </div>
    </div>
  );
};

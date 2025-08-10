"use client";

import { memo, useState } from "react";
import { ComposableMap } from "react-simple-maps";
import { Application, WorldMapConfig, TooltipData } from "./types";
import { DEFAULT_MAP_CONFIG, APP_COLORS } from "./constants";
import { getUniqueCountries, getHighlightedCountryCodes } from "./utils";
import { MapContainer } from "./components/MapContainer";
import { MapStats } from "./components/MapStats";
import { MapGeography } from "./components/MapGeography";
import { MapMarkers } from "./components/MapMarkers";
import { MapTooltip } from "./components/MapTooltip";
import { MapLegend } from "./components/MapLegend";

interface WorldMapProps {
  applications: Application[];
  config?: Partial<WorldMapConfig>;
}

export const WorldMap = memo(({ applications, config = {} }: WorldMapProps) => {
  // Merge default config with provided config
  const finalConfig = { ...DEFAULT_MAP_CONFIG, ...config };

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Get all unique countries from all applications
  const allCountries = getUniqueCountries(applications);
  const highlightedCodes = getHighlightedCountryCodes(allCountries);

  // Create color mapping for different applications
  const appColors = APP_COLORS;

  return (
    <MapContainer
      className={finalConfig.className}
      showGrid={finalConfig.showGrid}
      showGradient={finalConfig.showGradient}
    >
      {/* Map Stats */}
      {finalConfig.showStats && (
        <MapStats
          applicationsCount={applications.length}
          countriesCount={allCountries.length}
        />
      )}

      {/* Map container */}
      <div
        className="relative z-0"
        style={{ minHeight: `${finalConfig.height}px` }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: finalConfig.scale,
            center: finalConfig.center,
          }}
          width={finalConfig.width}
          height={finalConfig.height}
          viewBox={`0 0 ${finalConfig.width} ${finalConfig.height}`}
          style={{
            width: "100%",
            height: `${finalConfig.height}px`,
            minHeight: `${finalConfig.height}px`,
          }}
        >
          {/* Geography layer */}
          <MapGeography
            geographies={finalConfig.geoUrl || ""}
            highlightedCountries={highlightedCodes}
            onCountryHover={finalConfig.tooltipEnabled ? setTooltip : () => {}}
          />

          {/* Application markers */}
          {finalConfig.markerAnimation && (
            <MapMarkers
              applications={applications}
              countries={allCountries}
              colors={appColors}
              onMarkerHover={finalConfig.tooltipEnabled ? setTooltip : () => {}}
            />
          )}
        </ComposableMap>
      </div>

      {/* Tooltip */}
      {finalConfig.tooltipEnabled && <MapTooltip tooltip={tooltip} />}

      {/* Applications Legend */}
      {finalConfig.showLegend && (
        <MapLegend applications={applications} colors={appColors} />
      )}
    </MapContainer>
  );
});

WorldMap.displayName = "WorldMap";

import React from "react";
import { Geographies, Geography } from "@vnedyalk0v/react19-simple-maps";
import { MapGeographyProps } from "../types";

export const MapGeography: React.FC<MapGeographyProps> = ({
  geographies,
  highlightedCountries,
  onCountryHover,
}) => {
  return (
    <Geographies geography={geographies}>
      {({ geographies }) =>
        geographies.map((geo) => {
          const isHighlighted = highlightedCountries.includes(geo.id);

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={
                isHighlighted
                  ? "rgba(150, 150, 150, 0.15)"
                  : "rgba(150, 150, 150, 0.08)"
              }
              stroke="rgba(180, 180, 180, 0.4)"
              strokeWidth={0.2}
              style={{
                default: {
                  outline: "none",
                },
                hover: {
                  fill: "rgba(150, 150, 150, 0.2)",
                  outline: "none",
                },
                pressed: {
                  outline: "none",
                },
              }}
              onMouseEnter={(evt: React.MouseEvent<SVGPathElement>) => {
                onCountryHover({
                  content:
                    geo.properties.name ||
                    geo.properties.NAME ||
                    geo.properties.ADMIN ||
                    "Unknown",
                  x: evt.clientX,
                  y: evt.clientY,
                  type: "country",
                });
              }}
              onMouseLeave={() => {
                onCountryHover(null);
              }}
            />
          );
        })
      }
    </Geographies>
  );
};

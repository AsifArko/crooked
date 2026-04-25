import React, { useCallback, useState } from "react";
import {
  Geographies,
  Geography,
  type UseGeographiesProps,
} from "@vnedyalk0v/react19-simple-maps";
import { MapGeographyProps } from "../types";
import { MAP_THEME } from "../constants";

/** Stable id per land path — `rsmKey` is often missing at runtime; never use `undefined` or every country matches hover. */
function geographyRowKey(
  geo: {
    rsmKey?: string;
    id?: string | number;
    properties?: { name?: string };
  },
  index: number
): string {
  if (typeof geo.rsmKey === "string" && geo.rsmKey.length > 0) {
    return geo.rsmKey;
  }
  if (geo.id != null && String(geo.id).length > 0) {
    return `id:${String(geo.id)}`;
  }
  const name = geo.properties?.name;
  if (typeof name === "string" && name.length > 0) {
    return `name:${name}:${index}`;
  }
  return `idx:${index}`;
}

/**
 * Hover fill is driven by React state + SVG `fill`/`stroke` props. The library’s
 * internal `style.hover` path was not reliably painting on pointer hover (click
 * still updated `pressed`), so we control colors explicitly.
 */
export const MapGeography: React.FC<MapGeographyProps> = ({
  geography,
  highlightedCountries,
  onCountryHover,
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const clearHover = useCallback(() => {
    setHoveredKey(null);
    setPressedKey(null);
    onCountryHover(null);
  }, [onCountryHover]);

  return (
    <Geographies geography={geography as UseGeographiesProps["geography"]}>
      {({ geographies }) =>
        geographies.map((geo, index) => {
          const rowKey = geographyRowKey(geo, index);
          const geoId = geo.id != null ? String(geo.id) : "";
          const isHighlighted =
            geoId !== "" && highlightedCountries.includes(geoId);

          const defaultFill = isHighlighted
            ? MAP_THEME.landHighlighted
            : MAP_THEME.landBase;

          const defaultStroke = isHighlighted
            ? MAP_THEME.stroke
            : MAP_THEME.strokeMuted;
          const defaultStrokeWidth = isHighlighted ? 0.45 : 0.28;

          const isHovered = hoveredKey === rowKey;
          const isPressed = pressedKey === rowKey;
          const fill = isPressed
            ? MAP_THEME.pressedFill
            : isHovered
              ? MAP_THEME.hoverFill
              : defaultFill;
          const active = isHovered || isPressed;
          const stroke = active ? MAP_THEME.hoverStroke : defaultStroke;
          const strokeWidth = active
            ? MAP_THEME.hoverStrokeWidth
            : defaultStrokeWidth;
          const filter = active ? MAP_THEME.hoverGlow : "none";

          const sharedStyle = {
            outline: "none" as const,
            cursor: (active ? "pointer" : "default") as const,
            transition: MAP_THEME.transition,
            filter,
          };

          return (
            <Geography
              key={rowKey}
              geography={geo}
              className="map-geography-path"
              vectorEffect="non-scaling-stroke"
              tabIndex={-1}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              style={{
                default: sharedStyle,
                hover: sharedStyle,
                pressed: sharedStyle,
              }}
              onMouseEnter={(evt: React.MouseEvent<SVGPathElement>) => {
                setHoveredKey(rowKey);
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
              onMouseDown={() => setPressedKey(rowKey)}
              onMouseUp={() => setPressedKey(null)}
              onMouseLeave={clearHover}
            />
          );
        })
      }
    </Geographies>
  );
};

"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ContributionBreakdown {
  commits: number;
  pullRequests: number;
  issues: number;
  codeReviews: number;
}

export interface RadarDataPoint {
  label: string;
  shortLabel: string;
  value: number;
  angle: number;
}

export interface RadarChartConfig {
  /** Size of the chart in pixels */
  size?: number;
  /** Number of concentric grid rings */
  rings?: number;
  /** Whether to show percentage labels */
  showLabels?: boolean;
  /** Whether to show axis lines */
  showAxes?: boolean;
  /** Whether to show grid rings */
  showGrid?: boolean;
  /** Whether to show the filled area */
  showArea?: boolean;
  /** Whether to show data points */
  showPoints?: boolean;
  /** Whether to animate on mount */
  animated?: boolean;
  /** Custom class name */
  className?: string;
}

export interface RadarChartColors {
  /** Grid line color */
  grid?: string;
  /** Axis line color */
  axis?: string;
  /** Data area fill color */
  areaFill?: string;
  /** Data area stroke color */
  areaStroke?: string;
  /** Data point fill color */
  pointFill?: string;
  /** Data point stroke color */
  pointStroke?: string;
  /** Label text color */
  labelColor?: string;
}

export interface ActivityGraphProps {
  contributionBreakdown: ContributionBreakdown;
  config?: RadarChartConfig;
  colors?: RadarChartColors;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: Required<RadarChartConfig> = {
  size: 200,
  rings: 4,
  showLabels: true,
  showAxes: true,
  showGrid: true,
  showArea: true,
  showPoints: true,
  animated: true,
  className: "",
};

const DEFAULT_COLORS: Required<RadarChartColors> = {
  grid: "rgba(156, 163, 175, 0.3)",
  axis: "rgba(156, 163, 175, 0.5)",
  areaFill: "rgba(107, 114, 128, 0.25)",
  areaStroke: "rgba(75, 85, 99, 0.8)",
  pointFill: "rgb(250, 250, 250)",
  pointStroke: "rgba(75, 85, 99, 0.6)",
  labelColor: "rgb(107, 114, 128)",
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Converts polar coordinates to cartesian coordinates
 */
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

/**
 * Transforms contribution breakdown into radar data points
 */
const transformToRadarData = (
  breakdown: ContributionBreakdown
): RadarDataPoint[] => {
  const items = [
    { label: "Code review", shortLabel: "Code Reviews", key: "codeReviews" as const },
    { label: "Issues", shortLabel: "Issues", key: "issues" as const },
    { label: "Pull requests", shortLabel: "Pull Requests", key: "pullRequests" as const },
    { label: "Commits", shortLabel: "Commits", key: "commits" as const },
  ];

  const angleStep = 360 / items.length;

  return items.map((item, index) => ({
    label: item.label,
    shortLabel: item.shortLabel,
    value: breakdown[item.key] || 0,
    angle: index * angleStep,
  }));
};

/**
 * Generates SVG path for the data polygon
 */
const generatePolygonPath = (
  data: RadarDataPoint[],
  center: number,
  maxRadius: number
): string => {
  const points = data.map((point) => {
    const radius = (point.value / 100) * maxRadius;
    const coords = polarToCartesian(center, center, radius, point.angle);
    return `${coords.x},${coords.y}`;
  });

  return `M ${points.join(" L ")} Z`;
};

// ============================================================================
// Sub-Components
// ============================================================================

interface GridRingsProps {
  center: number;
  maxRadius: number;
  rings: number;
  color: string;
}

const GridRings: React.FC<GridRingsProps> = ({
  center,
  maxRadius,
  rings,
  color,
}) => (
  <>
    {Array.from({ length: rings }, (_, i) => {
      const radius = ((i + 1) / rings) * maxRadius;
      return (
        <circle
          key={`ring-${i}`}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={1}
        />
      );
    })}
  </>
);

interface AxisLinesProps {
  data: RadarDataPoint[];
  center: number;
  maxRadius: number;
  color: string;
}

const AxisLines: React.FC<AxisLinesProps> = ({
  data,
  center,
  maxRadius,
  color,
}) => (
  <>
    {data.map((point, index) => {
      const end = polarToCartesian(center, center, maxRadius, point.angle);
      return (
        <line
          key={`axis-${index}`}
          x1={center}
          y1={center}
          x2={end.x}
          y2={end.y}
          stroke={color}
          strokeWidth={1}
        />
      );
    })}
  </>
);

interface DataAreaProps {
  path: string;
  fillColor: string;
  strokeColor: string;
  animated: boolean;
}

const DataArea: React.FC<DataAreaProps> = ({
  path,
  fillColor,
  strokeColor,
  animated,
}) => (
  <path
    d={path}
    fill={fillColor}
    stroke={strokeColor}
    strokeWidth={2}
    strokeLinejoin="round"
    className={animated ? "animate-radar-draw" : ""}
  />
);

interface DataPointsProps {
  data: RadarDataPoint[];
  center: number;
  maxRadius: number;
  fillColor: string;
  strokeColor: string;
  animated: boolean;
}

const DataPoints: React.FC<DataPointsProps> = ({
  data,
  center,
  maxRadius,
  fillColor,
  strokeColor,
  animated,
}) => (
  <>
    {data.map((point, index) => {
      const radius = (point.value / 100) * maxRadius;
      const coords = polarToCartesian(center, center, radius, point.angle);
      return (
        <circle
          key={`point-${index}`}
          cx={coords.x}
          cy={coords.y}
          r={2.5}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={1.5}
          className={animated ? "animate-radar-point" : ""}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      );
    })}
  </>
);

interface AxisLabelsProps {
  data: RadarDataPoint[];
  center: number;
  maxRadius: number;
  labelColor: string;
  size: number;
}

const AxisLabels: React.FC<AxisLabelsProps> = ({
  data,
  center,
  maxRadius,
  labelColor,
  size,
}) => {
  const labelOffset = 24;

  return (
    <>
      {data.map((point, index) => {
        const labelRadius = maxRadius + labelOffset;
        const coords = polarToCartesian(center, center, labelRadius, point.angle);

        // Determine text anchor based on position
        let textAnchor: "start" | "middle" | "end" = "middle";
        let dy = "0.35em";

        if (point.angle === 0 || point.angle === 180) {
          textAnchor = "middle";
          dy = point.angle === 0 ? "-0.2em" : "1em";
        } else if (point.angle < 180) {
          textAnchor = "start";
        } else {
          textAnchor = "end";
        }

        return (
          <g key={`label-${index}`}>
            {/* Percentage */}
            <text
              x={coords.x}
              y={coords.y}
              textAnchor={textAnchor}
              dy={dy}
              fill={labelColor}
              fontSize={size < 180 ? 10 : 12}
              fontWeight={500}
              className="select-none"
            >
              {point.value}%
            </text>
            {/* Label name */}
            <text
              x={coords.x}
              y={coords.y}
              textAnchor={textAnchor}
              dy={point.angle === 0 ? "1em" : point.angle === 180 ? "2.2em" : "1.5em"}
              fill={labelColor}
              fontSize={size < 180 ? 9 : 10}
              className="select-none opacity-80"
            >
              {point.shortLabel}
            </text>
          </g>
        );
      })}
    </>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const ActivityGraph: React.FC<ActivityGraphProps> = ({
  contributionBreakdown,
  config: userConfig,
  colors: userColors,
}) => {
  // Merge user config with defaults
  const config = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...userConfig }),
    [userConfig]
  );

  const colors = useMemo(
    () => ({ ...DEFAULT_COLORS, ...userColors }),
    [userColors]
  );

  // Transform data for radar chart
  const radarData = useMemo(
    () => transformToRadarData(contributionBreakdown),
    [contributionBreakdown]
  );

  // Calculate dimensions
  const center = config.size / 2;
  const maxRadius = config.size / 2 - 50; // Leave space for labels

  // Generate polygon path
  const polygonPath = useMemo(
    () => generatePolygonPath(radarData, center, maxRadius),
    [radarData, center, maxRadius]
  );

  // Check if all values are zero
  const hasData = radarData.some((point) => point.value > 0);

  return (
    <div
      className={cn(
        "flex-1 flex items-center justify-center",
        config.className
      )}
    >
      <div className="relative">
        <svg
          width={config.size}
          height={config.size}
          viewBox={`0 0 ${config.size} ${config.size}`}
          className="overflow-visible"
        >
          {/* Grid rings */}
          {config.showGrid && (
            <GridRings
              center={center}
              maxRadius={maxRadius}
              rings={config.rings}
              color={colors.grid}
            />
          )}

          {/* Axis lines */}
          {config.showAxes && (
            <AxisLines
              data={radarData}
              center={center}
              maxRadius={maxRadius}
              color={colors.axis}
            />
          )}

          {/* Data area */}
          {config.showArea && hasData && (
            <DataArea
              path={polygonPath}
              fillColor={colors.areaFill}
              strokeColor={colors.areaStroke}
              animated={config.animated}
            />
          )}

          {/* Data points */}
          {config.showPoints && hasData && (
            <DataPoints
              data={radarData}
              center={center}
              maxRadius={maxRadius}
              fillColor={colors.pointFill}
              strokeColor={colors.pointStroke}
              animated={config.animated}
            />
          )}

          {/* Labels */}
          {config.showLabels && (
            <AxisLabels
              data={radarData}
              center={center}
              maxRadius={maxRadius}
              labelColor={colors.labelColor}
              size={config.size}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

// ============================================================================
// Preset Configurations
// ============================================================================

export const COMPACT_RADAR_CONFIG: RadarChartConfig = {
  size: 160,
  rings: 3,
  showLabels: true,
  showAxes: true,
  showGrid: true,
  showArea: true,
  showPoints: true,
  animated: true,
};

export const LARGE_RADAR_CONFIG: RadarChartConfig = {
  size: 280,
  rings: 5,
  showLabels: true,
  showAxes: true,
  showGrid: true,
  showArea: true,
  showPoints: true,
  animated: true,
};

export const MINIMAL_RADAR_CONFIG: RadarChartConfig = {
  size: 180,
  rings: 3,
  showLabels: true,
  showAxes: false,
  showGrid: true,
  showArea: true,
  showPoints: false,
  animated: false,
};

// ============================================================================
// Color Presets
// ============================================================================

export const DARK_RADAR_COLORS: RadarChartColors = {
  grid: "rgba(75, 85, 99, 0.4)",
  axis: "rgba(107, 114, 128, 0.6)",
  areaFill: "rgba(156, 163, 175, 0.3)",
  areaStroke: "rgba(209, 213, 219, 0.8)",
  pointFill: "rgb(245, 245, 245)",
  pointStroke: "rgba(209, 213, 219, 0.6)",
  labelColor: "rgb(209, 213, 219)",
};

export const LIGHT_RADAR_COLORS: RadarChartColors = {
  grid: "rgba(156, 163, 175, 0.3)",
  axis: "rgba(156, 163, 175, 0.5)",
  areaFill: "rgba(107, 114, 128, 0.25)",
  areaStroke: "rgba(75, 85, 99, 0.8)",
  pointFill: "rgb(250, 250, 250)",
  pointStroke: "rgba(75, 85, 99, 0.6)",
  labelColor: "rgb(107, 114, 128)",
};

export const GREEN_RADAR_COLORS: RadarChartColors = {
  grid: "rgba(34, 197, 94, 0.2)",
  axis: "rgba(34, 197, 94, 0.3)",
  areaFill: "rgba(34, 197, 94, 0.2)",
  areaStroke: "rgba(34, 197, 94, 0.8)",
  pointFill: "rgb(250, 250, 250)",
  pointStroke: "rgba(34, 197, 94, 0.6)",
  labelColor: "rgb(34, 197, 94)",
};

export interface Application {
  title: string;
  link: string;
  countries: string[];
}

export interface WorldMapConfig {
  className?: string;
  height?: number;
  width?: number;
  scale?: number;
  center?: [number, number];
  geoUrl?: string;
  showStats?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showGradient?: boolean;
  tooltipEnabled?: boolean;
  markerAnimation?: boolean;
  countryHighlighting?: boolean;
}

export interface TooltipData {
  content: string;
  x: number;
  y: number;
  type: "country" | "app";
}

export interface CountryCoordinates {
  [key: string]: [number, number];
}

export interface MapStatsProps {
  applicationsCount: number;
  countriesCount: number;
}

export interface MapLegendProps {
  applications: Application[];
  colors: string[];
}

export interface MapContainerProps {
  children: React.ReactNode;
  className?: string;
  showGrid?: boolean;
  showGradient?: boolean;
}

export interface MapGeographyProps {
  geographies: string;
  highlightedCountries: string[];
  onCountryHover: (tooltip: TooltipData | null) => void;
}

export interface MapMarkersProps {
  applications: Application[];
  countries: string[];
  colors: string[];
  onMarkerHover: (tooltip: TooltipData | null) => void;
}

export interface MapTooltipProps {
  tooltip: TooltipData | null;
}

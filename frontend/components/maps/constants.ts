export const DEFAULT_MAP_CONFIG = {
  height: 450,
  width: 800,
  scale: 120,
  center: [0, 0] as [number, number],
  geoUrl:
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
  showStats: true,
  showLegend: true,
  showGrid: true,
  showGradient: true,
  tooltipEnabled: true,
  markerAnimation: true,
  countryHighlighting: true,
};

export const APP_COLORS = [
  "rgba(64, 64, 64, 0.9)", // dark gray
  "rgba(128, 128, 128, 0.9)", // medium gray
  "rgba(169, 169, 169, 0.9)", // light gray
  "rgba(105, 105, 105, 0.9)", // dim gray
  "rgba(192, 192, 192, 0.9)", // silver
  "rgba(47, 79, 79, 0.9)", // dark slate
];

// Common country codes mapping
export const COUNTRY_CODE_MAP: Record<string, string> = {
  "United States": "840",
  USA: "840",
  US: "840",
  Norway: "578",
  NO: "578",
  Bangladesh: "050",
  BD: "050",
  Canada: "124",
  CA: "124",
  "United Kingdom": "826",
  UK: "826",
  GB: "826",
  Germany: "276",
  DE: "276",
  France: "250",
  FR: "250",
  Australia: "036",
  AU: "036",
  India: "356",
  IN: "356",
  Japan: "392",
  JP: "392",
  China: "156",
  CN: "156",
  Brazil: "076",
  BR: "076",
  Mexico: "484",
  MX: "484",
  "South Korea": "410",
  KR: "410",
  Indonesia: "360",
  ID: "360",
  Thailand: "764",
  TH: "764",
  Vietnam: "704",
  VN: "704",
  Philippines: "608",
  PH: "608",
  Malaysia: "458",
  MY: "458",
  Singapore: "702",
  SG: "702",
};

// Comprehensive coordinate mapping for countries
export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  "United States": [-95, 40],
  USA: [-95, 40],
  US: [-95, 40],
  // Nordic Countries
  Norway: [10, 62],
  Denmark: [9, 56],
  Sweden: [18, 60],
  Finland: [26, 61],
  Iceland: [-19, 65],
  // Western Europe
  "United Kingdom": [-2, 54],
  UK: [-2, 54],
  Ireland: [-8, 53],
  Germany: [10, 51],
  France: [2, 46],
  Spain: [-4, 40],
  Italy: [12, 42],
  Netherlands: [5, 52],
  Belgium: [4, 50],
  Austria: [14, 47],
  Switzerland: [8, 47],
  Portugal: [-8, 39],
  // Central Europe
  Poland: [20, 52],
  "Czech Republic": [15, 49],
  Hungary: [20, 47],
  Slovakia: [19, 48],
  Slovenia: [15, 46],
  Croatia: [16, 45],
  // Eastern Europe
  Romania: [25, 46],
  Bulgaria: [25, 43],
  // Southern Europe
  Greece: [22, 39],
  // Baltic States
  Estonia: [26, 59],
  Latvia: [25, 57],
  Lithuania: [24, 56],
  // Other countries
  Bangladesh: [90, 24],
  Canada: [-106, 56],
  Australia: [133, -27],
  India: [77, 20],
  Japan: [138, 36],
  China: [104, 35],
  Brazil: [-55, -10],
  Mexico: [-102, 23],
  "South Korea": [128, 36],
  Indonesia: [113, -2],
  Thailand: [101, 15],
  Vietnam: [108, 14],
  Philippines: [121, 13],
  Malaysia: [101, 4],
  Singapore: [104, 1],
  // Africa
  Nigeria: [8, 10],
};

"use client";

import { memo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

interface Application {
  title: string;
  link: string;
  countries: string[];
}

interface WorldMapProps {
  applications: Application[];
  className?: string;
}

// Common country codes mapping
const countryCodeMap: Record<string, string> = {
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

// Convert country names to ISO codes
const getCountryCode = (country: string): string => {
  return countryCodeMap[country] || country;
};

export const WorldMap = memo(
  ({ applications, className = "" }: WorldMapProps) => {
    // Get all unique countries from all applications
    const allCountries = [
      ...new Set(applications.flatMap((app) => app.countries)),
    ];
    const highlightedCodes = allCountries.map(getCountryCode);

    // Create color mapping for different applications
    const appColors = [
      "rgb(59, 130, 246)", // blue
      "rgb(147, 51, 234)", // purple
      "rgb(34, 197, 94)", // green
      "rgb(249, 115, 22)", // orange
      "rgb(236, 72, 153)", // pink
    ];

    return (
      <div className={`relative ${className}`}>
        {/* Modern container matching app design */}
        <div className="relative bg-gradient-to-br from-background to-background/50 rounded-sm border border-border/50 overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

          {/* Minimal grid overlay */}
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

          {/* Applications header */}
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-border/50 shadow-sm">
              <span className="text-xs font-medium text-foreground/80 uppercase tracking-wider">
                {applications.length} App{applications.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Countries indicator */}
          {allCountries.length > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-border/50 shadow-sm">
                <span className="text-xs font-medium text-muted-foreground">
                  {allCountries.length} Countr
                  {allCountries.length !== 1 ? "ies" : "y"}
                </span>
              </div>
            </div>
          )}

          {/* Map container */}
          <div className="relative z-0 min-h-[300px]">
            <ComposableMap
              projection="geoNaturalEarth1"
              projectionConfig={{
                scale: 140,
                center: [0, 0],
              }}
              width={800}
              height={300}
              viewBox="0 0 800 300"
              style={{
                width: "100%",
                height: "300px",
                minHeight: "300px",
              }}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isHighlighted = highlightedCodes.includes(geo.id);

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
                      />
                    );
                  })
                }
              </Geographies>

              {/* Add pulsing markers for highlighted countries */}
              {allCountries
                .map((country, index) => {
                  // Comprehensive coordinate mapping for countries
                  const coordinates: Record<string, [number, number]> = {
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
                  };

                  const coords = coordinates[country];
                  if (!coords) return null;

                  // Return individual dots for each app in this country
                  const appsInCountry = applications.filter((app) =>
                    app.countries.includes(country)
                  );

                  return appsInCountry.map((app, appIndexInCountry) => {
                    const appIndex = applications.indexOf(app);
                    const color = appColors[appIndex] || "hsl(var(--primary))";

                    // Create better offset for multiple apps in same country
                    const offsetRadius = 1.5; // Increased for better visibility
                    const angle =
                      (appIndexInCountry * 360) / appsInCountry.length;
                    const offsetX =
                      Math.cos((angle * Math.PI) / 180) * offsetRadius;
                    const offsetY =
                      Math.sin((angle * Math.PI) / 180) * offsetRadius;

                    return (
                      <Marker
                        key={`${app.title}-${country}-${index}-${appIndexInCountry}`}
                        coordinates={[coords[0] + offsetX, coords[1] + offsetY]}
                      >
                        <circle
                          r={4}
                          fill={color}
                          className="animate-pulse"
                          opacity={0.6}
                          style={{
                            filter: "drop-shadow(0 0 3px rgba(0,0,0,0.5))",
                          }}
                        />
                        <circle r={3} fill={color} opacity={0.9} />
                      </Marker>
                    );
                  });
                })
                .flat()}
            </ComposableMap>
          </div>

          {/* Applications Legend */}
          {applications.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-sm border border-border/50 shadow-sm">
                <div className="flex flex-wrap gap-3">
                  {applications.map((app, index) => (
                    <div key={index} className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: appColors[index] || appColors[0],
                        }}
                      ></div>
                      <span className="text-xs text-foreground/70 font-medium">
                        {app.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

WorldMap.displayName = "WorldMap";

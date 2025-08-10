import React from "react";
import { Marker } from "react-simple-maps";
import { MapMarkersProps } from "../types";
import { COUNTRY_COORDINATES } from "../constants";
import { getApplicationsInCountry, calculateMarkerOffset } from "../utils";

export const MapMarkers: React.FC<MapMarkersProps> = ({
  applications,
  countries,
  colors,
  onMarkerHover,
}) => {
  return (
    <>
      {countries
        .map((country, index) => {
          const coords = COUNTRY_COORDINATES[country];
          if (!coords) return null;

          // Return individual dots for each app in this country
          const appsInCountry = getApplicationsInCountry(applications, country);

          return appsInCountry.map((app, appIndexInCountry) => {
            const appIndex = applications.indexOf(app);
            const color = colors[appIndex] || colors[0];

            // Create better offset for multiple apps in same country
            const [offsetX, offsetY] = calculateMarkerOffset(
              appIndexInCountry,
              appsInCountry.length
            );

            return (
              <Marker
                key={`${app.title}-${country}-${index}-${appIndexInCountry}`}
                coordinates={[coords[0] + offsetX, coords[1] + offsetY]}
              >
                <circle
                  r={4}
                  fill={color}
                  className="animate-pulse cursor-pointer"
                  opacity={0.9}
                  onMouseEnter={(evt) => {
                    onMarkerHover({
                      content: app.title,
                      x: evt.clientX,
                      y: evt.clientY,
                      type: "app",
                    });
                  }}
                  onMouseLeave={() => {
                    onMarkerHover(null);
                  }}
                />
                <circle
                  r={3}
                  fill={color}
                  opacity={1}
                  onMouseEnter={(evt) => {
                    onMarkerHover({
                      content: app.title,
                      x: evt.clientX,
                      y: evt.clientY,
                      type: "app",
                    });
                  }}
                  onMouseLeave={() => {
                    onMarkerHover(null);
                  }}
                />
              </Marker>
            );
          });
        })
        .flat()}
    </>
  );
};

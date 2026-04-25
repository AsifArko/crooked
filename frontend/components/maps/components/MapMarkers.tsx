import React from "react";
import { Marker } from "@vnedyalk0v/react19-simple-maps";
import { MapMarkersProps } from "../types";
import { APP_COLORS, COUNTRY_COORDINATES } from "../constants";
import { getApplicationsInCountry, calculateMarkerOffset } from "../utils";

export const MapMarkers: React.FC<MapMarkersProps> = ({
  applications,
  countries,
  onMarkerHover,
}) => {
  return (
    <>
      {countries
        .map((country, index) => {
          const coords = COUNTRY_COORDINATES[country];
          if (!coords) return null;

          const appsInCountry = getApplicationsInCountry(applications, country);

          return appsInCountry.map((app, appIndexInCountry) => {
            const [offsetX, offsetY] = calculateMarkerOffset(
              appIndexInCountry,
              appsInCountry.length
            );

            return (
              <Marker
                key={`${app.title}-${country}-${index}-${appIndexInCountry}`}
                coordinates={[coords[0] + offsetX, coords[1] + offsetY] as any}
              >
                <circle
                  r={2.85}
                  fill={APP_COLORS[0]}
                  className="cursor-pointer"
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

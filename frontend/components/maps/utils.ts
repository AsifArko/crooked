import { COUNTRY_CODE_MAP } from "./constants";

// Convert country names to ISO codes
export const getCountryCode = (country: string): string => {
  return COUNTRY_CODE_MAP[country] || country;
};

// Get all unique countries from applications
export const getUniqueCountries = (
  applications: Array<{ countries: string[] }>
): string[] => {
  return [...new Set(applications.flatMap((app) => app.countries))];
};

// Get highlighted country codes
export const getHighlightedCountryCodes = (countries: string[]): string[] => {
  return countries.map(getCountryCode);
};

// Get applications in a specific country
export const getApplicationsInCountry = (
  applications: Array<{ countries: string[]; title: string; link: string }>,
  country: string
) => {
  return applications.filter((app) => app.countries.includes(country));
};

// Calculate marker offset for multiple apps in same country
export const calculateMarkerOffset = (
  appIndexInCountry: number,
  totalAppsInCountry: number,
  radius: number = 1.5
): [number, number] => {
  const angle = (appIndexInCountry * 360) / totalAppsInCountry;
  const offsetX = Math.cos((angle * Math.PI) / 180) * radius;
  const offsetY = Math.sin((angle * Math.PI) / 180) * radius;
  return [offsetX, offsetY];
};

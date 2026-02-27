import countriesData from "./countries-data.json";

type CountryRow = { name: string; "alpha-2": string };

export const COUNTRIES = (countriesData as CountryRow[])
  .filter((c) => c["alpha-2"] && c.name)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((c) => ({ name: c.name, code: c["alpha-2"] }));

export function countryFlag(countryCode: string | undefined): string {
  if (!countryCode || countryCode.length !== 2) return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map(
      (c) => 0x1f1e6 + (c.charCodeAt(0) - 65),
    ),
  );
}

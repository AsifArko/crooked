"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Database } from "lucide-react";
import { GeographySeedModule } from "./GeographySeedModule";

type CountryOption = { _id: string; name: string; countryCode: string };

export function SeedDashboard() {
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCountries = useCallback(() => {
    return fetch("/api/admin/countries?limit=500")
      .then((res) => res.json())
      .then((d: { items: CountryOption[] }) => setCountryOptions(d.items || []));
  }, []);

  useEffect(() => {
    fetchCountries().finally(() => setLoading(false));
  }, [fetchCountries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-8">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-7 w-7 text-zinc-600" />
            Geography Seed
          </h1>
          <p className="mt-1 text-[11px] text-zinc-500 uppercase tracking-wider font-medium">
            Seed countries and cities from OpenStreetMap (ISO 3166 + Overpass API)
          </p>
        </div>
        <GeographySeedModule
          countryOptions={countryOptions}
          onComplete={fetchCountries}
        />
      </div>
    </div>
  );
}

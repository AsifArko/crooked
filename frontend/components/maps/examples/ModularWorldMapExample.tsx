import React from "react";
import { WorldMap, Application, WorldMapConfig } from "../index";

// Example applications data
const exampleApplications: Application[] = [
  {
    title: "E-commerce Platform",
    link: "https://example.com/ecommerce",
    countries: [
      "United States",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
    ],
  },
  {
    title: "Mobile App",
    link: "https://example.com/mobile",
    countries: [
      "United States",
      "Japan",
      "South Korea",
      "Singapore",
      "Australia",
    ],
  },
  {
    title: "SaaS Solution",
    link: "https://example.com/saas",
    countries: ["United States", "Norway", "Sweden", "Denmark", "Netherlands"],
  },
];

// Example configurations
const compactConfig: WorldMapConfig = {
  height: 300,
  width: 600,
  scale: 100,
  showStats: false,
  showLegend: true,
  showGrid: false,
  showGradient: true,
};

const fullConfig: WorldMapConfig = {
  height: 600,
  width: 1000,
  scale: 140,
  center: [0, 20],
  showStats: true,
  showLegend: true,
  showGrid: true,
  showGradient: true,
  tooltipEnabled: true,
  markerAnimation: true,
  countryHighlighting: true,
};

const minimalConfig: WorldMapConfig = {
  height: 400,
  width: 800,
  scale: 120,
  showStats: false,
  showLegend: false,
  showGrid: false,
  showGradient: false,
  tooltipEnabled: false,
  markerAnimation: false,
  countryHighlighting: false,
};

export const ModularWorldMapExample: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Default WorldMap</h2>
        <WorldMap applications={exampleApplications} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Compact WorldMap</h2>
        <WorldMap applications={exampleApplications} config={compactConfig} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Full Featured WorldMap</h2>
        <WorldMap applications={exampleApplications} config={fullConfig} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Minimal WorldMap</h2>
        <WorldMap applications={exampleApplications} config={minimalConfig} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Custom Styled WorldMap</h2>
        <WorldMap
          applications={exampleApplications}
          config={{
            className: "border-2 border-blue-500 rounded-lg",
            height: 500,
            showGrid: true,
            showGradient: true,
          }}
        />
      </div>
    </div>
  );
};

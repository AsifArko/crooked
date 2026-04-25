# WorldMap Component

A modular, configurable, and reusable world map component built with React and react-simple-maps.

## Features

- 🌍 Interactive world map with country highlighting
- 📍 Application markers with pulsing animation
- 🎨 Configurable styling and appearance
- 🧩 Modular component architecture
- ⚙️ Extensive configuration options
- 🎯 Tooltip support for countries and applications
- 📊 Statistics display (apps count, countries count)
- 🏷️ Applications legend
- 🎭 Customizable visual effects (grid, gradients)

## Architecture

The WorldMap component has been restructured into modular, reusable components:

```
WorldMap/
├── components/
│   ├── MapContainer.tsx      # Visual styling and layout
│   ├── MapStats.tsx          # Header statistics display
│   ├── MapGeography.tsx      # Country rendering and highlighting
│   ├── MapMarkers.tsx        # Application markers
│   ├── MapTooltip.tsx        # Tooltip display
│   └── MapLegend.tsx         # Applications legend
├── types.ts                  # TypeScript interfaces
├── constants.ts              # Configuration constants
├── utils.ts                  # Utility functions
├── WorldMap.tsx              # Main orchestrator component
└── index.ts                  # Public exports
```

## Usage

### Basic Usage

```tsx
import { WorldMap } from "@/components/maps";

const applications = [
  {
    title: "My App",
    link: "https://example.com",
    countries: ["United States", "Canada", "United Kingdom"],
  },
];

function MyComponent() {
  return <WorldMap applications={applications} />;
}
```

### With Custom Configuration

```tsx
import { WorldMap, WorldMapConfig } from "@/components/maps";

const config: WorldMapConfig = {
  height: 500,
  width: 900,
  scale: 130,
  showStats: false,
  showLegend: true,
  showGrid: false,
  showGradient: true,
  tooltipEnabled: true,
  markerAnimation: true,
  countryHighlighting: true,
};

function MyComponent() {
  return <WorldMap applications={applications} config={config} />;
}
```

## Configuration Options

| Option                | Type               | Default           | Description                   |
| --------------------- | ------------------ | ----------------- | ----------------------------- |
| `className`           | `string`           | `""`              | Additional CSS classes        |
| `height`              | `number`           | `450`             | Map height in pixels          |
| `width`               | `number`           | `800`             | Map width in pixels           |
| `scale`               | `number`           | `120`             | Map zoom scale                |
| `center`              | `[number, number]` | `[0, 0]`          | Map center coordinates        |
| `geoUrl`              | `string`           | World GeoJSON URL | Geography data source         |
| `showStats`           | `boolean`          | `true`            | Show header statistics        |
| `showLegend`          | `boolean`          | `true`            | Show applications legend      |
| `showGrid`            | `boolean`          | `true`            | Show background grid          |
| `showGradient`        | `boolean`          | `true`            | Show gradient overlay         |
| `tooltipEnabled`      | `boolean`          | `true`            | Enable tooltips               |
| `markerAnimation`     | `boolean`          | `true`            | Enable marker animations      |
| `countryHighlighting` | `boolean`          | `true`            | Highlight countries with apps |

## Component Props

### WorldMap Props

```tsx
interface WorldMapProps {
  applications: Application[];
  config?: Partial<WorldMapConfig>;
}
```

### Application Interface

```tsx
interface Application {
  title: string;
  link: string;
  countries: string[];
}
```

## Supported Countries

The component includes comprehensive support for countries with:

- Country name variations (e.g., "USA", "US", "United States")
- ISO country codes
- Geographic coordinates for marker placement

## Styling

The component uses Tailwind CSS classes and supports:

- Custom CSS classes via `className` prop
- Responsive design
- Dark/light theme compatibility
- Custom border and background styles

## Examples

See `examples/ModularWorldMapExample.tsx` for comprehensive usage examples including:

- Default configuration
- Compact layout
- Full-featured display
- Minimal configuration
- Custom styling

## Performance

- Memoized components for optimal re-rendering
- Efficient country code mapping
- Optimized marker rendering
- Conditional rendering based on configuration

## Dependencies

- `react-simple-maps` - Map rendering
- `react` - React framework
- `tailwindcss` - Styling (optional, can be customized)

## Migration from Legacy

The new modular structure maintains 100% backward compatibility. Simply replace:

```tsx
// Old usage
<WorldMap applications={apps} className="my-class" />

// New usage (same result)
<WorldMap applications={apps} config={{ className: "my-class" }} />
```

## Contributing

When adding new features:

1. Create new components in the `components/` directory
2. Add types to `types.ts`
3. Add constants to `constants.ts`
4. Add utilities to `utils.ts`
5. Update the main `WorldMap.tsx` component
6. Export from `index.ts`
7. Add examples and documentation

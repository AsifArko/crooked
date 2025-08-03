# GitHub Contributions Component Library

A modular, reusable, and highly configurable React component library for displaying GitHub contribution graphs.

## Features

- 🎨 **Highly Configurable**: Customizable colors, themes, and layouts
- 🧩 **Modular Architecture**: Reusable components and utilities
- ♿ **Accessibility First**: Full keyboard navigation and screen reader support
- 🎭 **Animation Support**: Smooth animations with Framer Motion
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 🧪 **Testable**: Modular design makes testing easy
- 🚀 **Performance Optimized**: Efficient rendering and state management

## Installation

```bash
npm install @crooked/github-contributions
```

## Quick Start

```tsx
import { GitHubContributions } from "@crooked/github-contributions";

function App() {
  return (
    <GitHubContributions username="your-github-username" className="my-4" />
  );
}
```

## Component

### GitHubContributions

The main component with extensive configuration options.

```tsx
<GitHubContributions
  username="asifarko"
  className="my-4"
  compact={false}
  showHeader={true}
  showLegend={true}
  showMonthLabels={true}
  animation={true}
  accessibility={true}
/>
```

## Configuration

### Basic Props

| Prop              | Type      | Default      | Description                         |
| ----------------- | --------- | ------------ | ----------------------------------- |
| `username`        | `string`  | **required** | GitHub username                     |
| `className`       | `string`  | `""`         | Additional CSS classes              |
| `compact`         | `boolean` | `false`      | Compact mode with smaller squares   |
| `showHeader`      | `boolean` | `true`       | Show header with username and total |
| `showLegend`      | `boolean` | `true`       | Show contribution legend            |
| `showMonthLabels` | `boolean` | `true`       | Show month labels                   |
| `animation`       | `boolean` | `true`       | Enable animations                   |
| `accessibility`   | `boolean` | `true`       | Enable accessibility features       |

### Advanced Props

| Prop              | Type                          | Default     | Description         |
| ----------------- | ----------------------------- | ----------- | ------------------- |
| `theme`           | `'light' \| 'dark' \| 'auto'` | `'auto'`    | Color theme         |
| `colorScheme`     | `'github' \| 'custom'`        | `'github'`  | Color scheme        |
| `customColors`    | `ColorScheme`                 | `undefined` | Custom color scheme |
| `tooltipPosition` | `'top' \| 'bottom' \| 'auto'` | `'auto'`    | Tooltip position    |

### Custom Colors

```tsx
const customColors = {
  empty: "bg-gray-100 dark:bg-gray-800",
  low: "bg-green-200 dark:bg-green-800",
  medium: "bg-green-400 dark:bg-green-600",
  high: "bg-green-600 dark:bg-green-400",
  veryHigh: "bg-green-800 dark:bg-green-200",
};

<GitHubContributions
  username="asifarko"
  colorScheme="custom"
  customColors={customColors}
/>;
```

## Usage Examples

### Basic Usage

```tsx
<GitHubContributions username="asifarko" />
```

### Compact Version

```tsx
<GitHubContributions
  username="asifarko"
  compact={true}
  showHeader={false}
  showLegend={false}
/>
```

### Custom Styling

```tsx
<GitHubContributions
  username="asifarko"
  className="border border-gray-200 rounded-lg p-4"
  colorScheme="custom"
  customColors={myCustomColors}
/>
```

### No Animations

```tsx
<GitHubContributions username="asifarko" animation={false} />
```

## Hooks

### useGitHubContributions

Fetch GitHub contributions data.

```tsx
import { useGitHubContributions } from "@crooked/github-contributions";

function MyComponent() {
  const { contributions, loading, error, totalContributions } =
    useGitHubContributions({
      username: "asifarko",
    });

  // Use the data
}
```

### useContributionData

Process contribution data into weeks and month labels.

```tsx
import { useContributionData } from "@crooked/github-contributions";

function MyComponent() {
  const { weeks, monthLabels } = useContributionData(contributions, config);

  // Use the processed data
}
```

## Utilities

### Color Utilities

```tsx
import { getContributionColor } from "@crooked/github-contributions";

const color = getContributionColor(5, colorScheme);
```

### Date Utilities

```tsx
import {
  generateDateRange,
  generateWeeks,
  generateMonthLabels,
} from "@crooked/github-contributions";

const { startDate, endDate } = generateDateRange();
const weeks = generateWeeks(allDates);
const monthLabels = generateMonthLabels(weeks);
```

## Types

```tsx
import type {
  GitHubContributionsConfig,
  Contribution,
  ColorScheme,
} from "@crooked/github-contributions";
```

## API Requirements

The component expects a GitHub API endpoint at `/api/github/contributions` that returns:

```json
{
  "contributions": [
    {
      "date": "2024-01-01",
      "contributionCount": 5
    }
  ],
  "totalContributions": 1234,
  "username": "asifarko"
}
```

## Styling

The component uses Tailwind CSS classes. Make sure you have Tailwind CSS configured in your project.

### Custom Styling

You can override styles using the `className` prop or by targeting the component's CSS classes:

```css
/* Custom styles */
.github-contributions {
  @apply border border-gray-200 rounded-lg p-4;
}
```

## Accessibility

The component includes:

- Keyboard navigation support
- Screen reader announcements
- ARIA labels and roles
- Focus management
- High contrast support

## Performance

- Efficient rendering with React.memo
- Optimized re-renders
- Lazy loading of data
- Minimal bundle size

## Testing

The modular architecture makes testing easy:

```tsx
import { render, screen } from "@testing-library/react";
import { GitHubContributions } from "@crooked/github-contributions";

test("renders contribution graph", () => {
  render(<GitHubContributions username="testuser" />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

import { GitHubContributions } from "../components/contributions/GitHubContributions";

export function AdvancedExample() {
  const customColors = {
    empty: "bg-gray-100 dark:bg-gray-800",
    low: "bg-blue-200 dark:bg-blue-800",
    medium: "bg-blue-400 dark:bg-blue-600",
    high: "bg-blue-600 dark:bg-blue-400",
    veryHigh: "bg-blue-800 dark:bg-blue-200",
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Advanced GitHub Contributions</h2>

      <div>
        <h3 className="text-lg font-semibold mb-2">Compact Version</h3>
        <GitHubContributions
          username="asifarko"
          compact={true}
          showHeader={false}
          showLegend={false}
          className="border border-gray-200 rounded-lg p-4"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Custom Colors</h3>
        <GitHubContributions
          username="asifarko"
          colorScheme="custom"
          customColors={customColors}
          className="border border-gray-200 rounded-lg p-4"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">No Animations</h3>
        <GitHubContributions
          username="asifarko"
          animation={false}
          className="border border-gray-200 rounded-lg p-4"
        />
      </div>
    </div>
  );
}

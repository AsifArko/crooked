import { GitHubContributions } from "../components/GitHubContributions";

export function BasicExample() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Basic GitHub Contributions</h2>
      <GitHubContributions
        username="asifarko"
        className="border border-gray-200 rounded-lg p-4"
      />
    </div>
  );
}

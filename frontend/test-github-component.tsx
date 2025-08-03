import { GitHubContributionsAdvanced } from "./components/github/GitHubContributionsAdvanced";

export default function TestGitHubComponent() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">GitHub Contributions Test</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Full Version</h2>
          <GitHubContributionsAdvanced username="asifarko" />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Compact Version</h2>
          <GitHubContributionsAdvanced username="asifarko" compact={true} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Without Header</h2>
          <GitHubContributionsAdvanced username="asifarko" showHeader={false} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Without Streak</h2>
          <GitHubContributionsAdvanced username="asifarko" showStreak={false} />
        </div>
      </div>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 },
      );
    }

    // Check if GitHub token is configured
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        {
          error: "GitHub token not configured",
          message: "Please configure GITHUB_TOKEN environment variable",
        },
        { status: 500 },
      );
    }

    // GitHub GraphQL query for activity overview
    const query = `
      query($username: String!) {
        user(login: $username) {
          login
          repositories(last: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              nameWithOwner
              isFork
              isArchived
            }
            totalCount
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
          organizations(first: 20) {
            nodes {
              login
              avatarUrl
            }
          }
        }
      }
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "crooked-app",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API error:", response.status, errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid GitHub token" },
          { status: 401 },
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: "Rate limit exceeded or insufficient permissions" },
          { status: 403 },
        );
      }

      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      const error = data.errors[0];
      console.error("GraphQL error:", error);

      if (error.message.includes("Could not resolve to a User")) {
        return NextResponse.json(
          { error: "GitHub user not found" },
          { status: 404 },
        );
      }

      throw new Error(error.message);
    }

    const user = data.data.user;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get contribution statistics from REST API
    const statsResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "crooked-app",
        },
      },
    );

    if (!statsResponse.ok) {
      console.error("Failed to fetch repository stats");
    }

    const repos = await statsResponse.json();

    // Calculate contribution breakdown based on repository activity
    // This is an approximation since GitHub doesn't provide exact breakdown via API
    const totalRepos = repos.length;
    const activeRepos = repos.filter(
      (repo: any) => !repo.fork && !repo.archived,
    ).length;

    // Estimate breakdown based on typical GitHub user patterns
    // You can adjust these percentages based on your actual GitHub activity
    const commitsPercent = 94; // Based on your GitHub profile
    const pullRequestsPercent = 4;
    const issuesPercent = 1;
    const codeReviewsPercent = 1;

    // Debug: Log calculated percentages
    console.log("Using estimated percentages:", {
      commits: commitsPercent,
      issues: issuesPercent,
      pullRequests: pullRequestsPercent,
      codeReviews: codeReviewsPercent,
    });

    // Get repositories (excluding forks and archived)
    const repositories = user.repositories.nodes
      .filter((repo: any) => !repo.isFork && !repo.isArchived)
      .slice(0, 5) // Show first 5 repositories
      .map((repo: any) => repo.nameWithOwner);

    // Get organizations (reversed to show most recent first)
    const organizations = user.organizations.nodes.reverse().slice(0, 2);

    return NextResponse.json({
      username: user.login,
      repositories,
      totalRepositories: user.repositories.totalCount,
      contributionBreakdown: {
        commits: commitsPercent,
        pullRequests: pullRequestsPercent,
        issues: issuesPercent,
        codeReviews: codeReviewsPercent,
      },
      organizations,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
    });
  } catch (error) {
    console.error("Error fetching GitHub activity overview:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity overview" },
      { status: 500 },
    );
  }
}

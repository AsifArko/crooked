# GitHub Contributions Setup ✅

This guide explains how to set up real GitHub contribution data for the GitHubContributions component.

## ✅ Implementation Complete

The GitHub contributions feature has been successfully implemented with:

- **Real GitHub API Integration**: Uses GitHub's GraphQL API to fetch actual contribution data
- **Improved Error Handling**: Handles various error scenarios gracefully
- **Enhanced UI**: Shows total contributions and better loading states
- **Security**: GitHub token is only used server-side

## Prerequisites

1. A GitHub account
2. A GitHub Personal Access Token

## Setup Steps

### 1. Create a GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name like "Crooked App GitHub API"
4. Select the following scopes:
   - `public_repo` (for public repositories)
   - `repo` (for private repositories, if needed)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory with the following content:

```env
GITHUB_TOKEN=your_github_personal_access_token_here
```

Replace `your_github_personal_access_token_here` with the token you copied in step 1.

### 3. Restart Your Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## How It Works

The GitHubContributions component now fetches real data from GitHub's GraphQL API using your personal access token. The API:

1. Accepts a GitHub username as a parameter
2. Fetches the user's contribution calendar data
3. Returns the last 365 days of contributions
4. Displays them in a GitHub-style contribution graph

## Error Handling

The component handles various error scenarios:

- **Missing GitHub token**: Shows a configuration error
- **Invalid token**: Shows an authentication error
- **User not found**: Shows a "user not found" error
- **Rate limit exceeded**: Shows a rate limit error
- **Network errors**: Shows a generic error message

## Security Notes

- Never commit your `.env.local` file to version control
- The GitHub token is only used server-side and never exposed to the client
- Use the minimum required scopes for your GitHub token
- Consider using GitHub Apps for production deployments

## Testing

To test the component, use a valid GitHub username:

```tsx
<GitHubContributions username="your-github-username" />
```

The component will automatically fetch and display your real GitHub contribution data!

## Current Implementation

The component is currently being used in:

- `HeroDesktop.tsx` with username "asifarko"
- `HeroMobile.tsx` with username "asifarko"

Both components will now display real GitHub contribution data instead of mock data.

## API Endpoint

The API endpoint is available at:

```
GET /api/github/contributions?username={username}
```

Response format:

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

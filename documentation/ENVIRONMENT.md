# Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

## Sanity Configuration
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
```

## Stripe Configuration
```
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## GitHub Configuration
```
GITHUB_TOKEN=your_github_personal_access_token
```

## Application Configuration
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Setup Instructions

1. **Sanity Setup**:
   - Create a Sanity project at https://www.sanity.io/
   - Get your project ID and API token from the project settings
   - Update the dataset name if needed

2. **Stripe Setup**:
   - Create a Stripe account at https://stripe.com/
   - Get your API keys from the Stripe dashboard
   - Make sure to use test keys for development

3. **GitHub Setup**:
   - Create a GitHub personal access token at https://github.com/settings/tokens
   - Give it the necessary permissions for reading user data
   - Update the username in the GitHubContributions component

4. **Application URL**:
   - Set the base URL to your application's domain
   - Use `http://localhost:3000` for local development 
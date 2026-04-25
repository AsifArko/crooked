# Test Directory Structure

This directory contains all test-related files organized by type and purpose.

## Directory Structure

```
tests/
├── api/                    # API endpoint tests
│   ├── github/            # GitHub API tests
│   └── stripe/            # Stripe API tests
├── components/            # Component tests
│   ├── github/            # GitHub component tests
│   ├── testimonials/      # Testimonials component tests
│   └── ui/                # UI component tests
├── integration/           # Integration tests
│   └── github/            # GitHub integration tests
├── e2e/                   # End-to-end tests
├── utils/                 # Test utilities and helpers
└── fixtures/              # Test data and fixtures
```

## Test Types

### API Tests (`tests/api/`)

- **Purpose**: Test API endpoints and external service integrations
- **Examples**:
  - GitHub API response validation
  - Stripe payment processing
- **Framework**: Jest + Supertest (planned)

### Component Tests (`tests/components/`)

- **Purpose**: Test React components in isolation
- **Examples**:
  - Component rendering
  - User interactions
  - Props validation
- **Framework**: Jest + React Testing Library (planned)

### Integration Tests (`tests/integration/`)

- **Purpose**: Test complete workflows and service integrations
- **Examples**:
  - GitHub data fetching and display
  - End-to-end user journeys
- **Framework**: Jest + Playwright (planned)

### E2E Tests (`tests/e2e/`)

- **Purpose**: Test complete user workflows
- **Examples**:
  - User registration flow
  - Payment processing
  - Profile updates
- **Framework**: Playwright (planned)

## Current Test Files

### API Tests

- `tests/api/test-github-api.js` - GitHub API integration testing

### Component Tests

- `tests/components/test-github-component.tsx` - GitHub component testing

## Planned Testing Framework Setup

### Phase 1: Unit Testing

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Phase 2: Integration Testing

```bash
npm install --save-dev supertest
```

### Phase 3: E2E Testing

```bash
npm install --save-dev @playwright/test
```

## Running Tests

### Current Manual Tests

```bash
# Test GitHub API
node tests/api/test-github-api.js
```

### Future Automated Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

## Test Configuration

### Jest Configuration (planned)

```javascript
// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: [
    "<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}",
  ],
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
};
```

### Playwright Configuration (planned)

```javascript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Data and Fixtures

### Mock Data

- GitHub activity mock data
- User profile mock data
- Testimonials mock data

### Test Utilities

- API response mocks
- Component test helpers
- Authentication test helpers

## Best Practices

1. **Test Organization**: Group tests by feature and type
2. **Naming Convention**: Use descriptive test names
3. **Mock External Services**: Don't rely on external APIs in tests
4. **Test Isolation**: Each test should be independent
5. **Coverage**: Aim for high test coverage on critical paths
6. **Performance**: Keep tests fast and efficient

## Environment Variables for Testing

```env
# Test environment variables
NODE_ENV=test
TEST_GITHUB_TOKEN=test_token
TEST_STRIPE_SECRET_KEY=test_key
```

## Contributing

When adding new tests:

1. Follow the existing directory structure
2. Use appropriate test frameworks
3. Add proper documentation
4. Include both positive and negative test cases
5. Mock external dependencies
6. Ensure tests are fast and reliable

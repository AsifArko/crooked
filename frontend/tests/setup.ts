/**
 * Test setup file for configuring the testing environment
 * This file is automatically loaded by Jest before running tests
 */

import "@testing-library/jest-dom";
import React from "react";

// Test environment setup - don't modify NODE_ENV as it's read-only
// process.env.NODE_ENV = 'test';

// GitHub API test environment variables
process.env.GITHUB_TOKEN = "test_github_token";

// Stripe API test environment variables
process.env.STRIPE_SECRET_KEY = "test_stripe_secret_key";
process.env.STRIPE_PUBLISHABLE_KEY = "test_stripe_publishable_key";

// Sanity CMS test environment variables
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test_project_id";
process.env.NEXT_PUBLIC_SANITY_DATASET = "test_dataset";
process.env.SANITY_API_TOKEN = "test_sanity_token";

// Test database configuration
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";

// Test server configuration
process.env.PORT = "3001";
process.env.NEXTAUTH_URL = "http://localhost:3001";
process.env.NEXTAUTH_SECRET = "test_nextauth_secret";

// Test email configuration
process.env.EMAIL_SERVER_HOST = "localhost";
process.env.EMAIL_SERVER_PORT = "1025";
process.env.EMAIL_SERVER_USER = "test_user";
process.env.EMAIL_SERVER_PASSWORD = "test_password";
process.env.EMAIL_FROM = "test@example.com";

// Test file upload configuration
process.env.UPLOAD_DIR = "./test-uploads";

// Test logging configuration
process.env.LOG_LEVEL = "error";

// Test cache configuration
process.env.REDIS_URL = "redis://localhost:6379/1";

// Test external API configuration
process.env.EXTERNAL_API_URL = "https://api.test.com";
process.env.EXTERNAL_API_KEY = "test_api_key";

// Test payment configuration
process.env.PAYMENT_WEBHOOK_SECRET = "test_webhook_secret";

// Test analytics configuration
process.env.ANALYTICS_ID = "test_analytics_id";

// Test monitoring configuration
process.env.MONITORING_ENDPOINT = "https://monitoring.test.com";

// Test security configuration
process.env.JWT_SECRET = "test_jwt_secret";
process.env.ENCRYPTION_KEY = "test_encryption_key";

// Test feature flags
process.env.ENABLE_BETA_FEATURES = "false";
process.env.ENABLE_ANALYTICS = "false";
process.env.ENABLE_MONITORING = "false";

// Test external services
process.env.SMTP_HOST = "localhost";
process.env.SMTP_PORT = "1025";
process.env.SMTP_USER = "test_user";
process.env.SMTP_PASS = "test_password";

// Test file storage
process.env.STORAGE_BUCKET = "test-bucket";
process.env.STORAGE_REGION = "us-east-1";
process.env.STORAGE_ACCESS_KEY = "test_access_key";
process.env.STORAGE_SECRET_KEY = "test_secret_key";

// Test CDN configuration
process.env.CDN_URL = "https://cdn.test.com";

// Test search configuration
process.env.SEARCH_INDEX = "test_index";
process.env.SEARCH_API_KEY = "test_search_key";

// Test notification configuration
process.env.NOTIFICATION_WEBHOOK_URL = "https://notifications.test.com";

// Test backup configuration
process.env.BACKUP_BUCKET = "test-backup-bucket";
process.env.BACKUP_SCHEDULE = "0 0 * * *";

// Test development environment variables
if (process.env.NODE_ENV === "development") {
  process.env.GITHUB_TOKEN = "dev_github_token";
  process.env.STRIPE_SECRET_KEY = "dev_stripe_secret_key";
  process.env.STRIPE_PUBLISHABLE_KEY = "dev_stripe_publishable_key";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "dev_project_id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "dev_dataset";
  process.env.SANITY_API_TOKEN = "dev_sanity_token";
  process.env.DATABASE_URL = "postgresql://dev:dev@localhost:5432/dev_db";
  process.env.PORT = "3000";
  process.env.NEXTAUTH_URL = "http://localhost:3000";
  process.env.NEXTAUTH_SECRET = "dev_nextauth_secret";
  process.env.EMAIL_SERVER_HOST = "localhost";
  process.env.EMAIL_SERVER_PORT = "1025";
  process.env.EMAIL_SERVER_USER = "dev_user";
  process.env.EMAIL_SERVER_PASSWORD = "dev_password";
  process.env.EMAIL_FROM = "dev@example.com";
  process.env.UPLOAD_DIR = "./dev-uploads";
  process.env.LOG_LEVEL = "debug";
  process.env.REDIS_URL = "redis://localhost:6379/0";
  process.env.EXTERNAL_API_URL = "https://api.dev.com";
  process.env.EXTERNAL_API_KEY = "dev_api_key";
  process.env.PAYMENT_WEBHOOK_SECRET = "dev_webhook_secret";
  process.env.ANALYTICS_ID = "dev_analytics_id";
  process.env.MONITORING_ENDPOINT = "https://monitoring.dev.com";
  process.env.JWT_SECRET = "dev_jwt_secret";
  process.env.ENCRYPTION_KEY = "dev_encryption_key";
  process.env.ENABLE_BETA_FEATURES = "true";
  process.env.ENABLE_ANALYTICS = "true";
  process.env.ENABLE_MONITORING = "true";
  process.env.SMTP_HOST = "localhost";
  process.env.SMTP_PORT = "1025";
  process.env.SMTP_USER = "dev_user";
  process.env.SMTP_PASS = "dev_password";
  process.env.STORAGE_BUCKET = "dev-bucket";
  process.env.STORAGE_REGION = "us-east-1";
  process.env.STORAGE_ACCESS_KEY = "dev_access_key";
  process.env.STORAGE_SECRET_KEY = "dev_secret_key";
  process.env.CDN_URL = "https://cdn.dev.com";
  process.env.SEARCH_INDEX = "dev_index";
  process.env.SEARCH_API_KEY = "dev_search_key";
  process.env.NOTIFICATION_WEBHOOK_URL = "https://notifications.dev.com";
  process.env.BACKUP_BUCKET = "dev-backup-bucket";
  process.env.BACKUP_SCHEDULE = "0 0 * * *";
}

// Test production environment variables
if (process.env.NODE_ENV === "production") {
  process.env.GITHUB_TOKEN = "prod_github_token";
  process.env.STRIPE_SECRET_KEY = "prod_stripe_secret_key";
  process.env.STRIPE_PUBLISHABLE_KEY = "prod_stripe_publishable_key";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "prod_project_id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "prod_dataset";
  process.env.SANITY_API_TOKEN = "prod_sanity_token";
  process.env.DATABASE_URL = "postgresql://prod:prod@localhost:5432/prod_db";
  process.env.PORT = "3000";
  process.env.NEXTAUTH_URL = "https://example.com";
  process.env.NEXTAUTH_SECRET = "prod_nextauth_secret";
  process.env.EMAIL_SERVER_HOST = "smtp.production.com";
  process.env.EMAIL_SERVER_PORT = "587";
  process.env.EMAIL_SERVER_USER = "prod_user";
  process.env.EMAIL_SERVER_PASSWORD = "prod_password";
  process.env.EMAIL_FROM = "noreply@example.com";
  process.env.UPLOAD_DIR = "./prod-uploads";
  process.env.LOG_LEVEL = "info";
  process.env.REDIS_URL = "redis://localhost:6379/0";
  process.env.EXTERNAL_API_URL = "https://api.production.com";
  process.env.EXTERNAL_API_KEY = "prod_api_key";
  process.env.PAYMENT_WEBHOOK_SECRET = "prod_webhook_secret";
  process.env.ANALYTICS_ID = "prod_analytics_id";
  process.env.MONITORING_ENDPOINT = "https://monitoring.production.com";
  process.env.JWT_SECRET = "prod_jwt_secret";
  process.env.ENCRYPTION_KEY = "prod_encryption_key";
  process.env.ENABLE_BETA_FEATURES = "false";
  process.env.ENABLE_ANALYTICS = "true";
  process.env.ENABLE_MONITORING = "true";
  process.env.SMTP_HOST = "smtp.production.com";
  process.env.SMTP_PORT = "587";
  process.env.SMTP_USER = "prod_user";
  process.env.SMTP_PASS = "prod_password";
  process.env.STORAGE_BUCKET = "prod-bucket";
  process.env.STORAGE_REGION = "us-east-1";
  process.env.STORAGE_ACCESS_KEY = "prod_access_key";
  process.env.STORAGE_SECRET_KEY = "prod_secret_key";
  process.env.CDN_URL = "https://cdn.production.com";
  process.env.SEARCH_INDEX = "prod_index";
  process.env.SEARCH_API_KEY = "prod_search_key";
  process.env.NOTIFICATION_WEBHOOK_URL = "https://notifications.production.com";
  process.env.BACKUP_BUCKET = "prod-backup-bucket";
  process.env.BACKUP_SCHEDULE = "0 0 * * *";
}

// Test environment variables
if (process.env.NODE_ENV === "test") {
  process.env.GITHUB_TOKEN = "test_github_token";
  process.env.STRIPE_SECRET_KEY = "test_stripe_secret_key";
  process.env.STRIPE_PUBLISHABLE_KEY = "test_stripe_publishable_key";
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "test_project_id";
  process.env.NEXT_PUBLIC_SANITY_DATASET = "test_dataset";
  process.env.SANITY_API_TOKEN = "test_sanity_token";
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
  process.env.PORT = "3001";
  process.env.NEXTAUTH_URL = "http://localhost:3001";
  process.env.NEXTAUTH_SECRET = "test_nextauth_secret";
  process.env.EMAIL_SERVER_HOST = "localhost";
  process.env.EMAIL_SERVER_PORT = "1025";
  process.env.EMAIL_SERVER_USER = "test_user";
  process.env.EMAIL_SERVER_PASSWORD = "test_password";
  process.env.EMAIL_FROM = "test@example.com";
  process.env.UPLOAD_DIR = "./test-uploads";
  process.env.LOG_LEVEL = "error";
  process.env.REDIS_URL = "redis://localhost:6379/1";
  process.env.EXTERNAL_API_URL = "https://api.test.com";
  process.env.EXTERNAL_API_KEY = "test_api_key";
  process.env.PAYMENT_WEBHOOK_SECRET = "test_webhook_secret";
  process.env.ANALYTICS_ID = "test_analytics_id";
  process.env.MONITORING_ENDPOINT = "https://monitoring.test.com";
  process.env.JWT_SECRET = "test_jwt_secret";
  process.env.ENCRYPTION_KEY = "test_encryption_key";
  process.env.ENABLE_BETA_FEATURES = "false";
  process.env.ENABLE_ANALYTICS = "false";
  process.env.ENABLE_MONITORING = "false";
  process.env.SMTP_HOST = "localhost";
  process.env.SMTP_PORT = "1025";
  process.env.SMTP_USER = "test_user";
  process.env.SMTP_PASS = "test_password";
  process.env.STORAGE_BUCKET = "test-bucket";
  process.env.STORAGE_REGION = "us-east-1";
  process.env.STORAGE_ACCESS_KEY = "test_access_key";
  process.env.STORAGE_SECRET_KEY = "test_secret_key";
  process.env.CDN_URL = "https://cdn.test.com";
  process.env.SEARCH_INDEX = "test_index";
  process.env.SEARCH_API_KEY = "test_search_key";
  process.env.NOTIFICATION_WEBHOOK_URL = "https://notifications.test.com";
  process.env.BACKUP_BUCKET = "test-backup-bucket";
  process.env.BACKUP_SCHEDULE = "0 0 * * *";
}

// Mock fetch globally
global.fetch = jest.fn();

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return React.createElement("img", props);
  },
}));

// Mock Next.js link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: componentWillReceiveProps has been renamed")
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock CSS modules
jest.mock("*.module.css", () => ({
  container: "container",
  wrapper: "wrapper",
  header: "header",
  content: "content",
  footer: "footer",
}));

// Mock CSS files
jest.mock("*.css", () => ({}));

// Mock image files
jest.mock("*.png", () => "test-image.png");
jest.mock("*.jpg", () => "test-image.jpg");
jest.mock("*.jpeg", () => "test-image.jpeg");
jest.mock("*.gif", () => "test-image.gif");
jest.mock("*.svg", () => "test-image.svg");

// Mock environment variables for different test scenarios
export const mockEnvVars = {
  development: {
    NODE_ENV: "development",
    LINKEDIN_ACCESS_TOKEN: "dev_linkedin_token",
    LINKEDIN_PERSON_ID: "dev_person_id",
    GITHUB_TOKEN: "dev_github_token",
    STRIPE_SECRET_KEY: "dev_stripe_key",
  },
  production: {
    NODE_ENV: "production",
    LINKEDIN_ACCESS_TOKEN: "prod_linkedin_token",
    LINKEDIN_PERSON_ID: "prod_person_id",
    GITHUB_TOKEN: "prod_github_token",
    STRIPE_SECRET_KEY: "prod_stripe_key",
  },
  test: {
    NODE_ENV: "test",
    LINKEDIN_ACCESS_TOKEN: "test_linkedin_token",
    LINKEDIN_PERSON_ID: "test_person_id",
    GITHUB_TOKEN: "test_github_token",
    STRIPE_SECRET_KEY: "test_stripe_key",
  },
};

// Helper function to set environment variables for specific tests
export function setTestEnv(env: keyof typeof mockEnvVars) {
  const vars = mockEnvVars[env];
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Helper function to reset environment variables
export function resetTestEnv() {
  Object.keys(mockEnvVars.test).forEach((key) => {
    delete process.env[key];
  });
}

// Mock API responses
export const mockApiResponses = {
  success: (data: any) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    }),
  error: (status: number = 500, message: string = "Internal Server Error") =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message }),
      text: () => Promise.resolve(JSON.stringify({ error: message })),
    }),
  networkError: () => Promise.reject(new Error("Network error")),
};

// Test utilities
export const testUtils = {
  // Wait for a condition to be true
  waitFor: (condition: () => boolean, timeout: number = 5000) => {
    return new Promise<void>((resolve, reject) => {
      const startTime = Date.now();

      const checkCondition = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("Condition not met within timeout"));
        } else {
          setTimeout(checkCondition, 100);
        }
      };

      checkCondition();
    });
  },

  // Mock localStorage
  mockLocalStorage: () => {
    const store: Record<string, string> = {};

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
    };
  },

  // Mock sessionStorage
  mockSessionStorage: () => {
    const store: Record<string, string> = {};

    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
    };
  },
};

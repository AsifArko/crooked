/**
 * Test utility functions for common testing tasks
 */

import { Testimonial } from "@/lib/types";

// Test data helpers
export const createMockTestimonial = (
  overrides: Partial<Testimonial> = {}
): Testimonial => ({
  id: "1",
  name: "John Smith",
  title: "Senior Software Engineer",
  company: "Tech Corp",
  recommendation: "Excellent developer with great skills.",
  linkedInUrl: "https://linkedin.com/in/johnsmith",
  date: "2024-01-15",
  relationship: "Former Colleague",
  skills: ["React", "TypeScript", "Node.js"],
  ...overrides,
});

export const createMockTestimonials = (count: number): Testimonial[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockTestimonial({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      title: `Engineer ${i + 1}`,
      company: `Company ${i + 1}`,
      recommendation: `Great recommendation ${i + 1}`,
      linkedInUrl: `https://linkedin.com/in/user${i + 1}`,
      date: `2024-01-${String(i + 1).padStart(2, "0")}`,
      relationship: i % 2 === 0 ? "Former Colleague" : "Manager",
      skills: ["React", "TypeScript", "Node.js"],
    })
  );
};

// Environment variable helpers
export const mockEnvironmentVariables = {
  GITHUB_TOKEN: "test_github_token",
  STRIPE_SECRET_KEY: "test_stripe_secret_key",
  STRIPE_PUBLISHABLE_KEY: "test_stripe_publishable_key",
  NEXT_PUBLIC_SANITY_PROJECT_ID: "test_project_id",
  NEXT_PUBLIC_SANITY_DATASET: "test_dataset",
  SANITY_API_TOKEN: "test_sanity_token",
};

// API response helpers
export const createMockApiResponse = (data: any, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  };
};

export const createMockApiError = (message: string, status = 400) => {
  return {
    ok: false,
    status,
    json: async () => ({ error: message }),
    text: async () => JSON.stringify({ error: message }),
  };
};

// Component testing helpers
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Date helpers
export const createMockDate = (dateString: string) => {
  const date = new Date(dateString);
  return {
    toLocaleDateString: jest.fn().mockReturnValue(date.toLocaleDateString()),
    toISOString: jest.fn().mockReturnValue(date.toISOString()),
    getTime: jest.fn().mockReturnValue(date.getTime()),
  };
};

// URL helpers
export const createMockUrl = (url: string) => {
  return {
    href: url,
    origin: new URL(url).origin,
    pathname: new URL(url).pathname,
    search: new URL(url).search,
    hash: new URL(url).hash,
  };
};

// Storage helpers
export const mockLocalStorage = () => {
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
};

export const mockSessionStorage = () => {
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
};

// Event helpers
export const createMockEvent = (type: string, target?: any) => {
  return {
    type,
    target: target || document.createElement("div"),
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    currentTarget: target || document.createElement("div"),
  };
};

// Async helpers
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const flushPromises = () =>
  new Promise((resolve) => setImmediate(resolve));

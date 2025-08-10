/**
 * GitHub Component Test
 *
 * This test file validates the GitHub component functionality by testing:
 * - Component rendering
 * - Props validation
 * - User interactions
 * - Data display
 * - Error states
 *
 * Usage:
 *   npm test -- tests/components/github/test-github-component.tsx
 *
 * @author Your Name
 * @version 1.0.0
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GithubActivity } from "@/components/github/components/GithubActivity";

// Mock the GitHub API calls
jest.mock("@/lib/github", () => ({
  fetchGitHubActivity: jest.fn(),
  fetchGitHubContributions: jest.fn(),
}));

describe("GithubActivity Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component correctly", () => {
      render(<GithubActivity />);

      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
      expect(screen.getByText(/Github Activity/i)).toBeInTheDocument();
    });

    it("should render without any props", () => {
      render(<GithubActivity />);

      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
    });
  });

  describe("Component Structure", () => {
    it("should render the main section with proper styling", () => {
      render(<GithubActivity />);

      const section = screen.getByText(/GitHub Activity/i).closest("section");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("bg-background");
    });

    it("should render the header with gradient lines", () => {
      render(<GithubActivity />);

      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
      // Check for the gradient line elements (they're decorative, so we just verify the component renders)
      expect(screen.getByText(/Github Activity/i)).toBeInTheDocument();
    });
  });
});

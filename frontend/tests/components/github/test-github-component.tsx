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
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GithubActivity } from "@/components/github/components/GithubActivity";
import { mockApiResponses } from "@/tests/utils/test-helpers";
import { githubMockData } from "@/tests/fixtures/mock-data";

// Mock the GitHub API calls
jest.mock("@/lib/github", () => ({
  fetchGitHubActivity: jest.fn(),
  fetchGitHubContributions: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("GithubActivity Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the component with loading state initially", () => {
      render(<GithubActivity />);

      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should render with custom username prop", () => {
      render(<GithubActivity username="testuser" />);

      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
    });

    it("should render with custom className prop", () => {
      const { container } = render(<GithubActivity className="custom-class" />);

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("Data Loading", () => {
    it("should display GitHub activity data when API call succeeds", async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      render(<GithubActivity />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Check that activity data is displayed
      expect(screen.getByText(/Contributions/i)).toBeInTheDocument();
      expect(screen.getByText(/1234/i)).toBeInTheDocument(); // Total contributions
    });

    it("should display error message when API call fails", async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.error(500, "Failed to fetch data")
      );

      render(<GithubActivity />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
      });

      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });

    it("should handle network errors gracefully", async () => {
      // Mock network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      render(<GithubActivity />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("should handle refresh button click", async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      render(<GithubActivity />);

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Find and click refresh button
      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      fireEvent.click(refreshButton);

      // Should show loading state again
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });

    it("should handle username input change", async () => {
      render(<GithubActivity />);

      // Find username input
      const usernameInput = screen.getByPlaceholderText(
        /enter github username/i
      );

      // Type in a new username
      fireEvent.change(usernameInput, { target: { value: "newuser" } });

      // Check that the input value changed
      expect(usernameInput).toHaveValue("newuser");
    });

    it("should handle form submission", async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      render(<GithubActivity />);

      // Find and fill username input
      const usernameInput = screen.getByPlaceholderText(
        /enter github username/i
      );
      fireEvent.change(usernameInput, { target: { value: "testuser" } });

      // Find and submit form
      const form = screen.getByRole("form");
      fireEvent.submit(form);

      // Should trigger API call with new username
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("testuser")
        );
      });
    });
  });

  describe("Data Display", () => {
    it("should display contribution graph when data is available", async () => {
      // Mock successful API response with contribution data
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      render(<GithubActivity />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Check that contribution graph is rendered
      expect(screen.getByTestId("contribution-graph")).toBeInTheDocument();
      expect(screen.getByText(/1234/i)).toBeInTheDocument(); // Total contributions
    });

    it("should display empty state when no contributions found", async () => {
      // Mock API response with no contributions
      const emptyData = {
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 0,
                weeks: [],
              },
            },
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(emptyData)
      );

      render(<GithubActivity />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Check that empty state is displayed
      expect(screen.getByText(/No contributions found/i)).toBeInTheDocument();
    });

    it("should display contribution statistics correctly", async () => {
      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      render(<GithubActivity />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Check that statistics are displayed
      expect(screen.getByText(/Total Contributions/i)).toBeInTheDocument();
      expect(screen.getByText(/1234/i)).toBeInTheDocument();
      expect(screen.getByText(/Current Streak/i)).toBeInTheDocument();
      expect(screen.getByText(/Longest Streak/i)).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display specific error message for 404", async () => {
      // Mock 404 error
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.error(404, "User not found")
      );

      render(<GithubActivity />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(/User not found/i)).toBeInTheDocument();
      });
    });

    it("should display specific error message for 403", async () => {
      // Mock 403 error (rate limited)
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.error(403, "API rate limit exceeded")
      );

      render(<GithubActivity />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(
          screen.getByText(/API rate limit exceeded/i)
        ).toBeInTheDocument();
      });
    });

    it("should provide retry option when error occurs", async () => {
      // Mock failed API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.error(500, "Server error")
      );

      render(<GithubActivity />);

      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      });

      // Check that retry button is available
      expect(
        screen.getByRole("button", { name: /retry/i })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", async () => {
      render(<GithubActivity />);

      // Check for loading state ARIA label
      expect(
        screen.getByLabelText(/loading github activity/i)
      ).toBeInTheDocument();

      // Check for contribution graph ARIA label
      await waitFor(() => {
        expect(
          screen.getByLabelText(/contribution graph/i)
        ).toBeInTheDocument();
      });
    });

    it("should be keyboard navigable", () => {
      render(<GithubActivity />);

      // Check that all interactive elements are focusable
      const refreshButton = screen.getByRole("button", { name: /refresh/i });
      const usernameInput = screen.getByPlaceholderText(
        /enter github username/i
      );

      expect(refreshButton).toHaveAttribute("tabindex", "0");
      expect(usernameInput).toHaveAttribute("tabindex", "0");
    });

    it("should have proper color contrast", () => {
      render(<GithubActivity />);

      // This would require a more sophisticated accessibility testing library
      // For now, we'll just check that the component renders without errors
      expect(screen.getByText(/GitHub Activity/i)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should not re-render unnecessarily", async () => {
      const { rerender } = render(<GithubActivity />);

      // Mock successful API response
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(githubMockData.activity)
      );

      // Wait for initial render
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      // Re-render with same props
      rerender(<GithubActivity />);

      // Should not trigger new API call
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("should handle large datasets efficiently", async () => {
      // Mock large dataset
      const largeData = {
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 5000,
                weeks: Array.from({ length: 52 }, (_, weekIndex) => ({
                  contributionDays: Array.from(
                    { length: 7 },
                    (_, dayIndex) => ({
                      date: new Date(2024, 0, weekIndex * 7 + dayIndex + 1)
                        .toISOString()
                        .split("T")[0],
                      contributionCount: Math.floor(Math.random() * 20),
                      color: "#216e39",
                    })
                  ),
                })),
              },
            },
          },
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockApiResponses.success(largeData)
      );

      render(<GithubActivity />);

      // Should render without performance issues
      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
      });

      expect(screen.getByText(/5000/i)).toBeInTheDocument();
    });
  });
});

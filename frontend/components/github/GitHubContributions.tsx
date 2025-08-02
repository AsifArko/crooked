"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Calendar, TrendingUp } from "lucide-react";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GitHubContributionsProps {
  username: string;
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/github/contributions?username=${username}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contributions");
        }

        const data = await response.json();
        setContributions(data.contributions || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch contributions"
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchContributions();
    }
  }, [username]);

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count <= 3) return "bg-green-200 dark:bg-green-900";
    if (count <= 6) return "bg-green-300 dark:bg-green-800";
    if (count <= 9) return "bg-green-400 dark:bg-green-700";
    return "bg-green-500 dark:bg-green-600";
  };

  if (loading) {
    return (
      <div className="w-full max-w-md h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Github className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">Unable to load GitHub contributions</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col justify-center p-6"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <Github className="w-4 h-4" />
          <span className="text-base font-semibold text-gray-900 dark:text-white">
            GitHub Contributions
          </span>
        </div>

        {/* Contribution Graph */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Last 365 days
            </span>
            <TrendingUp className="w-3 h-3 text-green-500" />
          </div>

          <div className="grid grid-cols-53 gap-0.5">
            {contributions.slice(-365).map((day, index) => (
              <motion.div
                key={day.date}
                className={`w-1.5 h-1.5 rounded-sm ${getContributionColor(
                  day.contributionCount
                )}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.001 }}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="text-xs">Less</span>
          <div className="flex space-x-0.5">
            <div className="w-1.5 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-green-200 dark:bg-green-900 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-green-300 dark:bg-green-800 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-green-400 dark:bg-green-700 rounded-sm"></div>
            <div className="w-1.5 h-1.5 bg-green-500 dark:bg-green-600 rounded-sm"></div>
          </div>
          <span className="text-xs">More</span>
        </div>
      </div>
    </motion.div>
  );
}

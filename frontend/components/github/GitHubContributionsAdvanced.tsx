"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Contribution {
  date: string;
  contributionCount: number;
}

interface GitHubContributionsAdvancedProps {
  username?: string;
  className?: string;
  compact?: boolean;
  showHeader?: boolean;
}

export function GitHubContributionsAdvanced({
  username = "asifarko",
  className = "",
  compact = false,
  showHeader = true,
}: GitHubContributionsAdvancedProps) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<Contribution | null>(null);
  const [totalContributions, setTotalContributions] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/github/contributions?username=${username}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch contributions");
        }

        const data = await response.json();
        setContributions(data.contributions);
        setTotalContributions(data.totalContributions);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch contributions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center text-muted-foreground ${className}`}>
        <p className="text-xs">Unable to load contributions</p>
      </div>
    );
  }

  // Get the last 365 days of contributions
  const currentDate = new Date();
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  // Start from 364 days ago (365 days total including today)
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364);

  // Create a map of all dates
  const dateMap = new Map<string, number>();
  contributions.forEach((contribution) => {
    dateMap.set(contribution.date, contribution.contributionCount);
  });

  // Generate all dates for the last 365 days
  const allDates: Array<{
    date: string;
    contributionCount: number;
    month: number;
    day: number;
    year: number;
  }> = [];
  const current = new Date(startDate);

  for (let i = 0; i < 365; i++) {
    const dateString = current.toISOString().split("T")[0];
    const contributionCount = dateMap.get(dateString) || 0;
    allDates.push({
      date: dateString,
      contributionCount,
      month: current.getMonth(),
      day: current.getDate(),
      year: current.getFullYear(),
    });
    current.setDate(current.getDate() + 1);
  }

  // Group by weeks (7 days each) - each week should start from Sunday
  const weeks: Array<
    Array<{
      date: string;
      contributionCount: number;
      month: number;
      day: number;
      year: number;
    }>
  > = [];

  // Find the first Sunday before or on the start date
  const firstSunday = new Date(startDate);
  const dayOfWeek = firstSunday.getDay();
  firstSunday.setDate(firstSunday.getDate() - dayOfWeek);

  // Generate weeks starting from the first Sunday
  const currentWeek = new Date(firstSunday);
  for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
    const week: Array<{
      date: string;
      contributionCount: number;
      month: number;
      day: number;
      year: number;
    }> = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const dateString = currentWeek.toISOString().split("T")[0];
      const contributionCount = dateMap.get(dateString) || 0;
      week.push({
        date: dateString,
        contributionCount,
        month: currentWeek.getMonth(),
        day: currentWeek.getDate(),
        year: currentWeek.getFullYear(),
      });
      currentWeek.setDate(currentWeek.getDate() + 1);
    }
    weeks.push(week);
  }

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-[#ebedf0] dark:bg-[#161b22]";
    if (count <= 3) return "bg-[#9be9a8] dark:bg-[#0e4429]";
    if (count <= 6) return "bg-[#40c463] dark:bg-[#006d32]";
    if (count <= 9) return "bg-[#30a14e] dark:bg-[#26a641]";
    return "bg-[#216e39] dark:bg-[#39d353]";
  };

  const getTooltipText = (contribution: Contribution) => {
    // Parse the date string and create a proper Date object
    const [year, month, day] = contribution.date.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (contribution.contributionCount === 0) {
      return `No contributions on ${formattedDate}`;
    }
    if (contribution.contributionCount === 1) {
      return `1 contribution on ${formattedDate}`;
    }
    return `${contribution.contributionCount} contributions on ${formattedDate}`;
  };

  const handleMouseEnter = (day: Contribution, event: React.MouseEvent) => {
    setHoveredDay(day);
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate tooltip position
    let x = rect.left + rect.width / 2;
    let y = rect.top - 40;

    // Ensure tooltip doesn't go off-screen horizontally
    if (x < 100) x = 100;
    if (x > viewportWidth - 100) x = viewportWidth - 100;

    // Ensure tooltip doesn't go off-screen vertically
    if (y < 50) y = rect.bottom + 10;

    setTooltipPosition({ x, y });
  };

  const squareSize = compact ? "w-1 h-1" : "w-1.5 h-1.5";
  const gapSize = compact ? "gap-1.5" : "gap-1.5";

  return (
    <div className={`${className}`}>
      {/* Header - Only show if not compact and showHeader is true */}
      {showHeader && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">@{username}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              {totalContributions.toLocaleString()} contributions
            </div>
          </div>
        </div>
      )}

      {/* Contribution Grid */}
      <div className="relative">
        {/* Month Labels - Only show on desktop and if not compact */}
        {!compact && (
          <div className="hidden md:flex justify-between mb-1 px-0.5">
            {(() => {
              // Get all unique month-year combinations that appear in the weeks data
              const allMonthYears = new Set<string>();
              weeks.forEach((week) => {
                week.forEach((day) => {
                  allMonthYears.add(`${day.year}-${day.month}`);
                });
              });

              // Convert to array and sort by year, then month
              const monthYearNumbers = Array.from(allMonthYears)
                .map((my) => {
                  const [year, month] = my.split("-").map(Number);
                  return { year, month };
                })
                .sort((a, b) => {
                  if (a.year !== b.year) return a.year - b.year;
                  return a.month - b.month;
                })
                .filter(({ year, month }, index, array) => {
                  // Only remove last year's July if we're currently in July or later
                  const currentYear = new Date().getFullYear();
                  const currentMonth = new Date().getMonth();

                  // If it's last year's July (month 6) and we're currently in July or later, skip it
                  if (
                    year === currentYear - 1 &&
                    month === 6 &&
                    currentMonth >= 6
                  ) {
                    return false;
                  }

                  return true;
                });

              // Create month labels
              const monthLabels = monthYearNumbers.map(({ year, month }) => ({
                month: new Date(year, month, 1).toLocaleDateString("en-US", {
                  month: "short",
                }),
                monthNum: month,
                year,
                key: `${year}-${month}`,
              }));

              // Find the first occurrence of each month-year in the weeks
              const monthPositions = new Map<string, number>();
              let currentMonthYear = "";

              weeks.forEach((week, weekIndex) => {
                week.forEach((day) => {
                  const monthYear = `${day.year}-${day.month}`;
                  if (monthYear !== currentMonthYear) {
                    currentMonthYear = monthYear;
                    if (!monthPositions.has(monthYear)) {
                      monthPositions.set(monthYear, weekIndex);
                    }
                  }
                });
              });

              // Create a grid of 53 columns and distribute month labels
              const monthGrid = new Array(53).fill("");

              // Sort month labels by their position, then by year and month
              const sortedMonthLabels = monthLabels.sort((a, b) => {
                const posA = monthPositions.get(a.key) || 0;
                const posB = monthPositions.get(b.key) || 0;
                if (posA === posB) {
                  if (a.year !== b.year) return a.year - b.year;
                  return a.monthNum - b.monthNum;
                }
                return posA - posB;
              });

              sortedMonthLabels.forEach(({ month, key }) => {
                const position = monthPositions.get(key);
                if (position !== undefined) {
                  // Find the first empty position starting from the calculated position
                  let targetPosition = position;
                  while (
                    targetPosition < 53 &&
                    monthGrid[targetPosition] !== ""
                  ) {
                    targetPosition++;
                  }
                  if (targetPosition < 53) {
                    monthGrid[targetPosition] = month;
                  }
                }
              });

              return monthGrid.map((month, index) => (
                <span
                  key={index}
                  className="text-[10px] text-muted-foreground"
                  style={{
                    flex: 1,
                    textAlign: month ? "center" : "center",
                  }}
                >
                  {month}
                </span>
              ));
            })()}
          </div>
        )}

        {/* Contribution Squares */}
        <div className={`grid grid-cols-53 ${gapSize} max-w-full`}>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className={`flex flex-col ${gapSize}`}>
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  className={`
                    ${squareSize} rounded-sm cursor-pointer transition-all duration-200
                    ${getContributionColor(day.contributionCount)}
                    hover:scale-125 hover:ring-1 hover:ring-primary/30
                    focus:outline-none focus:ring-2 focus:ring-primary/50
                  `}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={() => setHoveredDay(null)}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${day.contributionCount} contributions on ${(() => {
                    const [year, month, dayNum] = day.date
                      .split("-")
                      .map(Number);
                    const date = new Date(year, month - 1, dayNum);
                    return date.toLocaleDateString();
                  })()}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend - Only show if not compact */}
        {!compact && (
          <div className="flex items-center justify-end mt-1 space-x-1">
            <span className="text-xs text-muted-foreground mr-1">Less</span>
            <div className="flex space-x-0.5">
              {[0, 1, 3, 6, 9].map((count) => (
                <div
                  key={count}
                  className={`w-1.5 h-1.5 rounded-sm ${getContributionColor(count)}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">More</span>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-xl pointer-events-none whitespace-nowrap border border-gray-700"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translateX(-50%)",
            }}
          >
            {getTooltipText(hoveredDay)}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

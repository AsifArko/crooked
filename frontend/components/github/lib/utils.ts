import {
  Contribution,
  ContributionDay,
  WeekData,
  MonthLabel,
  TooltipConfig,
} from "./types";
import {
  CONTRIBUTION_THRESHOLDS,
  GRID_CONFIG,
  TOOLTIP_CONFIG,
  MONTH_NAMES,
} from "./constants";

export function getContributionColor(
  count: number,
  colorScheme: Record<string, string>
): string {
  if (count === 0) return colorScheme.empty;
  if (count <= CONTRIBUTION_THRESHOLDS.LOW) return colorScheme.low;
  if (count <= CONTRIBUTION_THRESHOLDS.MEDIUM) return colorScheme.medium;
  if (count <= CONTRIBUTION_THRESHOLDS.HIGH) return colorScheme.high;
  return colorScheme.veryHigh;
}

export function formatTooltipText(contribution: Contribution): string {
  const [year, month, day] = contribution.date.split("-").map(Number);
  const date = new Date(year, month - 1, day);

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
}

export function calculateTooltipPosition(
  event: React.MouseEvent,
  position: "top" | "bottom" | "auto" = "auto"
): { x: number; y: number } {
  const rect = event.currentTarget.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = rect.left + rect.width / 2;
  let y = rect.top - TOOLTIP_CONFIG.OFFSET_Y;

  // Ensure tooltip doesn't go off-screen horizontally
  if (x < TOOLTIP_CONFIG.MIN_X) x = TOOLTIP_CONFIG.MIN_X;
  if (x > viewportWidth - TOOLTIP_CONFIG.MIN_X)
    x = viewportWidth - TOOLTIP_CONFIG.MIN_X;

  // Handle vertical positioning
  if (
    position === "top" ||
    (position === "auto" && y >= TOOLTIP_CONFIG.MIN_Y)
  ) {
    y = rect.top - TOOLTIP_CONFIG.OFFSET_Y;
  } else {
    y = rect.bottom + 10;
  }

  // Ensure tooltip doesn't go off-screen vertically
  if (y < TOOLTIP_CONFIG.MIN_Y) y = TOOLTIP_CONFIG.MIN_Y;
  if (y > viewportHeight - 50) y = viewportHeight - 50;

  return { x, y };
}

export function generateDateRange(): { startDate: Date; endDate: Date } {
  const currentDate = new Date();
  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (GRID_CONFIG.TOTAL_DAYS - 1));

  return { startDate, endDate };
}

export function createDateMap(
  contributions: Contribution[]
): Map<string, number> {
  const dateMap = new Map<string, number>();
  contributions.forEach((contribution) => {
    dateMap.set(contribution.date, contribution.contributionCount);
  });
  return dateMap;
}

export function generateAllDates(
  startDate: Date,
  dateMap: Map<string, number>
): ContributionDay[] {
  const allDates: ContributionDay[] = [];
  const current = new Date(startDate);

  for (let i = 0; i < GRID_CONFIG.TOTAL_DAYS; i++) {
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

  return allDates;
}

export function generateWeeks(allDates: ContributionDay[]): WeekData[] {
  const weeks: WeekData[] = [];

  // Find the first Sunday before or on the start date
  const firstDate = new Date(allDates[0].date);
  const firstSunday = new Date(firstDate);
  const dayOfWeek = firstSunday.getDay();
  firstSunday.setDate(firstSunday.getDate() - dayOfWeek);

  // Generate weeks starting from the first Sunday
  const currentWeek = new Date(firstSunday);
  for (let weekIndex = 0; weekIndex < GRID_CONFIG.WEEKS; weekIndex++) {
    const days: ContributionDay[] = [];

    for (let dayIndex = 0; dayIndex < GRID_CONFIG.DAYS_PER_WEEK; dayIndex++) {
      const dateString = currentWeek.toISOString().split("T")[0];
      const existingDay = allDates.find((day) => day.date === dateString);

      if (existingDay) {
        days.push(existingDay);
      } else {
        days.push({
          date: dateString,
          contributionCount: 0,
          month: currentWeek.getMonth(),
          day: currentWeek.getDate(),
          year: currentWeek.getFullYear(),
        });
      }

      currentWeek.setDate(currentWeek.getDate() + 1);
    }

    weeks.push({ weekIndex, days });
  }

  return weeks;
}

export function generateMonthLabels(weeks: WeekData[]): MonthLabel[] {
  const allMonthYears = new Set<string>();

  weeks.forEach((week) => {
    week.days.forEach((day) => {
      allMonthYears.add(`${day.year}-${day.month}`);
    });
  });

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

      if (year === currentYear - 1 && month === 6 && currentMonth >= 6) {
        return false;
      }
      return true;
    });

  const monthLabels = monthYearNumbers.map(({ year, month }) => ({
    month: MONTH_NAMES[month],
    monthNum: month,
    year,
    key: `${year}-${month}`,
    position: 0, // Will be calculated below
  }));

  // Calculate positions based on where months actually appear in the grid
  const monthPositions = new Map<string, number>();
  let currentMonthYear = "";

  weeks.forEach((week, weekIndex) => {
    week.days.forEach((day) => {
      const monthYear = `${day.year}-${day.month}`;
      if (monthYear !== currentMonthYear) {
        currentMonthYear = monthYear;
        if (!monthPositions.has(monthYear)) {
          // Position the month label at the week where it first appears
          monthPositions.set(monthYear, weekIndex);
        }
      }
    });
  });

  // Adjust positions to be more evenly distributed
  const sortedLabels = monthLabels.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthNum - b.monthNum;
  });

  const totalWeeks = weeks.length;
  const labelCount = sortedLabels.length;

  // Distribute labels evenly across the grid
  return sortedLabels.map((label, index) => {
    const basePosition = Math.floor(
      (index / (labelCount - 1)) * (totalWeeks - 1)
    );
    return {
      ...label,
      position: basePosition,
    };
  });
}

export function getSquareSize(compact: boolean): string {
  return compact ? "w-1 h-1" : "w-1.5 h-1.5";
}

export function getGapSize(compact: boolean): string {
  return compact ? "gap-1.5" : "gap-1.5";
}

export function formatContributionCount(count: number): string {
  return count.toLocaleString();
}

export function getAccessibilityLabel(day: ContributionDay): string {
  const [year, month, dayNum] = day.date.split("-").map(Number);
  const date = new Date(year, month - 1, dayNum);
  return `${day.contributionCount} contributions on ${date.toLocaleDateString()}`;
}

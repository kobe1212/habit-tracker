import type { Habit, CompletionData, HabitStats } from "../types";
import { dateUtils } from "./dateUtils";

const createdDate = (habit: Habit): string =>
  dateUtils.formatDate(new Date(habit.createdAt));

/** Is the habit scheduled on this date AND already created by then? */
export function isHabitDue(habit: Habit, dateStr: string): boolean {
  if (dateStr < createdDate(habit)) return false;
  return dateUtils.matchesFrequency(dateStr, habit.frequency);
}

export function isCompleted(
  completions: CompletionData,
  habitId: string,
  dateStr: string
): boolean {
  return completions[dateStr]?.[habitId] ?? false;
}

/**
 * Consecutive due days (ending today) that were completed.
 * If today is due but not yet done, we don't break the streak — the day
 * isn't over — we just start counting from yesterday.
 */
export function currentStreak(
  habit: Habit,
  completions: CompletionData,
  today = dateUtils.today()
): number {
  const start = createdDate(habit);
  let date = today;
  let streak = 0;

  if (isHabitDue(habit, date) && !isCompleted(completions, habit.id, date)) {
    date = dateUtils.subtractDays(date, 1);
  }

  while (date >= start) {
    if (isHabitDue(habit, date)) {
      if (isCompleted(completions, habit.id, date)) {
        streak++;
      } else {
        break;
      }
    }
    date = dateUtils.subtractDays(date, 1);
  }
  return streak;
}

/** Longest run of consecutive completed due days over the habit's lifetime. */
export function longestStreak(
  habit: Habit,
  completions: CompletionData,
  today = dateUtils.today()
): number {
  let date = createdDate(habit);
  let max = 0;
  let cur = 0;

  while (date <= today) {
    if (isHabitDue(habit, date)) {
      if (isCompleted(completions, habit.id, date)) {
        cur++;
        if (cur > max) max = cur;
      } else {
        cur = 0;
      }
    }
    date = dateUtils.addDays(date, 1);
  }
  return max;
}

/** % of due days completed in a given month (only counting days up to today). */
export function monthlyConsistency(
  habit: Habit,
  completions: CompletionData,
  year: number,
  month: number,
  today = dateUtils.today()
): number {
  const dates = dateUtils.getMonthDates(year, month);
  let due = 0;
  let done = 0;
  for (const date of dates) {
    if (date > today) break;
    if (isHabitDue(habit, date)) {
      due++;
      if (isCompleted(completions, habit.id, date)) done++;
    }
  }
  return due === 0 ? 0 : Math.round((done / due) * 100);
}

export function habitStats(
  habit: Habit,
  completions: CompletionData,
  today = dateUtils.today()
): HabitStats {
  const { year, month } = dateUtils.getCurrentMonth();
  return {
    currentStreak: currentStreak(habit, completions, today),
    longestStreak: longestStreak(habit, completions, today),
    monthlyConsistency: monthlyConsistency(habit, completions, year, month, today),
  };
}

/** Habits scheduled for a given date. */
export function habitsDueOn(habits: Habit[], dateStr: string): Habit[] {
  return habits.filter((h) => isHabitDue(h, dateStr));
}

/** Count of completed habits / total due for a date. */
export function dayProgress(
  habits: Habit[],
  completions: CompletionData,
  dateStr: string
): { completed: number; total: number } {
  const due = habitsDueOn(habits, dateStr);
  const completed = due.filter((h) => isCompleted(completions, h.id, dateStr)).length;
  return { completed, total: due.length };
}

export interface DayActivity {
  date: string;
  label: string;
  percent: number;
}

/** Last 7 days of completion percentage, oldest -> newest. */
export function weeklyActivity(
  habits: Habit[],
  completions: CompletionData,
  today = dateUtils.today()
): DayActivity[] {
  const out: DayActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = dateUtils.subtractDays(today, i);
    const { completed, total } = dayProgress(habits, completions, date);
    out.push({
      date,
      label: dateUtils.getShortDayName(dateUtils.getDayOfWeek(date)),
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    });
  }
  return out;
}

/** Number of completed habits logged on a single date ("total activity"). */
export function completionCountOnDate(
  completions: CompletionData,
  dateStr: string
): number {
  const day = completions[dateStr];
  if (!day) return 0;
  return Object.values(day).filter(Boolean).length;
}

/** Total number of completed entries across all habits and dates. */
export function totalCompletions(completions: CompletionData): number {
  let count = 0;
  for (const date of Object.keys(completions)) {
    for (const habitId of Object.keys(completions[date])) {
      if (completions[date][habitId]) count++;
    }
  }
  return count;
}

/** Completions in the trailing 7 days. */
export function completionsThisWeek(
  habits: Habit[],
  completions: CompletionData,
  today = dateUtils.today()
): number {
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const date = dateUtils.subtractDays(today, i);
    const { completed } = dayProgress(habits, completions, date);
    count += completed;
  }
  return count;
}

/** Days in the trailing 7 with at least one completion. */
export function daysActiveThisWeek(
  habits: Habit[],
  completions: CompletionData,
  today = dateUtils.today()
): number {
  let days = 0;
  for (let i = 0; i < 7; i++) {
    const date = dateUtils.subtractDays(today, i);
    if (dayProgress(habits, completions, date).completed > 0) days++;
  }
  return days;
}

/** Highest current streak across all habits. */
export function bestCurrentStreak(
  habits: Habit[],
  completions: CompletionData,
  today = dateUtils.today()
): number {
  return habits.reduce(
    (max, h) => Math.max(max, currentStreak(h, completions, today)),
    0
  );
}

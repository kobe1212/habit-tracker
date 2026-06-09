import { dateUtils } from './dateUtils';
import type { Habit, CompletionData } from '../types';

export const streakCalculator = {
  getCurrentStreak: (habit: Habit, completions: CompletionData): number => {
    let count = 0;
    let date = dateUtils.today();

    while (true) {
      if (!dateUtils.matchesFrequency(date, habit.frequency)) {
        date = dateUtils.subtractDays(date, 1);
        continue;
      }

      const isCompleted = completions[date]?.[habit.id] ?? false;
      if (!isCompleted) break;

      count++;
      date = dateUtils.subtractDays(date, 1);
    }

    return count;
  },

  getLongestStreak: (habit: Habit, completions: CompletionData): number => {
    let maxStreak = 0;
    let currentStreak = 0;

    // Get all dates with completions for this habit
    const allDates = Object.keys(completions).sort();

    for (const date of allDates) {
      if (!dateUtils.matchesFrequency(date, habit.frequency)) {
        currentStreak = 0;
        continue;
      }

      const isCompleted = completions[date]?.[habit.id] ?? false;
      if (isCompleted) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  },
};

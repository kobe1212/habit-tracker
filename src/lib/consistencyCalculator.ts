import { dateUtils } from './dateUtils';
import type { Habit, CompletionData } from '../types';

export const consistencyCalculator = {
  getMonthlyConsistency: (
    habit: Habit,
    completions: CompletionData,
    year: number,
    month: number
  ): number => {
    const monthDates = dateUtils.getMonthDates(year, month);
    let daysExpected = 0;
    let daysCompleted = 0;

    monthDates.forEach(date => {
      if (dateUtils.matchesFrequency(date, habit.frequency)) {
        daysExpected++;
        const isCompleted = completions[date]?.[habit.id] ?? false;
        if (isCompleted) {
          daysCompleted++;
        }
      }
    });

    if (daysExpected === 0) return 0;
    return Math.round((daysCompleted / daysExpected) * 100);
  },

  getTodayConsistency: (
    habit: Habit,
    completions: CompletionData,
    date: string
  ): boolean => {
    return completions[date]?.[habit.id] ?? false;
  },

  getWeeklyCompletionCount: (
    habits: Habit[],
    completions: CompletionData,
    dayOffset: number
  ): number => {
    const date = dateUtils.subtractDays(dateUtils.today(), dayOffset);
    const dayCompletions = completions[date] ?? {};
    const habitsDueOnDay = habits.filter(h => dateUtils.matchesFrequency(date, h.frequency));
    return habitsDueOnDay.filter(h => dayCompletions[h.id]).length;
  },
};

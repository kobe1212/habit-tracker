import { useMemo } from 'react';
import type { Habit, CompletionData, HabitStats } from '../types';
import { streakCalculator } from '../lib/streakCalculator';
import { consistencyCalculator } from '../lib/consistencyCalculator';
import { dateUtils } from '../lib/dateUtils';

export const useStats = (habits: Habit[], completions: CompletionData) => {
  const stats = useMemo<{ [habitId: string]: HabitStats }>(() => {
    const result: { [habitId: string]: HabitStats } = {};

    habits.forEach(habit => {
      const { year, month } = dateUtils.getCurrentMonth();
      result[habit.id] = {
        currentStreak: streakCalculator.getCurrentStreak(habit, completions),
        longestStreak: streakCalculator.getLongestStreak(habit, completions),
        monthlyConsistency: consistencyCalculator.getMonthlyConsistency(
          habit,
          completions,
          year,
          month
        ),
      };
    });

    return result;
  }, [habits, completions]);

  const getHabitStats = (habitId: string): HabitStats => {
    return stats[habitId] || { currentStreak: 0, longestStreak: 0, monthlyConsistency: 0 };
  };

  const getWeeklyData = (): number[] => {
    const weekData: number[] = [];
    for (let i = 6; i >= 0; i--) {
      weekData.push(consistencyCalculator.getWeeklyCompletionCount(habits, completions, i));
    }
    return weekData;
  };

  const getOverallStats = () => {
    const allStats = Object.values(stats);
    const avgConsistency =
      allStats.length > 0
        ? Math.round(
            allStats.reduce((sum, s) => sum + s.monthlyConsistency, 0) / allStats.length
          )
        : 0;

    const totalCurrentStreaks = allStats.reduce((sum, s) => sum + s.currentStreak, 0);
    const maxStreak = Math.max(...allStats.map(s => s.longestStreak), 0);

    return {
      avgConsistency,
      totalCurrentStreaks,
      maxStreak,
      habitsCount: habits.length,
    };
  };

  return {
    stats,
    getHabitStats,
    getWeeklyData,
    getOverallStats,
  };
};

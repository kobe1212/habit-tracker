import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { useCompletions } from '../hooks/useCompletions';
import { useStats } from '../hooks/useStats';
import StatsCard from './StatsCard';
import WeeklyChart from './WeeklyChart';

const StatsDashboard: React.FC = () => {
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completions, isLoading: completionsLoading } = useCompletions();
  const { getHabitStats, getWeeklyData, getOverallStats } = useStats(habits, completions);

  if (habitsLoading || completionsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 dark:bg-gray-800 rounded-lg p-8">
        <p className="text-gray-600 dark:text-gray-300">
          No habits to display. Create your first habit to start tracking!
        </p>
      </div>
    );
  }

  const overallStats = getOverallStats();
  const weeklyData = getWeeklyData();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Statistics</h2>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {overallStats.habitsCount}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Active Habits</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {overallStats.avgConsistency}%
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Avg Consistency</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {overallStats.totalCurrentStreaks}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Total Days on Fire 🔥</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {overallStats.maxStreak}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">Best Streak</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="mb-8">
        <WeeklyChart data={weeklyData} maxHabits={habits.length} />
      </div>

      {/* Per-Habit Stats */}
      <h3 className="text-lg font-bold mb-4">Habit Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => (
          <StatsCard
            key={habit.id}
            habitName={habit.name}
            habitColor={habit.color}
            stats={getHabitStats(habit.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;

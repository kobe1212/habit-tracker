import React from 'react';
import type { HabitStats } from '../types';

interface StatsCardProps {
  habitName: string;
  habitColor: string;
  stats: HabitStats;
}

const StatsCard: React.FC<StatsCardProps> = ({ habitName, habitColor, stats }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: habitColor }}
        />
        <h3 className="font-semibold truncate">{habitName}</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Current Streak */}
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.currentStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {stats.currentStreak === 1 ? 'Day' : 'Days'}
          </div>
          <div className="text-lg">🔥</div>
        </div>

        {/* Longest Streak */}
        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.longestStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Longest</div>
          <div className="text-lg">⭐</div>
        </div>

        {/* Monthly Consistency */}
        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.monthlyConsistency}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">This Month</div>
          <div className="text-lg">📊</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

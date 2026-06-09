import React from 'react';
import { useHabits } from '../hooks/useHabits';
import { useCompletions } from '../hooks/useCompletions';
import { dateUtils } from '../lib/dateUtils';

const TodayView: React.FC = () => {
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completions, toggleCompletion, isLoading: completionsLoading } = useCompletions();

  const today = dateUtils.today();
  const todayCompletions = completions[today] ?? {};

  const todayHabits = habits.filter(habit => dateUtils.matchesFrequency(today, habit.frequency));
  const completedCount = todayHabits.filter(h => todayCompletions[h.id]).length;
  const completionPercentage = todayHabits.length > 0 ? Math.round((completedCount / todayHabits.length) * 100) : 0;

  if (habitsLoading || completionsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (todayHabits.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 dark:bg-gray-800 rounded-lg p-8">
        <p className="text-gray-600 dark:text-gray-300">
          No habits scheduled for today. Rest well! 🎉
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Today's Habits</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Progress</span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {completedCount}/{todayHabits.length} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        {todayHabits.map(habit => {
          const isCompleted = todayCompletions[habit.id] ?? false;

          return (
            <div
              key={habit.id}
              onClick={() => toggleCompletion(habit.id, today)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isCompleted
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? 'text-white' : 'border-2'
                }`}
                style={{
                  backgroundColor: isCompleted ? habit.color : 'transparent',
                  borderColor: habit.color,
                }}
              >
                {isCompleted && <span className="text-lg">✓</span>}
              </div>
              <span className={`flex-1 font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                {habit.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayView;

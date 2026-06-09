import React from 'react';
import type { Habit } from '../types';
import { dateUtils } from '../lib/dateUtils';

interface HabitListProps {
  habits: Habit[];
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onEdit, onDelete }) => {
  const getFrequencyLabel = (habit: Habit): string => {
    if (habit.frequency === 'daily') {
      return 'Daily';
    }
    const days = (habit.frequency as number[]).map(d => dateUtils.getShortDayName(d));
    return days.join(', ');
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No habits yet. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map(habit => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-gray-900 transition-shadow"
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <div>
              <h3 className="font-medium">{habit.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {getFrequencyLabel(habit)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(habit)}
              className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${habit.name}"?`)) {
                  onDelete(habit.id);
                }
              }}
              className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;

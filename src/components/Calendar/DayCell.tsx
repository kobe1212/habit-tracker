import React from 'react';
import type { Habit } from '../../types';

interface DayCellProps {
  day: number | null;
  dateStr: string | null;
  habits: Habit[];
  completions: { [habitId: string]: boolean };
  onHabitToggle: (habitId: string, dateStr: string) => void;
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  dateStr,
  habits,
  completions,
  onHabitToggle,
  isCurrentMonth,
}) => {
  if (day === null || !dateStr) {
    return <div className="bg-gray-50 dark:bg-gray-800 p-2 md:p-3" />;
  }

  return (
    <div
      className={`border border-gray-200 dark:border-gray-700 p-2 md:p-3 min-h-20 md:min-h-24 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors ${
        !isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
        {day}
      </div>

      <div className="space-y-1">
        {habits.map(habit => {
          const isCompleted = completions[habit.id] ?? false;

          return (
            <button
              key={habit.id}
              onClick={() => onHabitToggle(habit.id, dateStr)}
              className={`block w-full text-left text-xs p-1 rounded transition-all ${
                isCompleted
                  ? 'font-semibold text-white'
                  : 'border border-dashed opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isCompleted ? habit.color : 'transparent',
                borderColor: habit.color,
              }}
              title={habit.name}
            >
              <span className="truncate block">{habit.name.substring(0, 8)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DayCell;

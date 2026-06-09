import React, { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { useCompletions } from '../../hooks/useCompletions';
import { dateUtils } from '../../lib/dateUtils';
import DayCell from './DayCell';

const Calendar: React.FC = () => {
  const { habits, isLoading: habitsLoading } = useHabits();
  const { completions, toggleCompletion, isLoading: completionsLoading } = useCompletions();
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const goToPreviousMonth = () => {
    setCurrentDate(prev => dateUtils.getPreviousMonth(prev.year, prev.month));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => dateUtils.getNextMonth(prev.year, prev.month));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate({ year: today.getFullYear(), month: today.getMonth() });
  };

  if (habitsLoading || completionsLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12 bg-blue-50 dark:bg-gray-800 rounded-lg p-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          No habits yet. Create your first habit in Settings to start tracking!
        </p>
      </div>
    );
  }

  const daysInMonth = dateUtils.getDaysInMonth(currentDate.year, currentDate.month);
  const monthStartDay = dateUtils.getMonthStartDay(currentDate.year, currentDate.month);
  const monthName = dateUtils.getMonthName(currentDate.month);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < monthStartDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {monthName} {currentDate.year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={goToPreviousMonth}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={goToNextMonth}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: habit.color }}
            />
            <span className="text-gray-700 dark:text-gray-300">{habit.name}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const isCurrentMonth = day !== null;
            const dateStr = isCurrentMonth
              ? `${currentDate.year}-${String(currentDate.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : null;

            const dayCompletions = dateStr ? (completions[dateStr] ?? {}) : {};

            return (
              <DayCell
                key={idx}
                day={day}
                dateStr={dateStr}
                habits={habits}
                completions={dayCompletions}
                onHabitToggle={toggleCompletion}
                isCurrentMonth={isCurrentMonth}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

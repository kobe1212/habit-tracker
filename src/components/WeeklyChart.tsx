import React from 'react';
import { dateUtils } from '../lib/dateUtils';

interface WeeklyChartProps {
  data: number[];
  maxHabits: number;
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, maxHabits }) => {
  const weekDates = dateUtils.getCurrentWeekDates();
  const maxValue = Math.max(...data, maxHabits, 1);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-900">
      <h3 className="font-semibold mb-4">This Week's Progress</h3>

      <div className="flex items-end justify-around gap-2 h-48">
        {data.map((value, idx) => {
          const date = new Date(weekDates[idx] + 'T00:00:00');
          const dayName = dateUtils.getShortDayName(date.getDay());
          const heightPercent = (value / maxValue) * 100;
          const isToday =
            dateUtils.today() === weekDates[idx]
              ? 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900'
              : '';

          return (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full max-w-12 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end justify-center overflow-hidden">
                <div
                  className={`w-full bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 transition-all ${isToday}`}
                  style={{ height: `${heightPercent}%` }}
                >
                  {value > 0 && (
                    <div className="flex items-center justify-center h-full text-white text-sm font-bold">
                      {value}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {dayName}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
        Max: {maxHabits} {maxHabits === 1 ? 'habit' : 'habits'} per day
      </div>
    </div>
  );
};

export default WeeklyChart;

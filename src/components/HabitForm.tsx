import React, { useState } from 'react';
import type { Habit, Frequency } from '../types';

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#d946ef', '#ec4899', '#f43f5e',
];

const WEEKDAYS = [
  { day: 0, label: 'Sun' },
  { day: 1, label: 'Mon' },
  { day: 2, label: 'Tue' },
  { day: 3, label: 'Wed' },
  { day: 4, label: 'Thu' },
  { day: 5, label: 'Fri' },
  { day: 6, label: 'Sat' },
];

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (name: string, color: string, frequency: Frequency) => void;
  onCancel: () => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ habit, onSubmit, onCancel }) => {
  const [name, setName] = useState(habit?.name || '');
  const [color, setColor] = useState(habit?.color || '#3b82f6');
  const [isDaily, setIsDaily] = useState(habit?.frequency === 'daily');
  const [selectedDays, setSelectedDays] = useState<number[]>(
    habit?.frequency !== 'daily' ? (habit?.frequency as number[]) : [1, 2, 3, 4, 5]
  );

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    const frequency: Frequency = isDaily ? 'daily' : selectedDays;
    onSubmit(name.trim(), color, frequency);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">
          {habit ? 'Edit Habit' : 'New Habit'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Morning Run"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    color === c ? 'ring-2 ring-offset-1 dark:ring-offset-gray-900 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium mb-2">Frequency</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={isDaily}
                  onChange={() => setIsDaily(true)}
                  className="mr-2"
                />
                <span>Daily</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!isDaily}
                  onChange={() => setIsDaily(false)}
                  className="mr-2"
                />
                <span>Specific Days</span>
              </label>
            </div>

            {!isDaily && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {WEEKDAYS.map(({ day, label }) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`py-2 px-1 rounded text-sm font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {habit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;

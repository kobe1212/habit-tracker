import type { Habit, CompletionData } from '../types';

const HABITS_KEY = 'habit-tracker-habits';
const COMPLETIONS_KEY = 'habit-tracker-completions';

export const storageService = {
  // Habits
  getHabits: (): Habit[] => {
    const stored = localStorage.getItem(HABITS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveHabits: (habits: Habit[]): void => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  // Completions
  getCompletions: (): CompletionData => {
    const stored = localStorage.getItem(COMPLETIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  },

  saveCompletions: (completions: CompletionData): void => {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  },

  // Utility
  clearAll: (): void => {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(COMPLETIONS_KEY);
  },
};

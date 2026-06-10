import type { Habit, CompletionData } from '../types';

const HABITS_KEY = 'habit-tracker-habits';
const COMPLETIONS_KEY = 'habit-tracker-completions';

// Corrupted or tampered localStorage must never crash the app at startup.
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

export const storageService = {
  // Habits
  getHabits: (): Habit[] => {
    const habits = safeParse<Habit[]>(localStorage.getItem(HABITS_KEY), []);
    return Array.isArray(habits) ? habits : [];
  },

  saveHabits: (habits: Habit[]): void => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  // Completions
  getCompletions: (): CompletionData => {
    return safeParse<CompletionData>(localStorage.getItem(COMPLETIONS_KEY), {});
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

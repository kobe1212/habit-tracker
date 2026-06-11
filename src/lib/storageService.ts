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

// Writes can throw (e.g. QuotaExceededError when storage is full or in private
// mode). Swallow the failure so the in-memory state stays usable for the session.
function safeWrite(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist "${key}" to localStorage:`, err);
  }
}

export const storageService = {
  // Habits
  getHabits: (): Habit[] => {
    const habits = safeParse<Habit[]>(localStorage.getItem(HABITS_KEY), []);
    return Array.isArray(habits) ? habits : [];
  },

  saveHabits: (habits: Habit[]): void => {
    safeWrite(HABITS_KEY, habits);
  },

  // Completions
  getCompletions: (): CompletionData => {
    return safeParse<CompletionData>(localStorage.getItem(COMPLETIONS_KEY), {});
  },

  saveCompletions: (completions: CompletionData): void => {
    safeWrite(COMPLETIONS_KEY, completions);
  },

  // Utility
  clearAll: (): void => {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(COMPLETIONS_KEY);
  },
};

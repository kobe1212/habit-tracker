export type Frequency = 'daily' | number[];

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  frequency: Frequency;
  createdAt: string;
  /** Category id (see lib/categories). Optional for backward compatibility. */
  category?: string;
}

export interface CompletionData {
  [date: string]: {
    [habitId: string]: boolean;
  };
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  monthlyConsistency: number;
}

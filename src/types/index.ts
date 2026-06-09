export type Frequency = 'daily' | number[];

export interface Habit {
  id: string;
  name: string;
  color: string;
  frequency: Frequency;
  createdAt: string;
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

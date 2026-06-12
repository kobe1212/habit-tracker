import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import type { Habit, CompletionData, Frequency } from "../types";
import { storageService } from "../lib/storageService";
import { dateUtils } from "../lib/dateUtils";

interface HabitStoreValue {
  habits: Habit[];
  completions: CompletionData;
  addHabit: (data: Omit<Habit, "id" | "createdAt">) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  getHabit: (id: string) => Habit | undefined;
  isCompleted: (habitId: string, date: string) => boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  resetData: () => void;
}

const HabitStoreContext = createContext<HabitStoreValue | null>(null);

export function HabitStoreProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const existing = storageService.getHabits();
    if (existing.length > 0) return existing;
    // First run: seed sample data so the app looks alive.
    const seeded = buildSeed();
    storageService.saveHabits(seeded.habits);
    storageService.saveCompletions(seeded.completions);
    return seeded.habits;
  });

  const [completions, setCompletions] = useState<CompletionData>(() =>
    storageService.getCompletions()
  );

  useEffect(() => {
    storageService.saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    storageService.saveCompletions(completions);
  }, [completions]);

  const value = useMemo<HabitStoreValue>(
    () => ({
      habits,
      completions,
      addHabit: (data) => {
        const habit: Habit = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        setHabits((prev) => [...prev, habit]);
        return habit;
      },
      updateHabit: (id, updates) =>
        setHabits((prev) =>
          prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
        ),
      deleteHabit: (id) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
        setCompletions((prev) => {
          const next: CompletionData = {};
          for (const date of Object.keys(prev)) {
            const { [id]: _removed, ...rest } = prev[date];
            if (Object.keys(rest).length > 0) next[date] = rest;
          }
          return next;
        });
      },
      getHabit: (id) => habits.find((h) => h.id === id),
      isCompleted: (habitId, date) => completions[date]?.[habitId] ?? false,
      toggleCompletion: (habitId, date) =>
        setCompletions((prev) => {
          const day = { ...(prev[date] ?? {}) };
          if (day[habitId]) {
            delete day[habitId];
          } else {
            day[habitId] = true;
          }
          const next = { ...prev, [date]: day };
          if (Object.keys(day).length === 0) delete next[date];
          return next;
        }),
      resetData: () => {
        const seeded = buildSeed();
        setHabits(seeded.habits);
        setCompletions(seeded.completions);
      },
    }),
    [habits, completions]
  );

  return (
    <HabitStoreContext.Provider value={value}>
      {children}
    </HabitStoreContext.Provider>
  );
}

export function useHabitStore(): HabitStoreValue {
  const ctx = useContext(HabitStoreContext);
  if (!ctx) {
    throw new Error("useHabitStore must be used within a HabitStoreProvider");
  }
  return ctx;
}

// --- Seed data ---------------------------------------------------------------

interface SeedSpec {
  name: string;
  color: string;
  icon: string;
  category: string;
  frequency: Frequency;
  daysAgoCreated: number;
  /** probability a due day is marked complete */
  reliability: number;
}

const SEED_SPECS: SeedSpec[] = [
  { name: "Morning Run", color: "#3b82f6", icon: "🏃", category: "fitness", frequency: "daily", daysAgoCreated: 90, reliability: 0.85 },
  { name: "Drink Water", color: "#06b6d4", icon: "💧", category: "health", frequency: "daily", daysAgoCreated: 60, reliability: 0.7 },
  { name: "Read a Book", color: "#8b5cf6", icon: "📖", category: "mind", frequency: [1, 3, 5], daysAgoCreated: 45, reliability: 0.8 },
  { name: "Meditate", color: "#10b981", icon: "🧘", category: "personal", frequency: "daily", daysAgoCreated: 120, reliability: 0.9 },
];

function buildSeed(): { habits: Habit[]; completions: CompletionData } {
  const today = dateUtils.today();
  const habits: Habit[] = [];
  const completions: CompletionData = {};

  for (const spec of SEED_SPECS) {
    const created = dateUtils.subtractDays(today, spec.daysAgoCreated);
    const habit: Habit = {
      id: uuidv4(),
      name: spec.name,
      color: spec.color,
      icon: spec.icon,
      category: spec.category,
      frequency: spec.frequency,
      createdAt: new Date(created + "T09:00:00").toISOString(),
    };
    habits.push(habit);

    // Fill history. Make the most recent ~8 due days solid so streaks look good.
    let date = created;
    const dueDates: string[] = [];
    while (date <= today) {
      if (dateUtils.matchesFrequency(date, spec.frequency)) dueDates.push(date);
      date = dateUtils.addDays(date, 1);
    }
    for (let i = 0; i < dueDates.length; i++) {
      const d = dueDates[i];
      const isRecent = dueDates.length - 1 - i < 8;
      const isToday = d === today;
      const complete = isToday
        ? Math.random() < 0.4 // today is partially done
        : isRecent
        ? true
        : Math.random() < spec.reliability;
      if (complete) {
        if (!completions[d]) completions[d] = {};
        completions[d][habit.id] = true;
      }
    }
  }

  return { habits, completions };
}

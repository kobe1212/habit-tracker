import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Habit, Frequency } from '../types';
import { storageService } from '../lib/storageService';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from localStorage on mount
  useEffect(() => {
    const stored = storageService.getHabits();
    setHabits(stored);
    setIsLoading(false);
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      storageService.saveHabits(habits);
    }
  }, [habits, isLoading]);

  const addHabit = (name: string, color: string, frequency: Frequency): Habit => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      color,
      frequency,
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
    return newHabit;
  };

  const updateHabit = (id: string, updates: Partial<Habit>): void => {
    setHabits(habits.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string): void => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getHabit = (id: string): Habit | undefined => {
    return habits.find(h => h.id === id);
  };

  return {
    habits,
    isLoading,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabit,
  };
};

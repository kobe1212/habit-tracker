import { useState, useEffect } from 'react';
import type { CompletionData } from '../types';
import { storageService } from '../lib/storageService';
import { dateUtils } from '../lib/dateUtils';

export const useCompletions = () => {
  const [completions, setCompletions] = useState<CompletionData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load completions from localStorage on mount
  useEffect(() => {
    const stored = storageService.getCompletions();
    setCompletions(stored);
    setIsLoading(false);
  }, []);

  // Save completions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      storageService.saveCompletions(completions);
    }
  }, [completions, isLoading]);

  const isCompleted = (habitId: string, date: string): boolean => {
    return completions[date]?.[habitId] ?? false;
  };

  const toggleCompletion = (habitId: string, date: string): void => {
    setCompletions(prev => {
      const updated = { ...prev };
      if (!updated[date]) {
        updated[date] = {};
      }
      updated[date][habitId] = !updated[date][habitId];
      return updated;
    });
  };

  const markComplete = (habitId: string, date: string): void => {
    setCompletions(prev => {
      const updated = { ...prev };
      if (!updated[date]) {
        updated[date] = {};
      }
      updated[date][habitId] = true;
      return updated;
    });
  };

  const markIncomplete = (habitId: string, date: string): void => {
    setCompletions(prev => {
      const updated = { ...prev };
      if (!updated[date]) {
        updated[date] = {};
      }
      updated[date][habitId] = false;
      return updated;
    });
  };

  const getDateCompletions = (date: string): { [habitId: string]: boolean } => {
    return completions[date] ?? {};
  };

  const getTodayCompletions = (): { [habitId: string]: boolean } => {
    return getDateCompletions(dateUtils.today());
  };

  const deleteHabitCompletions = (habitId: string): void => {
    setCompletions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(date => {
        delete updated[date][habitId];
      });
      return updated;
    });
  };

  return {
    completions,
    isLoading,
    isCompleted,
    toggleCompletion,
    markComplete,
    markIncomplete,
    getDateCompletions,
    getTodayCompletions,
    deleteHabitCompletions,
  };
};

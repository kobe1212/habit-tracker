import React, { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useCompletions } from '../hooks/useCompletions';
import type { Habit, Frequency } from '../types';
import HabitForm from '../components/HabitForm';
import HabitList from '../components/HabitList';

const SettingsPage: React.FC = () => {
  const { habits, addHabit, updateHabit, deleteHabit, isLoading } = useHabits();
  const { deleteHabitCompletions } = useCompletions();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const handleAddOrUpdate = (name: string, color: string, frequency: Frequency) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, { name, color, frequency });
      setEditingHabit(undefined);
    } else {
      addHabit(name, color, frequency);
    }
    setShowForm(false);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId);
    deleteHabitCompletions(habitId);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(undefined);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Habits</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          + New Habit
        </button>
      </div>

      <HabitList
        habits={habits}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSubmit={handleAddOrUpdate}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default SettingsPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useHabitStore } from "../store/HabitStore";
import { currentStreak } from "../lib/stats";
import { frequencyLabel } from "../lib/format";
import { CATEGORIES, getCategory } from "../lib/categories";

const FILTERS: { id: string | null; name: string; color: string }[] = [
  { id: null, name: "All", color: "#3b82f6" },
  ...CATEGORIES,
];

export default function Habits() {
  const navigate = useNavigate();
  const { habits, completions } = useHabitStore();
  const [filter, setFilter] = useState<string | null>(null);

  const shown =
    filter === null
      ? habits
      : habits.filter((h) => getCategory(h.category).id === filter);

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Habits</h1>
            <p className="text-sm text-muted mt-1">
              {habits.length} active habit{habits.length === 1 ? "" : "s"}
            </p>
          </div>
          <motion.button
            onClick={() => navigate("/habits/new")}
            whileHover={{ rotate: 90, scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
            className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white text-xl"
          >
            +
          </motion.button>
        </header>

        {habits.length === 0 ? (
          <div className="mt-10 bg-surface rounded-3xl p-10 text-center">
            <p className="text-4xl">🌱</p>
            <p className="mt-3 font-semibold">No habits yet</p>
            <p className="text-sm text-muted mt-1">
              Create your first habit to start tracking.
            </p>
            <button
              onClick={() => navigate("/habits/new")}
              className="mt-5 bg-brand text-white font-semibold px-5 py-2.5 rounded-xl"
            >
              + New Habit
            </button>
          </div>
        ) : (
          <>
            {/* Category filter */}
            <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
              {FILTERS.map((f) => {
                const selected = filter === f.id;
                return (
                  <button
                    key={f.id ?? "all"}
                    onClick={() => setFilter(f.id)}
                    className="relative shrink-0 rounded-full px-4 py-2 text-sm font-medium"
                  >
                    {selected && (
                      <motion.span
                        layoutId="catFilterPill"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: f.color }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className={`relative ${selected ? "text-white" : "text-muted"}`}>
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* List */}
            {shown.length === 0 ? (
              <p className="mt-10 text-center text-sm text-muted">
                No habits in this category yet.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3">
                {shown.map((h, i) => {
                  const streak = currentStreak(h, completions);
                  const cat = getCategory(h.category);
                  return (
                    <motion.button
                      key={h.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/habit/${h.id}`)}
                      className="bg-surface rounded-2xl p-4 flex items-center gap-4 text-left"
                    >
                      <span
                        className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl"
                        style={{ backgroundColor: `${h.color}22` }}
                      >
                        {h.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{h.name}</p>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          {cat.name} · {frequencyLabel(h.frequency)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: h.color }}>
                          🔥 {streak}
                        </p>
                        <p className="text-[10px] text-muted">day streak</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import ProgressRing from "../components/ProgressRing";
import HabitCard from "../components/HabitCard";
import BottomNav from "../components/BottomNav";

// --- Static mock data (front-end only; wired to real data in a later phase) ---
const week = [
  { day: 5, label: "Mon" },
  { day: 6, label: "Tue" },
  { day: 7, label: "Wed" },
  { day: 8, label: "Thu" },
  { day: 9, label: "Fri" },
  { day: 10, label: "Sat" },
  { day: 11, label: "Sun" },
];

const habits = [
  { name: "Jogging 5KM", status: "Success", completed: 16, total: 16, icon: "🏃" },
  { name: "Drink Water", status: "In Progress", completed: 5, total: 8, icon: "💧", highlight: true },
  { name: "Read a Book", status: "In Progress", completed: 12, total: 30, icon: "📖" },
  { name: "Meditate", status: "Success", completed: 1, total: 1, icon: "🧘" },
];

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(8);

  return (
    <div className="flex flex-col h-full text-white">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted">
            <Chevron dir="left" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Today</h1>
            <p className="text-xs text-muted mt-0.5">Nov 18, 2024</p>
          </div>
          <button className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted">
            <Chevron dir="right" />
          </button>
        </header>

        {/* Week strip */}
        <div className="flex justify-between mt-6">
          {week.map(({ day, label }) => {
            const active = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    active
                      ? "bg-brand text-white"
                      : "bg-surface text-white/80"
                  }`}
                >
                  {day}
                </span>
                <span
                  className={`text-[11px] ${
                    active ? "text-white font-medium" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Streak banner */}
        <div className="mt-6 bg-surface rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium">
            🔥 24 Days Streak. Keep it up!
          </span>
          <button className="bg-brand text-white text-xs font-semibold px-4 py-2 rounded-xl">
            Details
          </button>
        </div>

        {/* Affirmation card */}
        <div className="mt-4 bg-surface rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10" />
          <div className="absolute right-6 bottom-2 h-16 w-16 rounded-full bg-brand/5" />
          <p className="text-[15px] leading-relaxed font-medium relative">
            My mind is calm, my heart is open, and my spirit is strong.
          </p>
        </div>

        {/* Progress ring */}
        <div className="mt-8 flex justify-center">
          <ProgressRing completed={16} total={20} />
        </div>

        {/* Habit tracker */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Habit Tracker</h2>
            <button className="text-xs text-brand font-medium">See all</button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-5 px-5">
            {habits.map((h) => (
              <HabitCard key={h.name} {...h} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className={dir === "right" ? "rotate-180" : ""}
    >
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProgressRing from "../components/ProgressRing";
import Avatar from "../components/Avatar";
import { useHabitStore } from "../store/HabitStore";
import { useProfile } from "../store/ProfileStore";
import { dateUtils } from "../lib/dateUtils";
import { habitsDueOn, dayProgress, bestCurrentStreak } from "../lib/stats";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function prettyDate(dateStr: string): string {
  const d = dateUtils.parseDate(dateStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function Home() {
  const navigate = useNavigate();
  const { habits, completions, isCompleted, toggleCompletion } = useHabitStore();
  const { profile } = useProfile();
  const today = dateUtils.today();
  const [selectedDate, setSelectedDate] = useState(today);

  const weekDates = dateUtils.getCurrentWeekDates();
  const dueHabits = habitsDueOn(habits, selectedDate);
  const { completed, total } = dayProgress(habits, completions, selectedDate);
  const streak = bestCurrentStreak(habits, completions, today);
  const isFuture = selectedDate > today;

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <span className="h-9 w-9" />
          <div className="text-center">
            <h1 className="text-lg font-bold">
              {selectedDate === today ? "Today" : dateUtils.getDayName(dateUtils.getDayOfWeek(selectedDate))}
            </h1>
            <p className="text-xs text-muted mt-0.5">{prettyDate(selectedDate)}</p>
          </div>
          <button onClick={() => navigate("/profile")} aria-label="Profile">
            <Avatar avatar={profile.avatar} size={36} />
          </button>
        </header>

        {/* Week strip */}
        <div className="flex justify-between mt-6">
          {weekDates.map((date) => {
            const d = dateUtils.parseDate(date);
            const active = date === selectedDate;
            const isToday = date === today;
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={`relative h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                    active ? "text-white" : "bg-surface text-fg/80"
                  } ${isToday && !active ? "ring-1 ring-brand" : ""}`}
                >
                  {active && (
                    <motion.span
                      layoutId="weekPill"
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{d.getDate()}</span>
                </span>
                <span className={`text-[11px] ${active ? "text-fg font-medium" : "text-muted"}`}>
                  {dateUtils.getShortDayName(d.getDay())}
                </span>
              </button>
            );
          })}
        </div>

        {/* Streak banner */}
        <div className="mt-6 bg-surface rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium">
            🔥 {streak} Day{streak === 1 ? "" : "s"} Streak. Keep it up!
          </span>
          <button
            onClick={() => navigate("/analytics")}
            className="bg-brand text-white text-xs font-semibold px-4 py-2 rounded-xl"
          >
            Details
          </button>
        </div>

        {/* Affirmation */}
        <div className="mt-4 bg-surface rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand/10" />
          <div className="absolute right-6 bottom-2 h-16 w-16 rounded-full bg-brand/5" />
          <p className="text-[15px] leading-relaxed font-medium relative">
            My mind is calm, my heart is open, and my spirit is strong.
          </p>
        </div>

        {/* Progress ring */}
        <div className="mt-8 flex justify-center">
          <ProgressRing completed={completed} total={total} />
        </div>

        {/* Habit list for the selected day */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {selectedDate === today ? "Today's Habits" : "Habits"}
            </h2>
            <button onClick={() => navigate("/habits")} className="text-xs text-brand font-medium">
              See all
            </button>
          </div>

          {dueHabits.length === 0 ? (
            <div className="bg-surface rounded-2xl p-8 text-center">
              <p className="text-muted text-sm">
                {habits.length === 0
                  ? "No habits yet. Tap + on the Habits tab to create one."
                  : "No habits scheduled for this day."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {dueHabits.map((h, i) => {
                const done = isCompleted(h.id, selectedDate);
                return (
                  <motion.button
                    key={h.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !isFuture && toggleCompletion(h.id, selectedDate)}
                    disabled={isFuture}
                    className={`rounded-2xl p-4 flex items-center gap-4 text-left transition-colors disabled:opacity-50 ${
                      done ? "bg-brand/15 ring-1 ring-brand/40" : "bg-surface"
                    }`}
                  >
                    <span
                      className="h-11 w-11 rounded-2xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${h.color}22` }}
                    >
                      {h.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold">{h.name}</p>
                      <p className={`text-xs mt-0.5 ${done ? "text-brand" : "text-muted"}`}>
                        {done ? "Completed" : "Pending"}
                      </p>
                    </div>
                    <CheckCircle done={done} color={h.color} />
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ done, color }: { done: boolean; color: string }) {
  return (
    <span
      className="h-7 w-7 rounded-full flex items-center justify-center border-2 transition-colors duration-200"
      style={{
        borderColor: done ? color : "var(--color-surface-2)",
        backgroundColor: done ? color : "transparent",
      }}
    >
      {done && (
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.55, duration: 0.45 }}
        >
          <path d="m5 12 5 5 9-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      )}
    </span>
  );
}

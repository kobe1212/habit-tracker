import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useHabitStore } from "../store/HabitStore";
import { dateUtils } from "../lib/dateUtils";
import {
  isHabitDue,
  isCompleted as isDone,
  currentStreak,
  longestStreak,
  monthlyConsistency,
} from "../lib/stats";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HabitDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getHabit, completions, toggleCompletion } = useHabitStore();
  const habit = getHabit(id ?? "");

  const initial = dateUtils.getCurrentMonth();
  const [view, setView] = useState(initial);

  if (!habit) {
    return (
      <div className="flex flex-col h-full text-white items-center justify-center px-5">
        <p className="text-muted">Habit not found.</p>
        <button onClick={() => navigate("/habits")} className="mt-4 bg-brand px-5 py-2.5 rounded-xl font-semibold">
          Back to Habits
        </button>
      </div>
    );
  }

  const today = dateUtils.today();
  const created = dateUtils.formatDate(new Date(habit.createdAt));
  const cur = currentStreak(habit, completions, today);
  const longest = longestStreak(habit, completions, today);
  const consistency = monthlyConsistency(habit, completions, view.year, view.month, today);

  // --- Year to date: completions per trailing 12 months ---
  const yearBars: { label: string; value: number }[] = [];
  let cursor = dateUtils.getCurrentMonth();
  const seq: { year: number; month: number }[] = [];
  for (let i = 0; i < 12; i++) {
    seq.unshift({ ...cursor });
    cursor = dateUtils.getPreviousMonth(cursor.year, cursor.month);
  }
  for (const { year, month } of seq) {
    const count = dateUtils
      .getMonthDates(year, month)
      .filter((d) => d <= today && isDone(completions, habit.id, d)).length;
    yearBars.push({ label: MONTHS_SHORT[month], value: count });
  }
  const maxBar = Math.max(...yearBars.map((b) => b.value), 1);

  // --- Month calendar grid (Monday-first) ---
  const startDay = dateUtils.getMonthStartDay(view.year, view.month); // 0=Sun
  const leadingBlanks = (startDay + 6) % 7;
  const daysInMonth = dateUtils.getDaysInMonth(view.year, view.month);

  const prevMonth = () => setView(dateUtils.getPreviousMonth(view.year, view.month));
  const nextMonth = () => setView(dateUtils.getNextMonth(view.year, view.month));

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Habit Detail</h1>
          <span className="w-9" />
        </header>

        {/* Title row */}
        <div className="flex items-start justify-between mt-6 gap-3">
          <div className="flex items-start gap-3">
            <span className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${habit.color}22` }}>
              {habit.icon}
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight">{habit.name}</h2>
              <p className="text-sm text-brand mt-1">
                Start from {MONTHS_SHORT[dateUtils.parseDate(created).getMonth()]}{" "}
                {dateUtils.parseDate(created).getDate()}, {dateUtils.parseDate(created).getFullYear()}
              </p>
            </div>
          </div>
          <button onClick={() => navigate(`/habit/${habit.id}/edit`)} className="bg-surface text-sm font-semibold px-4 py-2 rounded-xl shrink-0">
            Edit
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatBox value={`${cur}`} label="Current 🔥" />
          <StatBox value={`${longest}`} label="Longest ⭐" />
          <StatBox value={`${consistency}%`} label="This month" />
        </div>

        {/* Year to date progress */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <h3 className="font-semibold">Year to Date Progress</h3>
          <div className="mt-4 flex items-end justify-between gap-1 h-36">
            {yearBars.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full rounded-md bg-brand" style={{ height: `${(b.value / maxBar) * 100}%`, minHeight: b.value > 0 ? 4 : 0 }} />
                <span className="text-[8px] text-muted">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly calendar */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-semibold">
              {dateUtils.getMonthName(view.month)}, {view.year}
            </span>
            <button onClick={nextMonth} className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="rotate-180">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 mt-4 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
              <span key={i} className="text-center text-[11px] text-muted">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: leadingBlanks }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const due = isHabitDue(habit, dateStr);
              const done = isDone(completions, habit.id, dateStr);
              const success = due && done;
              const skipped = due && !done && dateStr < today;
              const isFuture = dateStr > today;
              return (
                <div key={day} className="flex justify-center">
                  <button
                    onClick={() => !isFuture && due && toggleCompletion(habit.id, dateStr)}
                    disabled={isFuture || !due}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      success ? "bg-brand text-white" : skipped ? "bg-surface-2 text-muted" : "text-white/80"
                    } ${dateStr === today ? "ring-1 ring-brand" : ""}`}
                  >
                    {String(day).padStart(2, "0")}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-5 mt-5">
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 rounded-full bg-brand" /> Success Day
            </span>
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 rounded-full bg-surface-2" /> Skipped Day
            </span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface rounded-2xl p-3 text-center">
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[11px] text-muted mt-1">{label}</p>
    </div>
  );
}

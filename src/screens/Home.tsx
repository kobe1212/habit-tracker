import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import ProgressRing from "../components/ProgressRing";
import Avatar from "../components/Avatar";
import { StreakBadge } from "@/components/ui/streak-badge";
import { useHabitStore } from "../store/HabitStore";
import { useProfile } from "../store/ProfileStore";
import { dateUtils } from "../lib/dateUtils";
import { habitsDueOn, dayProgress, bestCurrentStreak } from "../lib/stats";

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function prettyDate(dateStr: string): string {
  const d = dateUtils.parseDate(dateStr);
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

const weekVariants = {
  enter: (dir: number) => ({ x: dir * 70, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -70, opacity: 0 }),
};

export default function Home() {
  const navigate = useNavigate();
  const { habits, completions, isCompleted, toggleCompletion } = useHabitStore();
  const { profile } = useProfile();
  const today = dateUtils.today();
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [direction, setDirection] = useState(0);

  const weekDates = dateUtils
    .getCurrentWeekDates()
    .map((d) => dateUtils.addDays(d, weekOffset * 7));

  const changeWeek = (delta: number) => {
    const next = weekOffset + delta;
    setDirection(delta);
    setWeekOffset(next);
    // Land on today when returning to the current week, else on that week's Monday.
    setSelectedDate(
      next === 0 ? today : dateUtils.addDays(dateUtils.getCurrentWeekDates()[0], next * 7)
    );
  };

  const dueHabits = habitsDueOn(habits, selectedDate);
  const { completed, total } = dayProgress(habits, completions, selectedDate);
  const streak = bestCurrentStreak(habits, completions, today);
  const isFuture = selectedDate > today;

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Profile greeting header */}
        <header>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3"
            aria-label="Open profile"
          >
            <Avatar avatar={profile.avatar} size={40} />
            <span className="text-left">
              <span className="block text-xs text-muted leading-tight">{greeting()},</span>
              <span className="block font-semibold leading-tight">{profile.name}</span>
            </span>
          </button>
        </header>

        {/* Week navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => changeWeek(-1)}
            aria-label="Previous week"
            className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted"
          >
            <Chevron dir="left" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold">
              {selectedDate === today
                ? "Today"
                : dateUtils.getDayName(dateUtils.getDayOfWeek(selectedDate))}
            </h1>
            <p className="text-xs text-muted mt-0.5">{prettyDate(selectedDate)}</p>
          </div>
          <button
            onClick={() => changeWeek(1)}
            aria-label="Next week"
            className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted"
          >
            <Chevron dir="right" />
          </button>
        </div>

        {/* Week strip (slides between weeks) */}
        <div className="mt-5 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={weekOffset}
              custom={direction}
              variants={weekVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex justify-between"
            >
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
                    <span
                      className={`text-[11px] ${active ? "text-fg font-medium" : "text-muted"}`}
                    >
                      {dateUtils.getShortDayName(d.getDay())}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Streak badge */}
        <div className="mt-6 flex justify-center">
          <StreakBadge
            length={streak}
            frequency="daily"
            subtitle="streak — keep it up!"
            icon={<AnimatedFlame />}
            onClick={() => navigate("/analytics")}
            className="cursor-pointer w-44"
          />
        </div>

        {/* Progress ring */}
        <div className="mt-6 flex justify-center">
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

/** Flickering flame: gentle scale/sway loop with a warm glow. */
function AnimatedFlame() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.12, 0.96, 1.08, 1],
        rotate: [0, -4, 3, -2, 0],
      }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      style={{ filter: "drop-shadow(0 0 10px rgba(249, 115, 22, 0.45))" }}
      aria-hidden="true"
    >
      <Flame className="h-16 w-16 text-orange-500 shrink-0" fill="currentColor" fillOpacity={0.25} />
    </motion.div>
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

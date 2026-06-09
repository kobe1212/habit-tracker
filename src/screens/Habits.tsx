import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import { useHabitStore } from "../store/HabitStore";
import { currentStreak } from "../lib/stats";

function frequencyLabel(frequency: "daily" | number[]): string {
  if (frequency === "daily") return "Every day";
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return frequency.map((d) => names[d]).join(", ");
}

export default function Habits() {
  const navigate = useNavigate();
  const { habits, completions } = useHabitStore();

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
          <button
            onClick={() => navigate("/habits/new")}
            className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white text-xl"
          >
            +
          </button>
        </header>

        {/* List */}
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
          <div className="mt-6 flex flex-col gap-3">
            {habits.map((h) => {
              const streak = currentStreak(h, completions);
              return (
                <button
                  key={h.id}
                  onClick={() => navigate(`/habit/${h.id}`)}
                  className="bg-surface rounded-2xl p-4 flex items-center gap-4 text-left"
                >
                  <span
                    className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${h.color}22` }}
                  >
                    {h.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{h.name}</p>
                    <p className="text-xs text-muted mt-0.5">{frequencyLabel(h.frequency)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: h.color }}>
                      🔥 {streak}
                    </p>
                    <p className="text-[10px] text-muted">day streak</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

const habits = [
  { name: "Jogging 5KM", icon: "🏃", schedule: "Every day", streak: 16, color: "#3b82f6" },
  { name: "Drink Water", icon: "💧", schedule: "Every day", streak: 5, color: "#06b6d4" },
  { name: "Read a Book", icon: "📖", schedule: "Mon, Wed, Fri", streak: 12, color: "#8b5cf6" },
  { name: "Meditate", icon: "🧘", schedule: "Every day", streak: 24, color: "#10b981" },
  { name: "Quit Drinking Alcohol", icon: "🚫", schedule: "Every day", streak: 287, color: "#ef4444" },
];

export default function Habits() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Habits</h1>
            <p className="text-sm text-muted mt-1">{habits.length} active habits</p>
          </div>
          <button className="h-10 w-10 rounded-full bg-brand flex items-center justify-center text-white text-xl">
            +
          </button>
        </header>

        {/* List */}
        <div className="mt-6 flex flex-col gap-3">
          {habits.map((h, i) => (
            <button
              key={h.name}
              onClick={() => navigate(`/habit/${i + 1}`)}
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
                <p className="text-xs text-muted mt-0.5">{h.schedule}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: h.color }}>
                  🔥 {h.streak}
                </p>
                <p className="text-[10px] text-muted">day streak</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

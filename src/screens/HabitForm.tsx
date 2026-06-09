import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHabitStore } from "../store/HabitStore";
import type { Frequency } from "../types";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#f97316", "#eab308", "#ec4899"];
const ICONS = ["🏃", "💧", "📖", "🧘", "🏋️", "🥗", "😴", "✍️", "🎯", "🚭", "🎸", "🧹"];
const WEEKDAYS = [
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
  { label: "S", value: 0 },
];

export default function HabitForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getHabit, addHabit, updateHabit, deleteHabit } = useHabitStore();

  const editing = getHabit(id ?? "");

  const [name, setName] = useState(editing?.name ?? "");
  const [color, setColor] = useState(editing?.color ?? COLORS[0]);
  const [icon, setIcon] = useState(editing?.icon ?? ICONS[0]);
  const [isDaily, setIsDaily] = useState(
    editing ? editing.frequency === "daily" : true
  );
  const [days, setDays] = useState<number[]>(
    editing && Array.isArray(editing.frequency) ? editing.frequency : [1, 3, 5]
  );

  const toggleDay = (d: number) =>
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    );

  const canSave = name.trim().length > 0 && (isDaily || days.length > 0);

  const handleSave = () => {
    if (!canSave) return;
    const frequency: Frequency = isDaily ? "daily" : days;
    if (editing) {
      updateHabit(editing.id, { name: name.trim(), color, icon, frequency });
      navigate(`/habit/${editing.id}`);
    } else {
      addHabit({ name: name.trim(), color, icon, frequency });
      navigate("/habits");
    }
  };

  const handleDelete = () => {
    if (editing) {
      deleteHabit(editing.id);
      navigate("/habits");
    }
  };

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">{editing ? "Edit Habit" : "New Habit"}</h1>
          <span className="w-9" />
        </header>

        {/* Preview */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div
            className="h-20 w-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ backgroundColor: `${color}33` }}
          >
            {icon}
          </div>
          <p className="text-muted text-sm">{name.trim() || "Your habit name"}</p>
        </div>

        {/* Name */}
        <label className="block mt-7">
          <span className="text-sm font-semibold">Habit name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Drink 2L of water"
            className="mt-2 w-full bg-surface rounded-2xl px-4 py-3.5 text-fg placeholder:text-muted outline-none focus:ring-2 focus:ring-brand"
          />
        </label>

        {/* Icon */}
        <div className="mt-6">
          <span className="text-sm font-semibold">Icon</span>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={`aspect-square rounded-2xl text-xl flex items-center justify-center ${
                  icon === ic ? "bg-brand" : "bg-surface"
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mt-6">
          <span className="text-sm font-semibold">Color</span>
          <div className="mt-2 flex gap-3 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-9 w-9 rounded-full ${
                  color === c ? "ring-2 ring-fg ring-offset-2 ring-offset-ink" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="mt-6">
          <span className="text-sm font-semibold">Frequency</span>
          <div className="mt-2 bg-surface rounded-2xl p-1 flex">
            <button
              onClick={() => setIsDaily(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${
                isDaily ? "bg-brand text-white" : "text-muted"
              }`}
            >
              Every day
            </button>
            <button
              onClick={() => setIsDaily(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${
                !isDaily ? "bg-brand text-white" : "text-muted"
              }`}
            >
              Specific days
            </button>
          </div>
          {!isDaily && (
            <div className="mt-3 flex justify-between">
              {WEEKDAYS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(d.value)}
                  className={`h-10 w-10 rounded-full text-sm font-semibold ${
                    days.includes(d.value) ? "bg-brand text-white" : "bg-surface text-muted"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="mt-8 w-full bg-brand text-white font-semibold py-4 rounded-2xl disabled:opacity-40"
        >
          {editing ? "Save Changes" : "Create Habit"}
        </button>

        {editing && (
          <button
            onClick={handleDelete}
            className="mt-3 w-full text-red-400 font-semibold py-3"
          >
            Delete Habit
          </button>
        )}
      </div>
    </div>
  );
}

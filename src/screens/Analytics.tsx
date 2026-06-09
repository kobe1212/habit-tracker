import { useState } from "react";
import BottomNav from "../components/BottomNav";
import { useHabitStore } from "../store/HabitStore";
import { dateUtils } from "../lib/dateUtils";
import {
  completionsThisWeek,
  daysActiveThisWeek,
  bestCurrentStreak,
  currentStreak,
  dayProgress,
  isHabitDue,
  isCompleted as isDone,
} from "../lib/stats";

const ranges = ["Week", "Month", "Year"] as const;
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Analytics() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Week");
  const { habits, completions } = useHabitStore();
  const today = dateUtils.today();

  const weekCount = completionsThisWeek(habits, completions, today);
  const activeDays = daysActiveThisWeek(habits, completions, today);
  const bestStreak = bestCurrentStreak(habits, completions, today);

  // Top habit by current streak
  const topHabit = habits
    .map((h) => ({ h, streak: currentStreak(h, completions, today) }))
    .sort((a, b) => b.streak - a.streak)[0];

  const series = buildSeries(range, habits, completions, today);

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-28">
        <header>
          <h1 className="text-2xl font-bold">Your Analytics</h1>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Track your journey, celebrate your wins, and find areas to improve.
          </p>
        </header>

        {/* Range tabs */}
        <div className="mt-5 bg-surface rounded-2xl p-1 flex">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                range === r ? "bg-brand text-white" : "text-muted"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Summary */}
        <h2 className="text-lg font-bold mt-7">Summary</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="row-span-2 bg-brand rounded-3xl p-4 flex flex-col">
            <span className="text-4xl font-extrabold">{weekCount}</span>
            <span className="font-semibold mt-1 leading-tight">Completions this week</span>
            <span className="text-xs text-white/80 mt-2 leading-relaxed">
              Keep showing up — consistency compounds into lasting change.
            </span>
          </div>

          <SummaryStat value={`${activeDays}`} label="Active Days" percent={(activeDays / 7) * 100} />
          <SummaryStat value={`${bestStreak}`} label="Streak Days" percent={Math.min(100, bestStreak * 4)} fire />
        </div>

        {/* Activity chart */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <h3 className="font-semibold">Activity Rate Over Time</h3>
          {series.values.every((v) => v === 0) ? (
            <p className="text-sm text-muted py-10 text-center">No activity yet for this range.</p>
          ) : (
            <LineChart values={series.values} labels={series.labels} />
          )}
        </div>

        {/* Top habit */}
        <div className="mt-4 bg-surface rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Top Habit</h3>
            <p className="text-xs text-muted mt-1">Your strongest streak right now</p>
          </div>
          <div className="text-right">
            {topHabit && topHabit.streak > 0 ? (
              <>
                <p className="text-sm font-semibold">
                  {topHabit.h.icon} {topHabit.h.name}
                </p>
                <p className="text-xs text-brand mt-1">🔥 {topHabit.streak} day streak</p>
              </>
            ) : (
              <p className="text-sm text-muted">No streak yet</p>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function buildSeries(
  range: (typeof ranges)[number],
  habits: Parameters<typeof dayProgress>[0],
  completions: Parameters<typeof dayProgress>[1],
  today: string
): { values: number[]; labels: string[] } {
  if (range === "Week") {
    const values: number[] = [];
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = dateUtils.subtractDays(today, i);
      const { completed, total } = dayProgress(habits, completions, date);
      values.push(total === 0 ? 0 : Math.round((completed / total) * 100));
      labels.push(dateUtils.getShortDayName(dateUtils.getDayOfWeek(date)));
    }
    return { values, labels };
  }

  if (range === "Month") {
    const values: number[] = [];
    const labels: string[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = dateUtils.subtractDays(today, i);
      const { completed, total } = dayProgress(habits, completions, date);
      values.push(total === 0 ? 0 : Math.round((completed / total) * 100));
      const day = dateUtils.parseDate(date).getDate();
      labels.push(i % 6 === 0 ? String(day) : "");
    }
    return { values, labels };
  }

  // Year: trailing 12 months, average completion % across due days
  const values: number[] = [];
  const labels: string[] = [];
  let cursor = dateUtils.getCurrentMonth();
  const seq: { year: number; month: number }[] = [];
  for (let i = 0; i < 12; i++) {
    seq.unshift({ ...cursor });
    cursor = dateUtils.getPreviousMonth(cursor.year, cursor.month);
  }
  for (const { year, month } of seq) {
    let due = 0;
    let done = 0;
    for (const date of dateUtils.getMonthDates(year, month)) {
      if (date > today) break;
      for (const h of habits) {
        if (isHabitDue(h, date)) {
          due++;
          if (isDone(completions, h.id, date)) done++;
        }
      }
    }
    values.push(due === 0 ? 0 : Math.round((done / due) * 100));
    labels.push(MONTHS_SHORT[month]);
  }
  return { values, labels };
}

function SummaryStat({
  value,
  label,
  percent,
  fire = false,
}: {
  value: string;
  label: string;
  percent: number;
  fire?: boolean;
}) {
  const size = 40;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, percent) / 100) * c;
  return (
    <div className="bg-surface rounded-3xl p-4 flex items-center justify-between">
      <div>
        <span className="text-2xl font-extrabold">{value}</span>
        <p className="text-xs text-muted mt-1">
          {fire && "🔥 "}
          {label}
        </p>
      </div>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-brand)" strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
    </div>
  );
}

function LineChart({ values, labels }: { values: number[]; labels: string[] }) {
  const w = 300;
  const h = 120;
  const pad = 8;
  const max = Math.max(...values, 100);
  const stepX = (w - pad * 2) / (values.length - 1);
  const points = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const peakIdx = values.indexOf(Math.max(...values));
  const [px, py] = points[peakIdx];

  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaFill)" />
        <polyline points={line} fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={px} cy={py} r="5" fill="var(--color-brand)" stroke="var(--color-surface)" strokeWidth="3" />
      </svg>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          <span key={i} className="text-[10px] text-muted">{l}</span>
        ))}
      </div>
    </div>
  );
}

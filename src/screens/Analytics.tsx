import { useState } from "react";
import { motion } from "framer-motion";
import ActivityChart, { type ChartPoint } from "../components/ActivityChart";
import CountUp from "../components/CountUp";
import { useHabitStore } from "../store/HabitStore";
import { dateUtils } from "../lib/dateUtils";
import {
  completionCountOnDate,
  isHabitDue,
  isCompleted as isDone,
} from "../lib/stats";
import type { Habit, CompletionData } from "../types";

const ranges = ["Week", "Month", "Year"] as const;
type Range = (typeof ranges)[number];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Analytics {
  chart: ChartPoint[];
  total: number;
  activeDays: number;
  daysElapsed: number;
  consistency: number;
  periodWord: string;
  periodTitle: string;
  topHabit: Habit | null;
  topCount: number;
}

function fullDayLabel(dateStr: string): string {
  const d = dateUtils.parseDate(dateStr);
  return `${dateUtils.getShortDayName(d.getDay())}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function buildAnalytics(
  range: Range,
  habits: Habit[],
  completions: CompletionData,
  today: string
): Analytics {
  const { year, month } = dateUtils.getCurrentMonth();
  const chart: ChartPoint[] = [];
  let metricDates: string[] = [];
  let periodWord = "week";
  let periodTitle = "";

  if (range === "Week") {
    const week = dateUtils.getCurrentWeekDates(); // Mon..Sun
    for (const d of week) {
      chart.push({
        label: dateUtils.getShortDayName(dateUtils.getDayOfWeek(d)),
        fullLabel: fullDayLabel(d),
        value: completionCountOnDate(completions, d),
      });
    }
    metricDates = week.filter((d) => d <= today);
    periodWord = "week";
    const first = dateUtils.parseDate(week[0]);
    const last = dateUtils.parseDate(week[6]);
    periodTitle = `${MONTHS_SHORT[first.getMonth()]} ${first.getDate()} – ${MONTHS_SHORT[last.getMonth()]} ${last.getDate()}`;
  } else if (range === "Month") {
    const dates = dateUtils.getMonthDates(year, month);
    for (const d of dates) {
      chart.push({
        label: String(dateUtils.parseDate(d).getDate()),
        fullLabel: fullDayLabel(d),
        value: completionCountOnDate(completions, d),
      });
    }
    metricDates = dates.filter((d) => d <= today);
    periodWord = "month";
    periodTitle = `${dateUtils.getMonthName(month)} ${year}`;
  } else {
    for (let m = 0; m < 12; m++) {
      const mdates = dateUtils.getMonthDates(year, m);
      const value = mdates.reduce((s, d) => s + completionCountOnDate(completions, d), 0);
      chart.push({ label: MONTHS_SHORT[m], fullLabel: `${MONTHS_SHORT[m]} ${year}`, value });
      metricDates.push(...mdates.filter((d) => d <= today));
    }
    periodWord = "year";
    periodTitle = `${year}`;
  }

  const total = metricDates.reduce((s, d) => s + completionCountOnDate(completions, d), 0);
  const activeDays = metricDates.filter((d) => completionCountOnDate(completions, d) > 0).length;
  const daysElapsed = Math.max(1, metricDates.length);

  let due = 0;
  let done = 0;
  for (const d of metricDates) {
    for (const h of habits) {
      if (isHabitDue(h, d)) {
        due++;
        if (isDone(completions, h.id, d)) done++;
      }
    }
  }
  const consistency = due ? Math.round((done / due) * 100) : 0;

  let topHabit: Habit | null = null;
  let topCount = -1;
  for (const h of habits) {
    let c = 0;
    for (const d of metricDates) if (isDone(completions, h.id, d)) c++;
    if (c > topCount) {
      topCount = c;
      topHabit = h;
    }
  }

  return { chart, total, activeDays, daysElapsed, consistency, periodWord, periodTitle, topHabit, topCount: Math.max(0, topCount) };
}

export default function Analytics() {
  const [range, setRange] = useState<Range>("Week");
  const { habits, completions } = useHabitStore();
  const today = dateUtils.today();

  const a = buildAnalytics(range, habits, completions, today);
  const hasActivity = a.chart.some((p) => p.value > 0);

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
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                range === r ? "text-white" : "text-muted"
              }`}
            >
              {range === r && (
                <motion.span
                  layoutId="rangePill"
                  className="absolute inset-0 rounded-xl bg-brand"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-baseline justify-between mt-7">
          <h2 className="text-lg font-bold">Summary</h2>
          <span className="text-xs text-muted">{a.periodTitle}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="row-span-2 bg-brand rounded-3xl p-4 flex flex-col">
            <CountUp value={a.total} className="text-4xl font-extrabold" />
            <span className="font-semibold mt-1 leading-tight">Completions this {a.periodWord}</span>
            <span className="text-xs text-white/80 mt-2 leading-relaxed">
              Keep showing up — consistency compounds into lasting change.
            </span>
          </div>

          <SummaryStat
            value={a.activeDays}
            label="Active Days"
            detail={`of ${a.daysElapsed} day${a.daysElapsed === 1 ? "" : "s"} so far`}
            percent={(a.activeDays / a.daysElapsed) * 100}
          />
          <SummaryStat
            value={a.consistency}
            suffix="%"
            label="Consistency"
            detail="of scheduled habits done"
            percent={a.consistency}
          />
        </div>

        {/* Activity chart */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Activity Rate Over Time</h3>
            <span className="text-[11px] text-muted">Total Activity</span>
          </div>
          {hasActivity ? (
            <ActivityChart key={range} points={a.chart} />
          ) : (
            <p className="text-sm text-muted py-10 text-center">No activity yet for this {a.periodWord}.</p>
          )}
        </div>

        {/* Top habit */}
        <div className="mt-4 bg-surface rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Top Habit</h3>
            <p className="text-xs text-muted mt-1">Most completed this {a.periodWord}</p>
          </div>
          <div className="text-right">
            {a.topHabit && a.topCount > 0 ? (
              <>
                <p className="text-sm font-semibold">
                  {a.topHabit.icon} {a.topHabit.name}
                </p>
                <p className="text-xs text-brand mt-1">
                  {a.topCount} completion{a.topCount === 1 ? "" : "s"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">No completions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({
  value,
  suffix = "",
  label,
  detail,
  percent,
}: {
  value: number;
  suffix?: string;
  label: string;
  detail?: string;
  percent: number;
}) {
  const size = 40;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, percent)) / 100) * c;
  return (
    <div className="bg-surface rounded-3xl p-4 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <CountUp value={value} suffix={suffix} className="text-2xl font-extrabold" />
        <p className="text-xs text-muted mt-1">{label}</p>
        {detail && <p className="text-[10px] text-muted/80 mt-0.5 leading-tight">{detail}</p>}
      </div>
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeLinecap="round"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

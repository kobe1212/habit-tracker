import { useState } from "react";
import BottomNav from "../components/BottomNav";

const ranges = ["Week", "Month", "Year"] as const;

// Mock activity rate over the week (percent values)
const activity = [40, 62, 48, 75, 58, 70, 66];
const activityLabels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export default function Analytics() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Week");

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-28">
        {/* Header */}
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
          {/* Big highlight card */}
          <div className="row-span-2 bg-brand rounded-3xl p-4 flex flex-col">
            <span className="text-4xl font-extrabold">8</span>
            <span className="font-semibold mt-1 leading-tight">
              Affirmation Completed this week
            </span>
            <span className="text-xs text-white/80 mt-2 leading-relaxed">
              Your affirmations have boosted your completion rate by 12% this
              week!
            </span>
          </div>

          <SummaryStat value="16" label="Days Active" percent={66} />
          <SummaryStat value="24" label="Streaks Days" percent={80} fire />
        </div>

        {/* Activity chart */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <h3 className="font-semibold">Activity Rate Over Time</h3>
          <LineChart values={activity} labels={activityLabels} />
        </div>

        {/* Distraction */}
        <div className="mt-4 bg-surface rounded-3xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Distraction</h3>
            <p className="text-xs text-muted mt-1">Most time lost to apps</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Social Media</p>
            <p className="text-xs text-brand mt-1">1h 48m today</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
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
  const offset = c - (percent / 100) * c;
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
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#3a3a3c" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
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
        <polyline
          points={line}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={px} cy={py} r="5" fill="var(--color-brand)" stroke="#1c1c1e" strokeWidth="3" />
      </svg>
      <div className="flex justify-between mt-2">
        {labels.map((l) => (
          <span key={l} className="text-[10px] text-muted">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

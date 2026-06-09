import { useState } from "react";

export interface ChartPoint {
  label: string;
  fullLabel: string;
  value: number;
}

/** Generate up to 5 evenly-spaced integer y-axis ticks. */
function makeTicks(max: number): number[] {
  const m = Math.max(1, Math.ceil(max));
  if (m <= 4) return Array.from({ length: m + 1 }, (_, i) => i);
  const step = Math.ceil(m / 4);
  return [0, step, step * 2, step * 3, step * 4];
}

const W = 320;
const H = 175;
const PAD_L = 24;
const PAD_R = 10;
const PAD_T = 14;
const PAD_B = 22;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

export default function ActivityChart({ points }: { points: ChartPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const maxVal = Math.max(...points.map((p) => p.value), 0);
  const ticks = makeTicks(maxVal);
  const niceMax = ticks[ticks.length - 1];

  const n = points.length;
  const stepX = n > 1 ? PLOT_W / (n - 1) : 0;
  const xAt = (i: number) => PAD_L + i * stepX;
  const yAt = (v: number) => PAD_T + PLOT_H - (v / niceMax) * PLOT_H;

  const linePts = points.map((p, i) => `${xAt(i)},${yAt(p.value)}`).join(" ");
  const areaPts = `${xAt(0)},${PAD_T + PLOT_H} ${linePts} ${xAt(n - 1)},${PAD_T + PLOT_H}`;

  const labelEvery = n <= 8 ? 1 : Math.ceil(n / 7);

  const updateHoverFromX = (clientX: number, rect: DOMRect) => {
    const vbX = ((clientX - rect.left) / rect.width) * W;
    let i = Math.round((vbX - PAD_L) / (stepX || 1));
    i = Math.max(0, Math.min(n - 1, i));
    setHover(i);
  };

  return (
    <div
      className="relative mt-3 select-none"
      onMouseMove={(e) => updateHoverFromX(e.clientX, e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => setHover(null)}
      onTouchStart={(e) => updateHoverFromX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
      onTouchMove={(e) => updateHoverFromX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
      onTouchEnd={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block">
        <defs>
          <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis gridlines + numeric labels (Total Activity) */}
        {ticks.map((t) => {
          const y = yAt(t);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-line)" strokeWidth="1" />
              <text x={PAD_L - 5} y={y + 3} textAnchor="end" fontSize="8" fill="var(--color-muted)">
                {t}
              </text>
            </g>
          );
        })}

        <polygon points={areaPts} fill="url(#activityFill)" />
        <polyline
          points={linePts}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover guide line + active dot */}
        {hover !== null && (
          <>
            <line
              x1={xAt(hover)}
              y1={PAD_T}
              x2={xAt(hover)}
              y2={PAD_T + PLOT_H}
              stroke="var(--color-brand)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={xAt(hover)}
              cy={yAt(points[hover].value)}
              r="4.5"
              fill="var(--color-brand)"
              stroke="var(--color-surface)"
              strokeWidth="2.5"
            />
          </>
        )}

        {/* X-axis labels */}
        {points.map((p, i) =>
          (i % labelEvery === 0 || i === n - 1) && p.label ? (
            <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="var(--color-muted)">
              {p.label}
            </text>
          ) : null
        )}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none bg-surface-2 text-fg rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap"
          style={{
            left: `${(xAt(hover) / W) * 100}%`,
            top: `${(yAt(points[hover].value) / H) * 100}%`,
            marginTop: "-6px",
          }}
        >
          <div className="text-sm font-bold leading-none">
            {points[hover].value} <span className="text-muted font-normal text-[11px]">done</span>
          </div>
          <div className="text-[10px] text-muted mt-0.5">{points[hover].fullLabel}</div>
        </div>
      )}
    </div>
  );
}

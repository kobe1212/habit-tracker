import { useState } from "react";
import { motion } from "framer-motion";
import { makeTicks } from "../lib/chart";

export interface YearBar {
  label: string;
  fullLabel: string;
  value: number;
  year: number;
  month: number;
}

const W = 320;
const H = 170;
const PAD_L = 24;
const PAD_R = 8;
const PAD_T = 14;
const PAD_B = 20;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

interface YearBarChartProps {
  bars: YearBar[];
  selected?: { year: number; month: number };
  onSelectMonth?: (bar: YearBar) => void;
}

/**
 * Animated, interactive bar chart: numeric y-axis, hover/touch tooltip with
 * the exact value, and clickable bars to jump the calendar to that month.
 */
export default function YearBarChart({ bars, selected, onSelectMonth }: YearBarChartProps) {
  const [hover, setHover] = useState<number | null>(null);

  const maxVal = Math.max(...bars.map((b) => b.value), 0);
  const ticks = makeTicks(maxVal);
  const niceMax = ticks[ticks.length - 1];

  const n = bars.length;
  const slot = PLOT_W / n;
  const barW = slot * 0.55;
  const xAt = (i: number) => PAD_L + i * slot + (slot - barW) / 2;
  const hAt = (v: number) => (v / niceMax) * PLOT_H;
  const baseY = PAD_T + PLOT_H;

  const idxFromX = (clientX: number, rect: DOMRect) => {
    const vbX = ((clientX - rect.left) / rect.width) * W;
    let i = Math.floor((vbX - PAD_L) / slot);
    return Math.max(0, Math.min(n - 1, i));
  };

  return (
    <div
      className="relative mt-3 select-none"
      onMouseMove={(e) => setHover(idxFromX(e.clientX, e.currentTarget.getBoundingClientRect()))}
      onMouseLeave={() => setHover(null)}
      onTouchStart={(e) => setHover(idxFromX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect()))}
      onTouchMove={(e) => setHover(idxFromX(e.touches[0].clientX, e.currentTarget.getBoundingClientRect()))}
      onClick={(e) => {
        const i = idxFromX(e.clientX, e.currentTarget.getBoundingClientRect());
        onSelectMonth?.(bars[i]);
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full block cursor-pointer">
        {/* Y-axis gridlines + numeric labels */}
        {ticks.map((t) => {
          const y = baseY - hAt(t);
          return (
            <g key={t}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-line)" strokeWidth="1" />
              <text x={PAD_L - 5} y={y + 3} textAnchor="end" fontSize="8" fill="var(--color-muted)">
                {t}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((b, i) => {
          const h = hAt(b.value);
          const isSelected =
            selected && b.year === selected.year && b.month === selected.month;
          const isHover = hover === i;
          return (
            <motion.rect
              key={`${b.year}-${b.month}`}
              x={xAt(i)}
              width={barW}
              rx={3}
              fill="var(--color-brand)"
              opacity={isSelected ? 1 : isHover ? 0.8 : 0.45}
              initial={{ height: 0, y: baseY }}
              animate={{ height: Math.max(h, b.value > 0 ? 2 : 0), y: baseY - Math.max(h, b.value > 0 ? 2 : 0) }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: "easeOut" }}
            />
          );
        })}

        {/* X-axis labels */}
        {bars.map((b, i) => (
          <text
            key={`l-${i}`}
            x={xAt(i) + barW / 2}
            y={H - 6}
            textAnchor="middle"
            fontSize="7.5"
            fill={
              selected && b.year === selected.year && b.month === selected.month
                ? "var(--color-brand)"
                : "var(--color-muted)"
            }
          >
            {b.label}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none bg-surface-2 text-fg rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap z-10"
          style={{
            left: `${((xAt(hover) + barW / 2) / W) * 100}%`,
            top: `${((baseY - hAt(bars[hover].value)) / H) * 100}%`,
            marginTop: "-6px",
          }}
        >
          <div className="text-sm font-bold leading-none">
            {bars[hover].value} <span className="text-muted font-normal text-[11px]">done</span>
          </div>
          <div className="text-[10px] text-muted mt-0.5">{bars[hover].fullLabel} — tap to view</div>
        </div>
      )}
    </div>
  );
}

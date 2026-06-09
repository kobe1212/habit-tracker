interface ProgressRingProps {
  completed: number;
  total: number;
  size?: number;
  ticks?: number;
}

/**
 * Segmented "ticked" circular progress dial inspired by the reference design.
 * Renders `ticks` small radial bars around a circle; the first `percent`
 * portion is highlighted in brand blue, the rest in dark gray.
 */
export default function ProgressRing({
  completed,
  total,
  size = 220,
  ticks = 60,
}: ProgressRingProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activeTicks = Math.round((percent / 100) * ticks);

  const center = size / 2;
  const outerRadius = center - 6;
  const innerRadius = outerRadius - 18;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        {Array.from({ length: ticks }).map((_, i) => {
          // Start at the top (-90deg) and go clockwise
          const angle = (i / ticks) * 2 * Math.PI - Math.PI / 2;
          const x1 = center + innerRadius * Math.cos(angle);
          const y1 = center + innerRadius * Math.sin(angle);
          const x2 = center + outerRadius * Math.cos(angle);
          const y2 = center + outerRadius * Math.sin(angle);
          const active = i < activeTicks;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={active ? "var(--color-brand)" : "#2c2c2e"}
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm text-muted">
          {completed}/{total}
        </span>
        <span className="text-5xl font-bold text-white leading-none mt-1">
          {percent}%
        </span>
        <span className="text-xs text-muted mt-2">Task Completed</span>
      </div>
    </div>
  );
}

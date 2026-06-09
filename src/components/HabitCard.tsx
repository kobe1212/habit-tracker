interface HabitCardProps {
  name: string;
  status: string;
  completed: number;
  total: number;
  icon: string;
  highlight?: boolean;
}

export default function HabitCard({
  name,
  status,
  completed,
  total,
  icon,
  highlight = false,
}: HabitCardProps) {
  const percent = total > 0 ? Math.min(100, (completed / total) * 100) : 0;

  return (
    <div
      className={`shrink-0 w-40 rounded-3xl p-4 flex flex-col gap-6 ${
        highlight ? "bg-brand-deep" : "bg-surface"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`h-11 w-11 rounded-2xl flex items-center justify-center text-xl ${
            highlight ? "bg-white/20" : "bg-surface-2"
          }`}
        >
          {icon}
        </div>
        <MiniRing percent={percent} highlight={highlight} label={`${completed}/${total}`} />
      </div>
      <div>
        <p className="text-white font-semibold leading-tight">{name}</p>
        <p
          className={`text-xs mt-1 ${
            highlight ? "text-white/80" : "text-muted"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

function MiniRing({
  percent,
  highlight,
  label,
}: {
  percent: number;
  highlight: boolean;
  label: string;
}) {
  const size = 44;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={highlight ? "rgba(255,255,255,0.25)" : "#3a3a3c"}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={highlight ? "#ffffff" : "var(--color-brand)"}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white">
        {label}
      </span>
    </div>
  );
}

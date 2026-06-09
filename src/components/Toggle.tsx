interface ToggleProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

export default function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        on ? "bg-brand" : "bg-surface-2"
      }`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

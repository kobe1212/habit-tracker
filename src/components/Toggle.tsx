interface ToggleProps {
  on: boolean;
  onChange: (on: boolean) => void;
}

export default function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`flex items-center h-7 w-12 rounded-full p-1 transition-colors ${
        on ? "bg-brand" : "bg-surface-2"
      }`}
      role="switch"
      aria-checked={on}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

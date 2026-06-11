import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface ScreenHeaderProps {
  title: string;
  /** Where the back button goes. Defaults to the previous page. */
  onBack?: () => void;
  /** Optional control rendered on the right (e.g. an Edit button). */
  right?: ReactNode;
}

/** Shared top bar: back button + centered title + optional right slot. */
export default function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between">
      <button
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="Go back"
        className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted shrink-0"
      >
        <ChevronLeft size={18} />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
      <div className="min-w-9 flex justify-end">{right}</div>
    </header>
  );
}

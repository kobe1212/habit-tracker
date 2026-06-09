import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

// Mock year-to-date progress (Jan -> next Jan)
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const yearData = [8, 14, 11, 16, 9, 19, 13, 17, 12, 20, 15, 18, 10];

// October 2023 starts on a Sunday; calendar header is Mon-Sun
const SUCCESS_DAYS = [2, 7, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30];
const SKIPPED_DAYS = [4, 9, 23];
const LEADING_BLANKS = 6; // Mon..Sat before Sun Oct 1
const DAYS_IN_MONTH = 31;

export default function HabitDetail() {
  const navigate = useNavigate();
  const maxBar = Math.max(...yearData);

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Habit Detail</h1>
          <span className="w-9" />
        </header>

        {/* Title row */}
        <div className="flex items-start justify-between mt-6">
          <div>
            <h2 className="text-xl font-bold leading-tight">Quit Drinking Alcohol Habit</h2>
            <p className="text-sm text-brand mt-1">Start from Jan 20, 2023</p>
          </div>
          <button className="bg-surface text-sm font-semibold px-4 py-2 rounded-xl shrink-0">
            Edit
          </button>
        </div>

        {/* Year to date progress */}
        <div className="mt-6 bg-surface rounded-3xl p-4">
          <h3 className="font-semibold">Year to Date Progress</h3>
          <div className="mt-4 flex items-end justify-between gap-1 h-36">
            {yearData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full rounded-md bg-brand"
                  style={{ height: `${(v / maxBar) * 100}%` }}
                />
                <span className="text-[8px] text-muted">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly calendar */}
        <div className="mt-4 bg-surface rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <button className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-semibold">October, 2023</span>
            <button className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="rotate-180">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 mt-4 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <span key={d} className="text-center text-[11px] text-muted">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-2">
            {Array.from({ length: LEADING_BLANKS }).map((_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => {
              const day = i + 1;
              const success = SUCCESS_DAYS.includes(day);
              const skipped = SKIPPED_DAYS.includes(day);
              return (
                <div key={day} className="flex justify-center">
                  <span
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      success
                        ? "bg-brand text-white"
                        : skipped
                        ? "bg-surface-2 text-muted"
                        : "text-white/80"
                    }`}
                  >
                    {day.toString().padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-5">
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 rounded-full bg-brand" /> Success Day
            </span>
            <span className="flex items-center gap-2 text-xs text-muted">
              <span className="h-3 w-3 rounded-full bg-surface-2" /> Skipped Day
            </span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

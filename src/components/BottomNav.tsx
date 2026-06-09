import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { key: "home", label: "Home", path: "/", icon: HomeIcon },
  { key: "analytics", label: "Analytics", path: "/analytics", icon: AnalyticsIcon },
  { key: "habits", label: "Habits", path: "/habits", icon: HabitsIcon },
  { key: "profile", label: "Profile", path: "/profile", icon: ProfileIcon },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActive = (key: string) => {
    if (key === "home") return pathname === "/";
    if (key === "habits") return pathname.startsWith("/habit");
    return pathname.startsWith(`/${key}`);
  };

  return (
    <nav className="absolute bottom-0 inset-x-0 bg-ink/95 backdrop-blur border-t border-line px-6 pt-3 pb-6">
      <ul className="flex items-center justify-between">
        {items.map(({ key, label, path, icon: Icon }) => {
          const active = isActive(key);
          return (
            <li key={key}>
              <button
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1 w-14"
              >
                <Icon className={active ? "text-brand" : "text-muted"} />
                <span
                  className={`text-[11px] font-medium ${
                    active ? "text-brand" : "text-muted"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface IconProps {
  className?: string;
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsIcon({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 20V10M10 20V4M16 20v-7M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HabitsIcon({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 2v4M16 2v4M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m9 14 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ className }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import Toggle from "../components/Toggle";
import Avatar from "../components/Avatar";
import { useHabitStore } from "../store/HabitStore";
import { useTheme } from "../store/ThemeProvider";
import { useProfile } from "../store/ProfileStore";
import { bestCurrentStreak, totalCompletions } from "../lib/stats";

export default function Profile() {
  const navigate = useNavigate();
  const { habits, completions, resetData } = useHabitStore();
  const { isDark, setTheme } = useTheme();
  const { profile, updateProfile } = useProfile();

  const dayStreak = bestCurrentStreak(habits, completions);
  const habitsDone = totalCompletions(completions);
  const activeGoals = habits.length;

  const handleReset = () => {
    if (confirm("Reset all data back to the sample habits? This cannot be undone.")) {
      resetData();
      navigate("/");
    }
  };

  const handleNotifications = async (on: boolean) => {
    if (!on) {
      updateProfile({ notifications: false });
      return;
    }
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission === "granted") {
      updateProfile({ notifications: true });
      const pendingToday = habits.length; // simple nudge
      new Notification("Habit Tracker", {
        body: pendingToday
          ? "Reminders are on — we'll nudge you about your habits!"
          : "Reminders are on!",
      });
    } else {
      updateProfile({ notifications: false });
      alert("Notifications are blocked. Please enable them in your browser settings.");
    }
  };

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Profile</h1>
          <span className="w-9" />
        </header>

        {/* User card */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="mt-6 w-full bg-surface rounded-3xl p-4 flex items-center gap-4"
        >
          <Avatar avatar={profile.avatar} size={56} />
          <div className="text-left flex-1">
            <p className="font-bold text-lg leading-tight">{profile.name}</p>
            <p className="text-sm text-muted">Tap to edit your profile</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted rotate-180">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Stats row */}
        <div className="mt-3 bg-surface rounded-3xl p-4 flex">
          <Stat value={`${dayStreak}`} label="Day Streak" />
          <Divider />
          <Stat value={`${habitsDone}`} label="Habits Done" />
          <Divider />
          <Stat value={`${activeGoals}`} label="Active Goals" />
        </div>

        {/* Account */}
        <Section title="Account">
          <Row icon={<PersonIcon />} label="Edit Profile" chevron onClick={() => navigate("/profile/edit")} />
          <Row
            icon={<BellIcon />}
            label="Notifications"
            control={<Toggle on={profile.notifications} onChange={handleNotifications} />}
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <Row
            icon={<SunIcon />}
            label="Dark Mode"
            control={
              <Toggle on={isDark} onChange={(on) => setTheme(on ? "dark" : "light")} />
            }
          />
        </Section>

        {/* Support */}
        <Section title="Support">
          <Row icon={<HelpIcon />} label="Help Center" chevron />
          <Row icon={<StarIcon />} label="Rate the App" chevron />
          <button onClick={handleReset} className="w-full flex items-center gap-3 px-4 py-4 text-left">
            <span className="h-9 w-9 rounded-xl bg-surface-2 flex items-center justify-center text-red-400">
              <ResetIcon />
            </span>
            <span className="flex-1 font-medium text-red-400">Reset Demo Data</span>
          </button>
        </Section>
      </div>

      <BottomNav />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}

function Divider() {
  return <span className="w-px bg-line my-1" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="bg-surface rounded-3xl divide-y divide-line">{children}</div>
    </div>
  );
}

function Row({
  icon,
  label,
  chevron,
  control,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  chevron?: boolean;
  control?: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="h-9 w-9 rounded-xl bg-surface-2 flex items-center justify-center text-fg">
        {icon}
      </span>
      <span className="flex-1 font-medium text-left">{label}</span>
      {control}
      {chevron && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted rotate-180">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-4">
        {content}
      </button>
    );
  }
  return <div className="flex items-center gap-3 px-4 py-4">{content}</div>;
}

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20c0-3.3 3.1-5 7-5s7 1.7 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 10a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v3.5H7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

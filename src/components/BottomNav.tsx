import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart2, CalendarCheck, User } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

const tabs = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
  { title: "Habits", icon: CalendarCheck, path: "/habits" },
  { title: "Profile", icon: User, path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Hidden on full-screen form/edit pages.
  if (pathname.endsWith("/new") || pathname.endsWith("/edit")) return null;

  const activeIndex = (() => {
    if (pathname === "/") return 0;
    if (pathname.startsWith("/analytics")) return 1;
    if (pathname.startsWith("/habit")) return 2; // /habits and /habit/:id
    if (pathname.startsWith("/profile")) return 3;
    return null;
  })();

  return (
    <div className="absolute bottom-0 inset-x-0 px-4 pt-6 pb-6 bg-gradient-to-t from-ink via-ink/90 to-transparent">
      <ExpandableTabs
        tabs={tabs}
        className="w-full justify-between"
        activeColor="text-brand"
        selected={activeIndex}
        onChange={(index) => {
          if (index !== null) navigate(tabs[index].path);
        }}
      />
    </div>
  );
}

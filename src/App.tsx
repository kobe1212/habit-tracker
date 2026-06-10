import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import PhoneFrame from "./components/PhoneFrame";
import BottomNav from "./components/BottomNav";
import { HabitStoreProvider } from "./store/HabitStore";
import { ThemeProvider } from "./store/ThemeProvider";
import { ProfileProvider } from "./store/ProfileStore";
import Home from "./screens/Home";
import Analytics from "./screens/Analytics";
import Habits from "./screens/Habits";
import HabitDetail from "./screens/HabitDetail";
import HabitForm from "./screens/HabitForm";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";

/** Animated page wrapper: fade + slide on every route change. */
function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/analytics" element={<Page><Analytics /></Page>} />
        <Route path="/habits" element={<Page><Habits /></Page>} />
        <Route path="/habits/new" element={<Page><HabitForm /></Page>} />
        <Route path="/habit/:id" element={<Page><HabitDetail /></Page>} />
        <Route path="/habit/:id/edit" element={<Page><HabitForm /></Page>} />
        <Route path="/profile" element={<Page><Profile /></Page>} />
        <Route path="/profile/edit" element={<Page><EditProfile /></Page>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <HabitStoreProvider>
          <BrowserRouter>
            <PhoneFrame>
              <AnimatedRoutes />
              <BottomNav />
            </PhoneFrame>
          </BrowserRouter>
        </HabitStoreProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;

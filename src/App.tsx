import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <HabitStoreProvider>
          <BrowserRouter>
            <PhoneFrame>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/habits" element={<Habits />} />
                <Route path="/habits/new" element={<HabitForm />} />
                <Route path="/habit/:id" element={<HabitDetail />} />
                <Route path="/habit/:id/edit" element={<HabitForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNav />
            </PhoneFrame>
          </BrowserRouter>
        </HabitStoreProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;

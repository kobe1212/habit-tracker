import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import { HabitStoreProvider } from "./store/HabitStore";
import { ThemeProvider } from "./store/ThemeProvider";
import Home from "./screens/Home";
import Analytics from "./screens/Analytics";
import Habits from "./screens/Habits";
import HabitDetail from "./screens/HabitDetail";
import HabitForm from "./screens/HabitForm";
import Profile from "./screens/Profile";

function App() {
  return (
    <ThemeProvider>
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </PhoneFrame>
        </BrowserRouter>
      </HabitStoreProvider>
    </ThemeProvider>
  );
}

export default App;

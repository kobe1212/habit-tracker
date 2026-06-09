import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import Home from "./screens/Home";
import Analytics from "./screens/Analytics";
import Habits from "./screens/Habits";
import HabitDetail from "./screens/HabitDetail";
import Profile from "./screens/Profile";

function App() {
  return (
    <BrowserRouter>
      <PhoneFrame>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/habit/:id" element={<HabitDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PhoneFrame>
    </BrowserRouter>
  );
}

export default App;

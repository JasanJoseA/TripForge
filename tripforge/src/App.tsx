import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/layout/NavBar";
import Landing from "./pages/Landing";
import Plan from "./pages/Plan";
import Saved from "./pages/Saved";
import Ratings from "./pages/Ratings";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

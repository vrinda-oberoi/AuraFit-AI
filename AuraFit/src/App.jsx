import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetup from "./pages/Profilesetup";
import Dashboard from "./pages/Dashboard";
import WardrobeGallery from "./pages/WardrobeGallery";
import GenerateOutfit from "./pages/GenerateOutfit";
import OutfitPreview from "./pages/OutfitPreview";
import AddItem from "./pages/AddItem";

import OutfitHistory from "./pages/OutfitHistory";
import WeeklyPlanner from "./pages/WeeklyPlanner";

import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function ProfileSetupRoute() {
  const navigate = useNavigate();

  return <ProfileSetup onBackToLogin={() => navigate(-1)} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Onboarding step — collects body/style details, distinct from the
            account Profile page below. */}
        <Route path="/profile-setup" element={<ProfileSetupRoute />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wardrobe" element={<WardrobeGallery />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/edit-item/:id" element={<AddItem />} />

        <Route path="/generate-outfit" element={<GenerateOutfit />} />
        <Route path="/outfit-preview" element={<OutfitPreview />} />

        <Route path="/outfit-history" element={<OutfitHistory />} />
        <Route path="/weekly-planner" element={<WeeklyPlanner />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
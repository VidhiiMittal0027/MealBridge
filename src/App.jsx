import SupabaseTest from "./pages/SupabaseTest";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import FoodDonation from "./pages/FoodDonation";
import FoodAssessment from "./pages/FoodAssessment";
import NGOMatching from "./pages/NGOMatching";
import DeliveryTracking from "./pages/DeliveryTracking";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import ImpactDashboard from "./pages/ImpactDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/supabase-test"
        element={<SupabaseTest />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/donate-food" element={<FoodDonation />} />
      <Route
        path="/food-assessment"
        element={<FoodAssessment />}
      />
      <Route
        path="/ngo-matching"
        element={<NGOMatching />}
      />
      <Route
        path="/delivery-tracking"
        element={<DeliveryTracking />}
      />
      <Route
        path="/donor-dashboard"
        element={<DonorDashboard />}
      />
      <Route
        path="/ngo-dashboard"
        element={<NGODashboard />}
      />
      <Route
        path="/impact-dashboard"
        element={<ImpactDashboard />}
      />
    </Routes>
  );
}
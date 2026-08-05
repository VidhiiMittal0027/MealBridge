import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SupabaseTest from "./pages/SupabaseTest";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import FoodDonation from "./pages/FoodDonation";
import FoodAssessment from "./pages/FoodAssessment";
import NGOMatching from "./pages/NGOMatching";
import DonorDashboard from "./pages/DonorDashboard";
import ImpactDashboard from "./pages/ImpactDashboard";
import ReceiverPage from "./pages/ReceiverPage";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { Show, RedirectToSignIn, useUser } from '@clerk/react'
import { MealBridgeContext, MealBridgeProvider } from "./context/MealBridgeContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useUser();
  const { showToast } = useContext(MealBridgeContext);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      const activeRole = user.unsafeMetadata?.role || sessionStorage.getItem("mealbridge-role");
      setRole(activeRole);
      setLoading(false);
    } else {
      const activeRole = sessionStorage.getItem("mealbridge-role");
      setRole(activeRole);
      setLoading(false);
    }
  }, [user]);

  if (loading) return null;

  const userHasAccess = !allowedRole || role === allowedRole;

  return (
    <>
      <Show when="signed-in">
        {userHasAccess ? (
          children
        ) : (
          <ProtectedRouteRedirect role={role} allowedRole={allowedRole} showToast={showToast} />
        )}
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}

function ProtectedRouteRedirect({ role, allowedRole, showToast }) {
  useEffect(() => {
    if (role === "donor" && allowedRole === "receiver") {
      showToast("You are signed in as a Donor. Please switch accounts to access the Receiver Portal.", "warning");
    } else if (role === "receiver" && allowedRole === "donor") {
      showToast("You are signed in as a Receiver. Please switch accounts to access the Donor Portal.", "warning");
    }
  }, [role, allowedRole, showToast]);

  const targetPath = role === "donor" ? "/donor-dashboard" : role === "receiver" ? "/receiver-dashboard" : "/delivery-dashboard";
  return <Navigate to={targetPath} replace />;
}

export default function App() {
  return (
    <MealBridgeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/supabase-test" element={<SupabaseTest />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        
        {/* Protected general routes */}
        <Route path="/select-role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
        <Route path="/impact-dashboard" element={<ProtectedRoute><ImpactDashboard /></ProtectedRoute>} />
        
        {/* Donor protected routes */}
        <Route path="/donate-food" element={<ProtectedRoute allowedRole="donor"><FoodDonation /></ProtectedRoute>} />
        <Route path="/food-assessment" element={<ProtectedRoute allowedRole="donor"><FoodAssessment /></ProtectedRoute>} />
        <Route path="/donor-dashboard" element={<ProtectedRoute allowedRole="donor"><DonorDashboard /></ProtectedRoute>} />
        
        {/* Receiver public and protected routes */}
        <Route path="/receiver" element={<ReceiverPage />} />
        <Route path="/ngo-matching" element={<ProtectedRoute allowedRole="receiver"><NGOMatching /></ProtectedRoute>} />
        <Route path="/ngo-dashboard" element={<ProtectedRoute allowedRole="receiver"><ReceiverPage /></ProtectedRoute>} />
        <Route path="/receiver-dashboard" element={<ProtectedRoute allowedRole="receiver"><ReceiverPage /></ProtectedRoute>} />
        
        {/* Delivery protected routes */}
        <Route path="/delivery-tracking" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard /></ProtectedRoute>} />
        <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRole="delivery"><DeliveryDashboard /></ProtectedRoute>} />

        {/* Public static pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MealBridgeProvider>
  );
}

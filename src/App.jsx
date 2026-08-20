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
import DonorOverview from "./pages/donor/Overview";
import DonorListings from "./pages/donor/Listings";
import DonorRequests from "./pages/donor/Requests";
import DonorHistory from "./pages/donor/History";
import DonorDelivery from "./pages/donor/Delivery";
import DonorNotifications from "./pages/donor/Notifications";
import DonorTrust from "./pages/donor/Trust";
import DonorProfile from "./pages/donor/Profile";
import DonorSupport from "./pages/donor/Support";

import ImpactDashboard from "./pages/ImpactDashboard";
import ReceiverPage from "./pages/ReceiverPage";
import ReceiverOverview from "./pages/receiver/Overview";
import ReceiverBrowse from "./pages/receiver/Browse";
import ReceiverRequests from "./pages/receiver/Requests";
import ReceiverHistory from "./pages/receiver/History";
import ReceiverDelivery from "./pages/receiver/Delivery";
import ReceiverNotifications from "./pages/receiver/Notifications";
import ReceiverProfile from "./pages/receiver/Profile";
import ReceiverImpact from "./pages/receiver/Impact";
import ReceiverSupport from "./pages/receiver/Support";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOverview from "./pages/admin/Overview";
import AdminNGOVerifications from "./pages/admin/NGOVerifications";
import AdminDonorVerifications from "./pages/admin/DonorVerifications";
import AdminDonations from "./pages/admin/Donations";
import AdminOrdersDisputes from "./pages/admin/OrdersDisputes";
import AdminDeliveryAgents from "./pages/admin/DeliveryAgents";
import AdminFlaggedUsers from "./pages/admin/FlaggedUsers";
import AdminReportsAnalytics from "./pages/admin/ReportsAnalytics";
import AdminSettings from "./pages/admin/Settings";

import DeliveryDashboard from "./pages/DeliveryDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

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
      if (activeRole) {
        sessionStorage.setItem("mealbridge-role", activeRole);
      }
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
    } else if (allowedRole === "admin" && role !== "admin") {
      showToast("Administrator privileges required to access this portal.", "warning");
    }
  }, [role, allowedRole, showToast]);

  const targetPath = role === "admin"
    ? "/admin"
    : role === "donor" 
      ? "/donor-dashboard" 
      : role === "receiver" 
        ? "/receiver-dashboard" 
        : role === "delivery" 
          ? "/delivery-dashboard" 
          : "/select-role";
  return <Navigate to={targetPath} replace />;
}

export default function App() {
  return (
    <MealBridgeProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/supabase-test" element={<SupabaseTest />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          
          {/* Protected general routes */}
          <Route path="/select-role" element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} />
          <Route path="/impact-dashboard" element={<ProtectedRoute><ImpactDashboard /></ProtectedRoute>} />
          
          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/overview" element={<ProtectedRoute allowedRole="admin"><AdminOverview /></ProtectedRoute>} />
          <Route path="/admin/verifications-ngo" element={<ProtectedRoute allowedRole="admin"><AdminNGOVerifications /></ProtectedRoute>} />
          <Route path="/admin/verifications-donor" element={<ProtectedRoute allowedRole="admin"><AdminDonorVerifications /></ProtectedRoute>} />
          <Route path="/admin/donations" element={<ProtectedRoute allowedRole="admin"><AdminDonations /></ProtectedRoute>} />
          <Route path="/admin/orders-disputes" element={<ProtectedRoute allowedRole="admin"><AdminOrdersDisputes /></ProtectedRoute>} />
          <Route path="/admin/delivery-agents" element={<ProtectedRoute allowedRole="admin"><AdminDeliveryAgents /></ProtectedRoute>} />
          <Route path="/admin/flagged-users" element={<ProtectedRoute allowedRole="admin"><AdminFlaggedUsers /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><AdminReportsAnalytics /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>} />

          {/* Donor protected routes */}
          <Route path="/donate-food" element={<ProtectedRoute allowedRole="donor"><FoodDonation /></ProtectedRoute>} />
          <Route path="/food-assessment" element={<ProtectedRoute allowedRole="donor"><FoodAssessment /></ProtectedRoute>} />
          
          <Route path="/donor-dashboard" element={<ProtectedRoute allowedRole="donor"><DonorOverview /></ProtectedRoute>} />
          <Route path="/donor-dashboard/listings" element={<ProtectedRoute allowedRole="donor"><DonorListings /></ProtectedRoute>} />
          <Route path="/donor-dashboard/requests" element={<ProtectedRoute allowedRole="donor"><DonorRequests /></ProtectedRoute>} />
          <Route path="/donor-dashboard/history" element={<ProtectedRoute allowedRole="donor"><DonorHistory /></ProtectedRoute>} />
          <Route path="/donor-dashboard/delivery" element={<ProtectedRoute allowedRole="donor"><DonorDelivery /></ProtectedRoute>} />
          <Route path="/donor-dashboard/notifications" element={<ProtectedRoute allowedRole="donor"><DonorNotifications /></ProtectedRoute>} />
          <Route path="/donor-dashboard/trust" element={<ProtectedRoute allowedRole="donor"><DonorTrust /></ProtectedRoute>} />
          <Route path="/donor-dashboard/profile" element={<ProtectedRoute allowedRole="donor"><DonorProfile /></ProtectedRoute>} />
          <Route path="/donor-dashboard/support" element={<ProtectedRoute allowedRole="donor"><DonorSupport /></ProtectedRoute>} />
          
          {/* Receiver public and protected routes */}
          <Route path="/receiver" element={<ReceiverPage />} />
          <Route path="/ngo-matching" element={<ProtectedRoute allowedRole="receiver"><ReceiverBrowse /></ProtectedRoute>} />
          <Route path="/ngo-dashboard" element={<ProtectedRoute allowedRole="receiver"><ReceiverOverview /></ProtectedRoute>} />
          <Route path="/receiver-dashboard" element={<ProtectedRoute allowedRole="receiver"><ReceiverOverview /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/browse" element={<ProtectedRoute allowedRole="receiver"><ReceiverBrowse /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/requests" element={<ProtectedRoute allowedRole="receiver"><ReceiverRequests /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/history" element={<ProtectedRoute allowedRole="receiver"><ReceiverHistory /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/delivery" element={<ProtectedRoute allowedRole="receiver"><ReceiverDelivery /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/notifications" element={<ProtectedRoute allowedRole="receiver"><ReceiverNotifications /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/profile" element={<ProtectedRoute allowedRole="receiver"><ReceiverProfile /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/impact" element={<ProtectedRoute allowedRole="receiver"><ReceiverImpact /></ProtectedRoute>} />
          <Route path="/receiver-dashboard/support" element={<ProtectedRoute allowedRole="receiver"><ReceiverSupport /></ProtectedRoute>} />
          
          {/* Delivery & Admin aliases */}
          <Route path="/delivery-tracking" element={<Navigate to="/admin/orders-disputes" replace />} />
          <Route path="/delivery-dashboard" element={<Navigate to="/admin" replace />} />

          {/* Public static pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </MealBridgeProvider>
  );
}

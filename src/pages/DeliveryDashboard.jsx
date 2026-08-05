import React, { useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";

export default function DeliveryDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { donations, updateFood, toast } = useContext(MealBridgeContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = sessionStorage.getItem("mealbridge-role");
      if (role === "donor") {
        navigate("/donor-dashboard");
      } else if (role === "receiver") {
        navigate("/receiver-dashboard");
      }
    }
  }, [navigate]);

  // Active delivery job state
  const [activeJob, setActiveJob] = useState(null);

  // Filter donations that need delivery assistance
  // We mock jobs as donations that require transportation ("Yes") and are accepted by an NGO
  const availableJobs = donations.filter(
    d => d.needTransportation === "Yes" && (d.status === "Accepted by NGO" || d.status === "In Transit")
  );

  const handleAcceptJob = (job) => {
    setActiveJob(job);
    updateFood(job.id, { status: "In Transit" });
  };

  const handleCompleteJob = () => {
    if (!activeJob) return;
    updateFood(activeJob.id, { status: "Delivered", needTransportation: "No" });
    setActiveJob(null);
  };

  return (
    <DashboardLayout>
      {/* Hero Welcome banner */}
      <div className="dashboard-hero-card">
        <div className="hero-text-container">
          <h1>Hi, {user?.firstName || "Volunteer"} 👋</h1>
          <p className="gradient-subtext">"Deliver fresh surplus food safely to help shelters near you."</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid" style={{ marginTop: "24px" }}>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <h3>Active Deliveries</h3>
          <h2>{activeJob ? "1 Active" : "0 Active"}</h2>
          <span className="stat-trend positive">Status update pending</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧭</div>
          <h3>Available Runs</h3>
          <h2>{availableJobs.filter(j => j.status === "Accepted by NGO").length} runs</h2>
          <span className="stat-trend positive">Near your area</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <h3>Completed Missions</h3>
          <h2>14 deliveries</h2>
          <span className="stat-trend positive">Total food rescued</span>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🌱</div>
          <h3>CO2 Prevented</h3>
          <h2>82 kg</h2>
          <span className="stat-trend positive">Eco-savings offset</span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: "40px" }}>
        {/* Left Column: Active Run or Job Directory */}
        <div className="main-reports">
          {activeJob ? (
            <article className="panel">
              <div className="panel-header-badge">
                <h2>Active Rescued Delivery Job</h2>
                <span className="badge warning">In Transit</span>
              </div>
              <div className="job-route-details">
                <div className="route-node">
                  <span className="node-icon">🏪</span>
                  <div>
                    <h4>Pickup Location (Donor)</h4>
                    <p><strong>Name:</strong> {activeJob.donorName}</p>
                    <p><strong>Address:</strong> {activeJob.pickupAddress}</p>
                    <p className="gps-coordinate">Coordinates: {activeJob.gpsLocation}</p>
                  </div>
                </div>
                <div className="route-divider-line"></div>
                <div className="route-node">
                  <span className="node-icon">🏘️</span>
                  <div>
                    <h4>Delivery Location (NGO)</h4>
                    <p><strong>Name:</strong> City Hope Shelter</p>
                    <p><strong>Address:</strong> Community Shelter Commons, Sector 4</p>
                  </div>
                </div>
              </div>
              <div className="job-specs-box">
                <p><strong>Food type:</strong> {activeJob.name} ({activeJob.vegNonVeg})</p>
                <p><strong>Portions:</strong> {activeJob.quantity} Servings</p>
                <p><strong>Special Guidelines:</strong> {activeJob.specialInstructions}</p>
              </div>
              <button className="confirm-request-btn" onClick={handleCompleteJob}>
                Mark as Delivered Successfully
              </button>
            </article>
          ) : (
            <article className="panel">
              <h2>Open Dispatch Runs</h2>
              <p>Accept runs below to pick up surplus food and transport it to matching shelters.</p>
              
              {availableJobs.filter(j => j.status === "Accepted by NGO").length === 0 ? (
                <div className="empty-jobs-view">
                  <span className="empty-icon">📍</span>
                  <p>All runs completed! No runs require delivery assistance right now.</p>
                </div>
              ) : (
                <div className="jobs-list">
                  {availableJobs.filter(j => j.status === "Accepted by NGO").map((job) => (
                    <div className="job-item-card" key={job.id}>
                      <div className="job-info">
                        <h4>🍱 {job.name} ({job.quantity} servings)</h4>
                        <p>🏪 <strong>Pickup:</strong> {job.donorName} ({job.pickupAddress})</p>
                        <p>🏘️ <strong>Destination:</strong> Matching Shelter</p>
                      </div>
                      <button className="accept-run-btn" onClick={() => handleAcceptJob(job)}>
                        Accept Run →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </article>
          )}
        </div>

        {/* Right Column: Information panel */}
        <aside className="sidebar-content-custom">
          <article className="panel">
            <h2>Driver Guidelines</h2>
            <div className="guideline-step">
              <h4>1. Verification</h4>
              <p>Ensure temperature check is completed upon pick up.</p>
            </div>
            <div className="guideline-step">
              <h4>2. Secure Transport</h4>
              <p>Keep hot containers separated from salad boxes during transit.</p>
            </div>
            <div className="guideline-step">
              <h4>3. Handover</h4>
              <p>Verify delivery with the shelter point of contact.</p>
            </div>
          </article>
        </aside>
      </div>
    </DashboardLayout>
  );
}

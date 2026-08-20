import React, { useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/react";
import DashboardLayout from "../components/DashboardLayout";
import { MealBridgeContext } from "../context/MealBridgeContext";
import { supabase } from "../supabase";
import {
  INITIAL_NGO_LIST,
  INITIAL_DONOR_LIST,
  INITIAL_INDIVIDUAL_DONORS,
  INITIAL_MODERATED_DONATIONS,
  INITIAL_DISPUTES,
  INITIAL_AGENTS,
  INITIAL_FLAGGED_USERS,
  INITIAL_AUDIT_LOGS,
} from "./admin/adminData";

import OverviewView from "./admin/OverviewView";
import NGOVerificationsView from "./admin/NGOVerificationsView";
import DonorVerificationsView from "./admin/DonorVerificationsView";
import DonationsView from "./admin/DonationsView";
import OrdersDisputesView from "./admin/OrdersDisputesView";
import DeliveryAgentsView from "./admin/DeliveryAgentsView";
import FlaggedUsersView from "./admin/FlaggedUsersView";
import ReportsAnalyticsView from "./admin/ReportsAnalyticsView";
import SettingsView from "./admin/SettingsView";

const COLORS = {
  navy: "#071A2F",
  navy2: "#0D2E4D",
  green: "#12846E",
  emerald: "#08A979",
  mint: "#2CE0B5",
  softGreen: "#E8F8F4",
  border: "#E2E8F0",
  text: "#1E293B",
  muted: "#64748B",
  white: "#FFFFFF",
  bg: "#F8FAFC",
  amber: "#F59E0B",
  red: "#EF4444",
  redBg: "#FEF2F2",
  amberBg: "#FFFBEB",
  blueBg: "#EFF6FF",
};

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useContext(MealBridgeContext);

  const currentPath = location.pathname.replace(/\/$/, "");
  const isOverview = currentPath === "/admin" || currentPath === "/admin/overview";
  const isNGOVerifications = currentPath === "/admin/verifications-ngo";
  const isDonorVerifications = currentPath === "/admin/verifications-donor";
  const isDonations = currentPath === "/admin/donations";
  const isOrdersDisputes = currentPath === "/admin/orders-disputes";
  const isDeliveryAgents = currentPath === "/admin/delivery-agents";
  const isFlaggedUsers = currentPath === "/admin/flagged-users";
  const isAnalytics = currentPath === "/admin/analytics";
  const isSettings = currentPath === "/admin/settings";

  // Audit Logs
  const [adminActions, setAdminActions] = useState(INITIAL_AUDIT_LOGS);

  const logAdminAction = async (actionType, targetId, targetName, reason) => {
    const newEntry = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminName: user?.fullName || "Super Admin",
      actionType,
      targetId,
      targetName,
      reason: reason || "Standard verification review completed.",
    };
    setAdminActions((prev) => [newEntry, ...prev]);

    try {
      if (supabase) {
        await supabase.from("admin_actions").insert([
          {
            admin_id: user?.id || "admin-01",
            admin_name: newEntry.adminName,
            action_type: actionType,
            target_id: targetId,
            target_name: targetName,
            reason: newEntry.reason,
            created_at: newEntry.timestamp,
          },
        ]);
      }
    } catch (err) {
      console.warn("Supabase audit log notice:", err);
    }
  };

  // NGO Verifications
  const [ngoList, setNgoList] = useState(INITIAL_NGO_LIST);
  const [selectedNgoIds, setSelectedNgoIds] = useState([]);
  const [activeNgoModal, setActiveNgoModal] = useState(null);
  const [rejectReasonNgo, setRejectReasonNgo] = useState("");
  const [isRejectModalOpenNgo, setIsRejectModalOpenNgo] = useState(false);
  const [ngoTabFilter, setNgoTabFilter] = useState("all");

  const handleApproveNgo = (ngo) => {
    setNgoList((prev) =>
      prev.map((item) => (item.id === ngo.id ? { ...item, status: "verified" } : item))
    );
    logAdminAction("APPROVE_NGO", ngo.id, ngo.name, "Approved after document verification.");
    showToast(`Approved ${ngo.name} as verified NGO partner!`, "success");
    if (activeNgoModal?.id === ngo.id) setActiveNgoModal(null);
  };

  const handleRejectNgo = () => {
    if (!rejectReasonNgo.trim()) {
      showToast("Please provide a rejection reason.", "warning");
      return;
    }
    const ngo = activeNgoModal;
    if (!ngo) return;
    setNgoList((prev) =>
      prev.map((item) =>
        item.id === ngo.id ? { ...item, status: "rejected", rejectReason: rejectReasonNgo } : item
      )
    );
    logAdminAction("REJECT_NGO", ngo.id, ngo.name, rejectReasonNgo);
    showToast(`Rejected verification for ${ngo.name}. Reason logged.`, "warning");
    setIsRejectModalOpenNgo(false);
    setActiveNgoModal(null);
    setRejectReasonNgo("");
  };

  const handleBulkApproveNgo = () => {
    if (selectedNgoIds.length === 0) return;
    setNgoList((prev) =>
      prev.map((item) => (selectedNgoIds.includes(item.id) ? { ...item, status: "verified" } : item))
    );
    logAdminAction(
      "BULK_APPROVE_NGO",
      selectedNgoIds.join(", "),
      `${selectedNgoIds.length} NGOs`,
      "Batch approval via Admin verification portal."
    );
    showToast(`Bulk approved ${selectedNgoIds.length} NGOs!`, "success");
    setSelectedNgoIds([]);
  };

  // Donor Verifications
  const [donorList, setDonorList] = useState(INITIAL_DONOR_LIST);
  const [individualDonors] = useState(INITIAL_INDIVIDUAL_DONORS);
  const [donorTab, setDonorTab] = useState("commercial");
  const [activeDonorModal, setActiveDonorModal] = useState(null);
  const [rejectReasonDonor, setRejectReasonDonor] = useState("");
  const [isRejectModalOpenDonor, setIsRejectModalOpenDonor] = useState(false);

  const handleApproveDonor = (donor) => {
    setDonorList((prev) =>
      prev.map((d) => (d.id === donor.id ? { ...d, status: "verified" } : d))
    );
    logAdminAction("APPROVE_DONOR", donor.id, donor.businessName, "FSSAI credentials checked and validated.");
    showToast(`Approved ${donor.businessName} as verified commercial donor!`, "success");
    if (activeDonorModal?.id === donor.id) setActiveDonorModal(null);
  };

  const handleRejectDonor = () => {
    if (!rejectReasonDonor.trim()) {
      showToast("Please provide a rejection reason.", "warning");
      return;
    }
    const donor = activeDonorModal;
    if (!donor) return;
    setDonorList((prev) =>
      prev.map((d) =>
        d.id === donor.id ? { ...d, status: "rejected", rejectReason: rejectReasonDonor } : d
      )
    );
    logAdminAction("REJECT_DONOR", donor.id, donor.businessName, rejectReasonDonor);
    showToast(`Rejected verification for ${donor.businessName}.`, "warning");
    setIsRejectModalOpenDonor(false);
    setActiveDonorModal(null);
    setRejectReasonDonor("");
  };

  // Moderation
  const [moderatedDonations, setModeratedDonations] = useState(INITIAL_MODERATED_DONATIONS);
  const [donationSearch, setDonationSearch] = useState("");

  const handleToggleFlagDonation = (donation) => {
    const isNowFlagged = !donation.flagged;
    setModeratedDonations((prev) =>
      prev.map((d) =>
        d.id === donation.id
          ? {
              ...d,
              flagged: isNowFlagged,
              status: isNowFlagged ? "Flagged" : "Available",
              flagReason: isNowFlagged ? "Moderated by administrator for food safety review." : null,
            }
          : d
      )
    );
    logAdminAction(
      isNowFlagged ? "FLAG_DONATION" : "RESTORE_DONATION",
      donation.id,
      donation.title,
      isNowFlagged ? "Flagged listing due to compliance review." : "Restored listing to public feed."
    );
    showToast(
      isNowFlagged ? `Flagged and hidden "${donation.title}"` : `Restored "${donation.title}" to feed`,
      isNowFlagged ? "warning" : "success"
    );
  };

  // Disputes
  const [disputesList, setDisputesList] = useState(INITIAL_DISPUTES);
  const [activeDisputeModal, setActiveDisputeModal] = useState(null);

  const handleResolveDispute = (dispute, actionChoice) => {
    setDisputesList((prev) =>
      prev.map((d) => (d.id === dispute.id ? { ...d, status: "Resolved", resolution: actionChoice } : d))
    );
    logAdminAction("RESOLVE_DISPUTE", dispute.id, `Order ${dispute.orderId}`, `Action: ${actionChoice}`);
    showToast(`Dispute #${dispute.id} resolved: ${actionChoice}`, "success");
    setActiveDisputeModal(null);
  };

  // Delivery Agents
  const [deliveryAgents, setDeliveryAgents] = useState(INITIAL_AGENTS);

  const handleToggleAgentStatus = (agent) => {
    const newStatus = agent.status === "Verified" ? "Suspended" : "Verified";
    setDeliveryAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: newStatus } : a))
    );
    logAdminAction("UPDATE_AGENT", agent.id, agent.name, `Changed agent verification status to ${newStatus}`);
    showToast(`Updated ${agent.name} status to ${newStatus}`, "success");
  };

  // Flagged Users
  const [flaggedUsers, setFlaggedUsers] = useState(INITIAL_FLAGGED_USERS);

  const handleToggleUserSuspension = (targetUser) => {
    const isNowSuspended = targetUser.status !== "Suspended";
    setFlaggedUsers((prev) =>
      prev.map((u) =>
        u.id === targetUser.id
          ? { ...u, status: isNowSuspended ? "Suspended" : "Active" }
          : u
      )
    );
    logAdminAction(
      isNowSuspended ? "SUSPEND_USER" : "REINSTATE_USER",
      targetUser.id,
      targetUser.name,
      isNowSuspended ? "Suspended due to safety threshold breach." : "Reinstated after review."
    );
    showToast(
      isNowSuspended ? `Suspended ${targetUser.name}` : `Reinstated ${targetUser.name}`,
      isNowSuspended ? "warning" : "success"
    );
  };

  // Settings
  const [autoFlagDisputeThreshold, setAutoFlagDisputeThreshold] = useState(3);
  const [minFreshnessThreshold, setMinFreshnessThreshold] = useState(75);
  const [maxUnverifiedClaims, setMaxUnverifiedClaims] = useState(2);
  const [adminEmails, setAdminEmails] = useState(["admin@mealbridge.org", "superadmin@mealbridge.org"]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    logAdminAction("UPDATE_SETTINGS", "SYSTEM_CONFIG", "Global Platform Parameters", "Updated safety and dispute thresholds.");
    showToast("System thresholds and settings saved successfully!", "success");
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminEmail || adminEmails.includes(newAdminEmail)) return;
    setAdminEmails((prev) => [...prev, newAdminEmail]);
    logAdminAction("ADD_ADMIN", newAdminEmail, "Admin Account", "Granted system administrator privileges.");
    showToast(`Added ${newAdminEmail} as administrator!`, "success");
    setNewAdminEmail("");
  };

  // Stats calculation
  const totalPendingNGOs = useMemo(() => ngoList.filter((n) => n.status === "pending").length, [ngoList]);
  const totalPendingDonors = useMemo(() => donorList.filter((d) => d.status === "pending").length, [donorList]);
  const totalActiveDonations = useMemo(() => moderatedDonations.filter((d) => !d.flagged).length, [moderatedDonations]);
  const totalCompletedDeliveries = useMemo(() => deliveryAgents.reduce((sum, a) => sum + a.completedRuns, 0) + 380, [deliveryAgents]);
  const totalAllTimeMeals = useMemo(() => totalCompletedDeliveries * 18 + 2450, [totalCompletedDeliveries]);

  return (
    <DashboardLayout>
      <div
        className="admin-dashboard-container"
        style={{
          width: "100%",
          maxWidth: 1500,
          margin: "0 auto",
          padding: "72px 0 60px",
          color: COLORS.text,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        {/* Admin Header Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navy2})`,
            borderRadius: 20,
            padding: "24px 28px",
            color: "white",
            marginBottom: 26,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: "0 10px 30px rgba(7,26,47,0.12)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>🛡️</span>
              <span style={{ color: COLORS.mint, fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".15em" }}>
                MEALBRIDGE SYSTEM ADMINISTRATION
              </span>
              <span style={{ padding: "3px 8px", borderRadius: 999, background: "rgba(44,224,181,0.2)", color: COLORS.mint, fontSize: 10, fontWeight: 900 }}>
                SUPER ADMIN
              </span>
            </div>
            <h1 style={{ margin: "2px 0 0", color: "white", fontSize: "1.7rem", fontWeight: 950, letterSpacing: "-.03em" }}>
              {isOverview && "Platform Overview & Moderation Center"}
              {isNGOVerifications && "NGO Credential & Document Verifications"}
              {isDonorVerifications && "Donor Safety & FSSAI Verifications"}
              {isDonations && "All Surplus Listings & Content Moderation"}
              {isOrdersDisputes && "Order Fulfillment & Dispute Resolution"}
              {isDeliveryAgents && "Volunteer Courier & Agent Fleet"}
              {isFlaggedUsers && "Flagged Infractions & Account Suspensions"}
              {isAnalytics && "Platform Reports, Growth & Impact Analytics"}
              {isSettings && "Platform Thresholds & Administrator Access"}
            </h1>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.1)", fontSize: 12, fontWeight: 800 }}>
              Audit Log: {adminActions.length} Actions
            </span>
          </div>
        </div>

        {/* PAGE 1: Overview */}
        {isOverview && (
          <OverviewView
            totalActiveDonations={totalActiveDonations}
            totalPendingNGOs={totalPendingNGOs}
            totalPendingDonors={totalPendingDonors}
            totalCompletedDeliveries={totalCompletedDeliveries}
            totalAllTimeMeals={totalAllTimeMeals}
            adminActions={adminActions}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 2: NGO Verifications */}
        {isNGOVerifications && (
          <NGOVerificationsView
            ngoList={ngoList}
            ngoTabFilter={ngoTabFilter}
            setNgoTabFilter={setNgoTabFilter}
            selectedNgoIds={selectedNgoIds}
            setSelectedNgoIds={setSelectedNgoIds}
            handleBulkApproveNgo={handleBulkApproveNgo}
            handleApproveNgo={handleApproveNgo}
            setActiveNgoModal={setActiveNgoModal}
            setIsRejectModalOpenNgo={setIsRejectModalOpenNgo}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 3: Donor Verifications */}
        {isDonorVerifications && (
          <DonorVerificationsView
            donorList={donorList}
            individualDonors={individualDonors}
            donorTab={donorTab}
            setDonorTab={setDonorTab}
            handleApproveDonor={handleApproveDonor}
            setActiveDonorModal={setActiveDonorModal}
            setIsRejectModalOpenDonor={setIsRejectModalOpenDonor}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 4: Donations Moderation */}
        {isDonations && (
          <DonationsView
            moderatedDonations={moderatedDonations}
            donationSearch={donationSearch}
            setDonationSearch={setDonationSearch}
            handleToggleFlagDonation={handleToggleFlagDonation}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 5: Orders & Disputes */}
        {isOrdersDisputes && (
          <OrdersDisputesView
            disputesList={disputesList}
            setActiveDisputeModal={setActiveDisputeModal}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 6: Delivery Agents */}
        {isDeliveryAgents && (
          <DeliveryAgentsView
            deliveryAgents={deliveryAgents}
            handleToggleAgentStatus={handleToggleAgentStatus}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 7: Flagged Users */}
        {isFlaggedUsers && (
          <FlaggedUsersView
            flaggedUsers={flaggedUsers}
            handleToggleUserSuspension={handleToggleUserSuspension}
            COLORS={COLORS}
          />
        )}

        {/* PAGE 8: Analytics */}
        {isAnalytics && <ReportsAnalyticsView COLORS={COLORS} />}

        {/* PAGE 9: Settings & System Audit Log */}
        {isSettings && (
          <SettingsView
            autoFlagDisputeThreshold={autoFlagDisputeThreshold}
            setAutoFlagDisputeThreshold={setAutoFlagDisputeThreshold}
            minFreshnessThreshold={minFreshnessThreshold}
            setMinFreshnessThreshold={setMinFreshnessThreshold}
            maxUnverifiedClaims={maxUnverifiedClaims}
            setMaxUnverifiedClaims={setMaxUnverifiedClaims}
            adminEmails={adminEmails}
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            handleSaveSettings={handleSaveSettings}
            handleAddAdmin={handleAddAdmin}
            adminActions={adminActions}
            COLORS={COLORS}
          />
        )}

        {/* MODALS */}
        {/* NGO Verification Inspection Modal */}
        {activeNgoModal && !isRejectModalOpenNgo && (
          <div
            onClick={() => setActiveNgoModal(null)}
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(5,30,29,.6)", display: "grid", placeItems: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: 20, maxWidth: 650, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>{activeNgoModal.name} — Credentials Review</h3>
                <button onClick={() => setActiveNgoModal(null)} style={{ border: 0, background: "#F1F5F9", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                <div><small style={{ color: COLORS.muted }}>Registration No:</small><div style={{ fontWeight: 800 }}>{activeNgoModal.regNum}</div></div>
                <div><small style={{ color: COLORS.muted }}>Darpan ID:</small><div style={{ fontWeight: 800 }}>{activeNgoModal.darpanId}</div></div>
                <div><small style={{ color: COLORS.muted }}>Primary Contact:</small><div style={{ fontWeight: 800 }}>{activeNgoModal.contactPerson} ({activeNgoModal.phone})</div></div>
                <div><small style={{ color: COLORS.muted }}>Serving Capacity:</small><div style={{ fontWeight: 800, color: COLORS.emerald }}>{activeNgoModal.capacity} Meals/Day</div></div>
              </div>

              <h4 style={{ color: COLORS.navy, fontSize: 13, marginBottom: 8 }}>Submitted Document Thumbnails (Inline Preview):</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                {Object.entries(activeNgoModal.docs).map(([key, url]) => (
                  <div key={key} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 8, textAlign: "center" }}>
                    <img src={url} alt={key} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: 4 }} />
                    <small style={{ fontWeight: 800, textTransform: "uppercase", fontSize: 9 }}>{key}</small>
                  </div>
                ))}
              </div>

              {activeNgoModal.status === "pending" && (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setIsRejectModalOpenNgo(true)}
                    style={{ padding: "10px 18px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, border: `1px solid ${COLORS.red}`, fontWeight: 800, cursor: "pointer" }}
                  >
                    Reject with Reason
                  </button>
                  <button
                    onClick={() => handleApproveNgo(activeNgoModal)}
                    style={{ padding: "10px 22px", borderRadius: 10, background: COLORS.green, color: "white", border: 0, fontWeight: 900, cursor: "pointer" }}
                  >
                    Approve NGO Partner ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NGO Rejection Modal with free-text reason */}
        {isRejectModalOpenNgo && (
          <div
            onClick={() => setIsRejectModalOpenNgo(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(5,30,29,.65)", display: "grid", placeItems: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: 20, maxWidth: 500, width: "100%", padding: 24 }}
            >
              <h3 style={{ margin: "0 0 8px", color: COLORS.red, fontSize: 16, fontWeight: 900 }}>Reject Verification for {activeNgoModal?.name}</h3>
              <p style={{ margin: "0 0 14px", color: COLORS.muted, fontSize: 12 }}>Provide mandatory feedback explaining missing documents or rejection justification.</p>

              <textarea
                rows={4}
                required
                value={rejectReasonNgo}
                onChange={(e) => setRejectReasonNgo(e.target.value)}
                placeholder="e.g. 80G tax exemption certificate is expired; please upload current renewal..."
                style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12, marginBottom: 16 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setIsRejectModalOpenNgo(false)}
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#F1F5F9", border: 0, fontWeight: 800, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectNgo}
                  style={{ padding: "8px 18px", borderRadius: 8, background: COLORS.red, color: "white", border: 0, fontWeight: 900, cursor: "pointer" }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Donor Verification Modal */}
        {activeDonorModal && !isRejectModalOpenDonor && (
          <div
            onClick={() => setActiveDonorModal(null)}
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(5,30,29,.6)", display: "grid", placeItems: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: 20, maxWidth: 600, width: "100%", padding: 24, boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>{activeDonorModal.businessName} — FSSAI License Review</h3>
                <button onClick={() => setActiveDonorModal(null)} style={{ border: 0, background: "#F1F5F9", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16 }}>×</button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <img src={activeDonorModal.docUrl} alt="License" style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 10, border: `1px solid ${COLORS.border}` }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div><small style={{ color: COLORS.muted }}>FSSAI Number:</small><div style={{ fontWeight: 900, color: COLORS.green }}>{activeDonorModal.fssaiNumber}</div></div>
                <div><small style={{ color: COLORS.muted }}>Business Type:</small><div style={{ fontWeight: 800 }}>{activeDonorModal.type}</div></div>
                <div><small style={{ color: COLORS.muted }}>Contact:</small><div style={{ fontWeight: 800 }}>{activeDonorModal.contactPerson} ({activeDonorModal.phone})</div></div>
                <div><small style={{ color: COLORS.muted }}>Location:</small><div style={{ fontWeight: 800 }}>{activeDonorModal.address}</div></div>
              </div>

              {activeDonorModal.status === "pending" && (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setIsRejectModalOpenDonor(true)}
                    style={{ padding: "10px 18px", borderRadius: 10, background: COLORS.redBg, color: COLORS.red, border: `1px solid ${COLORS.red}`, fontWeight: 800, cursor: "pointer" }}
                  >
                    Reject License
                  </button>
                  <button
                    onClick={() => handleApproveDonor(activeDonorModal)}
                    style={{ padding: "10px 22px", borderRadius: 10, background: COLORS.green, color: "white", border: 0, fontWeight: 900, cursor: "pointer" }}
                  >
                    Approve Donor ✓
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Donor Rejection Modal */}
        {isRejectModalOpenDonor && (
          <div
            onClick={() => setIsRejectModalOpenDonor(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(5,30,29,.65)", display: "grid", placeItems: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: 20, maxWidth: 500, width: "100%", padding: 24 }}
            >
              <h3 style={{ margin: "0 0 8px", color: COLORS.red, fontSize: 16, fontWeight: 900 }}>Reject Verification for {activeDonorModal?.businessName}</h3>
              <p style={{ margin: "0 0 14px", color: COLORS.muted, fontSize: 12 }}>Provide mandatory feedback explaining the license invalidity or reason for rejection.</p>

              <textarea
                rows={4}
                required
                value={rejectReasonDonor}
                onChange={(e) => setRejectReasonDonor(e.target.value)}
                placeholder="e.g. FSSAI registration number does not match food business operator name..."
                style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12, marginBottom: 16 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setIsRejectModalOpenDonor(false)}
                  style={{ padding: "8px 16px", borderRadius: 8, background: "#F1F5F9", border: 0, fontWeight: 800, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectDonor}
                  style={{ padding: "8px 18px", borderRadius: 8, background: COLORS.red, color: "white", border: 0, fontWeight: 900, cursor: "pointer" }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Resolution Modal */}
        {activeDisputeModal && (
          <div
            onClick={() => setActiveDisputeModal(null)}
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(5,30,29,.6)", display: "grid", placeItems: "center", padding: 20 }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", borderRadius: 20, maxWidth: 550, width: "100%", padding: 24 }}
            >
              <h3 style={{ margin: "0 0 10px", color: COLORS.navy, fontSize: 17, fontWeight: 900 }}>
                Dispute Resolution: {activeDisputeModal.orderId}
              </h3>
              <p style={{ margin: "0 0 16px", color: COLORS.muted, fontSize: 12 }}>
                Reason: <strong>{activeDisputeModal.disputeReason}</strong> between {activeDisputeModal.donorName} and {activeDisputeModal.ngoName}.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                <button
                  onClick={() => handleResolveDispute(activeDisputeModal, "Dismissed — No violation found")}
                  style={{ padding: "12px", borderRadius: 10, background: "#F8FAFC", border: `1px solid ${COLORS.border}`, fontWeight: 800, textAlign: "left", cursor: "pointer" }}
                >
                  ✓ Dismiss Dispute (No Violation Found)
                </button>
                <button
                  onClick={() => handleResolveDispute(activeDisputeModal, "Warning issued to Courier / Donor")}
                  style={{ padding: "12px", borderRadius: 10, background: COLORS.amberBg, border: `1px solid ${COLORS.amber}`, color: "#B45309", fontWeight: 800, textAlign: "left", cursor: "pointer" }}
                >
                  ⚠️ Issue Official Warning Notice
                </button>
                <button
                  onClick={() => handleResolveDispute(activeDisputeModal, "Escalated to temporary account probation")}
                  style={{ padding: "12px", borderRadius: 10, background: COLORS.redBg, border: `1px solid ${COLORS.red}`, color: COLORS.red, fontWeight: 800, textAlign: "left", cursor: "pointer" }}
                >
                  ⛔ Escalate to Account Suspension / Probation
                </button>
              </div>

              <div style={{ textAlign: "right" }}>
                <button onClick={() => setActiveDisputeModal(null)} style={{ padding: "8px 16px", borderRadius: 8, background: "#F1F5F9", border: 0, fontWeight: 800, cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

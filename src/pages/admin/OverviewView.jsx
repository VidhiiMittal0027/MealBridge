import React from "react";
import { useNavigate } from "react-router-dom";

export default function OverviewView({
  totalActiveDonations,
  totalPendingNGOs,
  totalPendingDonors,
  totalCompletedDeliveries,
  totalAllTimeMeals,
  adminActions,
  COLORS,
}) {
  const navigate = useNavigate();

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 26 }}>
        <div style={{ background: "white", padding: 22, borderRadius: 18, border: `1px solid ${COLORS.border}`, borderTop: `4px solid ${COLORS.green}` }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: COLORS.green, letterSpacing: ".12em", textTransform: "uppercase" }}>ACTIVE DONATIONS</span>
          <div style={{ fontSize: 32, fontWeight: 950, color: COLORS.navy, margin: "6px 0 2px" }}>{totalActiveDonations}</div>
          <small style={{ color: COLORS.muted, fontSize: 11 }}>Live surplus listings awaiting or in match</small>
        </div>

        <div style={{ background: "white", padding: 22, borderRadius: 18, border: `1px solid ${COLORS.border}`, borderTop: `4px solid ${COLORS.amber}` }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: COLORS.amber, letterSpacing: ".12em", textTransform: "uppercase" }}>PENDING VERIFICATIONS</span>
          <div style={{ fontSize: 32, fontWeight: 950, color: COLORS.navy, margin: "6px 0 2px" }}>{totalPendingNGOs + totalPendingDonors}</div>
          <small style={{ color: COLORS.muted, fontSize: 11 }}>{totalPendingNGOs} NGOs + {totalPendingDonors} Commercial Donors</small>
        </div>

        <div style={{ background: "white", padding: 22, borderRadius: 18, border: `1px solid ${COLORS.border}`, borderTop: `4px solid ${COLORS.emerald}` }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: COLORS.emerald, letterSpacing: ".12em", textTransform: "uppercase" }}>COMPLETED RESCUES</span>
          <div style={{ fontSize: 32, fontWeight: 950, color: COLORS.navy, margin: "6px 0 2px" }}>{totalCompletedDeliveries}</div>
          <small style={{ color: COLORS.muted, fontSize: 11 }}>Zero spoilage deliveries fulfilled</small>
        </div>

        <div style={{ background: "white", padding: 22, borderRadius: 18, border: `1px solid ${COLORS.border}`, borderTop: `4px solid ${COLORS.navy}` }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: COLORS.navy, letterSpacing: ".12em", textTransform: "uppercase" }}>MEALS SAVED (ALL-TIME)</span>
          <div style={{ fontSize: 32, fontWeight: 950, color: COLORS.navy, margin: "6px 0 2px" }}>{totalAllTimeMeals.toLocaleString()}</div>
          <small style={{ color: COLORS.green, fontSize: 11, fontWeight: 800 }}>🌱 ~{(totalAllTimeMeals * 0.4).toFixed(0)} kg CO2 diverted</small>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {/* Action Queue */}
        <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚡</span> Moderation Actions Required
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              onClick={() => navigate("/admin/verifications-ngo")}
              style={{ padding: 14, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <strong style={{ color: COLORS.navy, fontSize: 13 }}>NGO Verifications Queue</strong>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{totalPendingNGOs} documents awaiting review</div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 999, background: COLORS.amberBg, color: COLORS.amber, fontWeight: 800, fontSize: 11 }}>
                {totalPendingNGOs} Pending →
              </span>
            </div>

            <div
              onClick={() => navigate("/admin/verifications-donor")}
              style={{ padding: 14, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <strong style={{ color: COLORS.navy, fontSize: 13 }}>Donor FSSAI Queue</strong>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>{totalPendingDonors} commercial kitchens pending</div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 999, background: COLORS.amberBg, color: COLORS.amber, fontWeight: 800, fontSize: 11 }}>
                {totalPendingDonors} Pending →
              </span>
            </div>

            <div
              onClick={() => navigate("/admin/orders-disputes")}
              style={{ padding: 14, borderRadius: 12, background: "#F8FAFC", border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
            >
              <div>
                <strong style={{ color: COLORS.navy, fontSize: 13 }}>Active Disputes</strong>
                <div style={{ color: COLORS.muted, fontSize: 11 }}>1 courier pickup dispute reported</div>
              </div>
              <span style={{ padding: "4px 10px", borderRadius: 999, background: COLORS.redBg, color: COLORS.red, fontWeight: 800, fontSize: 11 }}>
                1 Open →
              </span>
            </div>
          </div>
        </div>

        {/* Live Audit Stream */}
        <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📜</span> Recent Platform Audit Trail
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {adminActions.slice(0, 5).map((act) => (
              <div key={act.id} style={{ padding: "10px 12px", borderRadius: 10, background: "#F8FAFC", border: `1px solid #EDF2F7` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                  <span style={{ fontWeight: 850, color: COLORS.green }}>{act.actionType}</span>
                  <span style={{ color: COLORS.muted }}>{new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 12, color: COLORS.navy }}>{act.targetName}</div>
                <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{act.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


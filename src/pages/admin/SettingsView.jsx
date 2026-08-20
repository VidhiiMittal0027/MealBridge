import React from "react";

export default function SettingsView({
  autoFlagDisputeThreshold,
  setAutoFlagDisputeThreshold,
  minFreshnessThreshold,
  setMinFreshnessThreshold,
  maxUnverifiedClaims,
  setMaxUnverifiedClaims,
  adminEmails,
  newAdminEmail,
  setNewAdminEmail,
  handleSaveSettings,
  handleAddAdmin,
  adminActions,
  COLORS,
}) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 26 }}>
        {/* Threshold Controls */}
        <form onSubmit={handleSaveSettings} style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>Platform Safety Thresholds</h3>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
              Auto-Flag User After N Violations / Disputes
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={autoFlagDisputeThreshold}
              onChange={(e) => setAutoFlagDisputeThreshold(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
              Minimum AI Freshness Score for Public Listing (%)
            </label>
            <input
              type="number"
              min={50}
              max={100}
              value={minFreshnessThreshold}
              onChange={(e) => setMinFreshnessThreshold(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: COLORS.text, marginBottom: 6 }}>
              Max Simultaneous Claims per Unverified NGO
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={maxUnverifiedClaims}
              onChange={(e) => setMaxUnverifiedClaims(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }}
            />
          </div>

          <button
            type="submit"
            style={{ width: "100%", padding: 12, borderRadius: 10, background: COLORS.green, color: "white", border: 0, fontWeight: 900, fontSize: 13, cursor: "pointer" }}
          >
            Save Global Thresholds →
          </button>
        </form>

        {/* Admin Accounts */}
        <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>Platform Administrators</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            {adminEmails.map((email) => (
              <div key={email} style={{ padding: "10px 12px", borderRadius: 10, background: "#F8FAFC", border: `1px solid #EDF2F7`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.navy }}>{email}</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: COLORS.green }}>ACTIVE ADMIN</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddAdmin} style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              required
              placeholder="New admin email..."
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 12 }}
            />
            <button
              type="submit"
              style={{ padding: "8px 14px", borderRadius: 8, background: COLORS.navy, color: "white", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
            >
              + Add Admin
            </button>
          </form>
        </div>
      </div>

      {/* Complete Audit Trail */}
      <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>Complete System Audit Log (admin_actions)</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
                <th style={{ padding: 10 }}>Action ID</th>
                <th style={{ padding: 10 }}>Timestamp</th>
                <th style={{ padding: 10 }}>Admin</th>
                <th style={{ padding: 10 }}>Action Type</th>
                <th style={{ padding: 10 }}>Target</th>
                <th style={{ padding: 10 }}>Audit Justification</th>
              </tr>
            </thead>
            <tbody>
              {adminActions.map((act) => (
                <tr key={act.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: 10, fontWeight: 800 }}>{act.id}</td>
                  <td style={{ padding: 10, color: COLORS.muted }}>{new Date(act.timestamp).toLocaleString()}</td>
                  <td style={{ padding: 10, color: COLORS.navy, fontWeight: 750 }}>{act.adminName}</td>
                  <td style={{ padding: 10, color: COLORS.green, fontWeight: 900 }}>{act.actionType}</td>
                  <td style={{ padding: 10, fontWeight: 700 }}>{act.targetName}</td>
                  <td style={{ padding: 10, color: COLORS.muted }}>{act.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


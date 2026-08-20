import React from "react";

export default function DeliveryAgentsView({
  deliveryAgents,
  handleToggleAgentStatus,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>Volunteer & Courier Agent Fleet</h2>
        <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Manage courier onboarding, active duty status, and delivery track records.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
              <th style={{ padding: 12 }}>Agent Name</th>
              <th style={{ padding: 12 }}>Phone Contact</th>
              <th style={{ padding: 12 }}>Transit Mode</th>
              <th style={{ padding: 12 }}>Completed Runs</th>
              <th style={{ padding: 12 }}>Rating</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveryAgents.map((agt) => (
              <tr key={agt.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 12, fontWeight: 850, color: COLORS.navy }}>{agt.name}</td>
                <td style={{ padding: 12, color: COLORS.muted }}>{agt.phone}</td>
                <td style={{ padding: 12 }}>{agt.vehicle}</td>
                <td style={{ padding: 12, fontWeight: 800, color: COLORS.emerald }}>{agt.completedRuns} Dispatches</td>
                <td style={{ padding: 12, color: COLORS.amber, fontWeight: 800 }}>★ {agt.rating > 0 ? agt.rating : "New"}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 10,
                      background: agt.status === "Verified" ? COLORS.softGreen : COLORS.amberBg,
                      color: agt.status === "Verified" ? COLORS.green : COLORS.amber,
                    }}
                  >
                    {agt.status}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: "right" }}>
                  <button
                    onClick={() => handleToggleAgentStatus(agt)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: agt.status === "Verified" ? COLORS.redBg : COLORS.softGreen,
                      color: agt.status === "Verified" ? COLORS.red : COLORS.green,
                      border: 0,
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    {agt.status === "Verified" ? "Suspend Agent" : "Approve Agent ✓"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


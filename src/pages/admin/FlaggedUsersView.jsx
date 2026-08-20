import React from "react";

export default function FlaggedUsersView({
  flaggedUsers,
  handleToggleUserSuspension,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>Flagged & Suspended User Registry</h2>
        <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Review accounts with low trust scores, repeated disputes, or safety non-compliance.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
              <th style={{ padding: 12 }}>User / Entity Name</th>
              <th style={{ padding: 12 }}>Role</th>
              <th style={{ padding: 12 }}>Trust Score</th>
              <th style={{ padding: 12 }}>Reported Infractions</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12, textAlign: "right" }}>Disciplinary Action</th>
            </tr>
          </thead>
          <tbody>
            {flaggedUsers.map((usr) => (
              <tr key={usr.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 12 }}>
                  <strong style={{ color: COLORS.navy }}>{usr.name}</strong>
                  <small style={{ color: COLORS.red, display: "block" }}>{usr.lastInfraction}</small>
                </td>
                <td style={{ padding: 12, textTransform: "capitalize", color: COLORS.muted }}>{usr.role}</td>
                <td style={{ padding: 12, color: COLORS.red, fontWeight: 900 }}>{usr.trustScore}%</td>
                <td style={{ padding: 12, fontWeight: 800 }}>{usr.violationsCount} Reports</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 10,
                      background: usr.status === "Suspended" ? COLORS.redBg : COLORS.amberBg,
                      color: usr.status === "Suspended" ? COLORS.red : COLORS.amber,
                    }}
                  >
                    {usr.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: "right" }}>
                  <button
                    onClick={() => handleToggleUserSuspension(usr)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: usr.status === "Suspended" ? COLORS.softGreen : COLORS.redBg,
                      color: usr.status === "Suspended" ? COLORS.green : COLORS.red,
                      border: 0,
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: "pointer",
                    }}
                  >
                    {usr.status === "Suspended" ? "Reinstate Account ✓" : "Suspend Account ⛔"}
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


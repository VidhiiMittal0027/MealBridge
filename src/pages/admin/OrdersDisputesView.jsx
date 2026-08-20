import React from "react";

export default function OrdersDisputesView({
  disputesList,
  setActiveDisputeModal,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>Fulfillment & Dispute Resolution</h2>
        <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Investigate courier delays, food condition reports, and quantity disputes.</p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
              <th style={{ padding: 12 }}>Dispute ID</th>
              <th style={{ padding: 12 }}>Order Reference</th>
              <th style={{ padding: 12 }}>Donor & NGO</th>
              <th style={{ padding: 12 }}>Dispute Reason</th>
              <th style={{ padding: 12 }}>Raised On</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12, textAlign: "right" }}>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {disputesList.map((disp) => (
              <tr key={disp.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: 12, fontWeight: 900, color: COLORS.navy }}>{disp.id}</td>
                <td style={{ padding: 12 }}>
                  <div>{disp.orderId}</div>
                  <small style={{ color: COLORS.muted }}>{disp.foodTitle}</small>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, color: COLORS.navy }}>🏢 {disp.donorName}</div>
                  <div style={{ color: COLORS.green }}>🏛️ {disp.ngoName}</div>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{ color: COLORS.red, fontWeight: 800 }}>⚠️ {disp.disputeReason}</span>
                  <small style={{ display: "block", color: COLORS.muted }}>{disp.details}</small>
                </td>
                <td style={{ padding: 12, color: COLORS.muted }}>{disp.raisedDate}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: 10,
                      background: disp.status === "Resolved" ? COLORS.softGreen : COLORS.redBg,
                      color: disp.status === "Resolved" ? COLORS.green : COLORS.red,
                    }}
                  >
                    {disp.status}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: "right" }}>
                  <button
                    onClick={() => setActiveDisputeModal(disp)}
                    style={{ padding: "6px 14px", borderRadius: 8, background: COLORS.navy, color: "white", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                  >
                    Resolve Action ⚖️
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


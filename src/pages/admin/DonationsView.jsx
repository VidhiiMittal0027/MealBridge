import React from "react";

export default function DonationsView({
  moderatedDonations,
  donationSearch,
  setDonationSearch,
  handleToggleFlagDonation,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>Surplus Listings Moderation</h2>
          <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Filter and moderate listings across all active donor accounts.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <input
            type="text"
            placeholder="Search food item or donor..."
            value={donationSearch}
            onChange={(e) => setDonationSearch(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${COLORS.border}`, fontSize: 12 }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
              <th style={{ padding: 12 }}>Food Item</th>
              <th style={{ padding: 12 }}>Donor</th>
              <th style={{ padding: 12 }}>Category</th>
              <th style={{ padding: 12 }}>Servings</th>
              <th style={{ padding: 12 }}>AI Freshness</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12 }}>Posted</th>
              <th style={{ padding: 12, textAlign: "right" }}>Moderation</th>
            </tr>
          </thead>
          <tbody>
            {moderatedDonations
              .filter((d) => d.title.toLowerCase().includes(donationSearch.toLowerCase()) || d.donorName.toLowerCase().includes(donationSearch.toLowerCase()))
              .map((don) => (
                <tr key={don.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: don.flagged ? "#FFF5F5" : "transparent" }}>
                  <td style={{ padding: 12 }}>
                    <strong style={{ color: COLORS.navy }}>{don.title}</strong>
                    {don.flagReason && <small style={{ color: COLORS.red, display: "block" }}>⚠️ {don.flagReason}</small>}
                  </td>
                  <td style={{ padding: 12, color: COLORS.navy, fontWeight: 700 }}>{don.donorName}</td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{don.category}</td>
                  <td style={{ padding: 12, fontWeight: 800 }}>{don.servings} Servings</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ color: don.freshnessScore >= 80 ? COLORS.green : COLORS.red, fontWeight: 900 }}>
                      {don.freshnessScore}%
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "4px 9px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 10,
                        background: don.flagged ? COLORS.redBg : COLORS.softGreen,
                        color: don.flagged ? COLORS.red : COLORS.green,
                      }}
                    >
                      {don.status}
                    </span>
                  </td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{don.postedDate}</td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <button
                      onClick={() => handleToggleFlagDonation(don)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: don.flagged ? COLORS.green : COLORS.redBg,
                        color: don.flagged ? "white" : COLORS.red,
                        border: 0,
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {don.flagged ? "Restore Listing ✓" : "Flag & Remove ⚠️"}
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


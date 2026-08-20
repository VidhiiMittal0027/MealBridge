import React from "react";

export default function DonorVerificationsView({
  donorList,
  individualDonors,
  donorTab,
  setDonorTab,
  handleApproveDonor,
  setActiveDonorModal,
  setIsRejectModalOpenDonor,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>Donor Safety & Verification</h2>
          <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Review commercial caterer FSSAI licenses and household donor registries.</p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setDonorTab("commercial")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `1px solid ${donorTab === "commercial" ? COLORS.green : COLORS.border}`,
              background: donorTab === "commercial" ? COLORS.green : "white",
              color: donorTab === "commercial" ? "white" : COLORS.text,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Commercial & Restaurant Donors ({donorList.filter((d) => d.status === "pending").length} Pending)
          </button>
          <button
            onClick={() => setDonorTab("individual")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `1px solid ${donorTab === "individual" ? COLORS.green : COLORS.border}`,
              background: donorTab === "individual" ? COLORS.green : "white",
              color: donorTab === "individual" ? "white" : COLORS.text,
              fontWeight: 800,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Individual / Household Registry ({individualDonors.length})
          </button>
        </div>
      </div>

      {donorTab === "commercial" ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
                <th style={{ padding: 12 }}>Business Name</th>
                <th style={{ padding: 12 }}>Type</th>
                <th style={{ padding: 12 }}>FSSAI / Registration</th>
                <th style={{ padding: 12 }}>Contact Person</th>
                <th style={{ padding: 12 }}>Status</th>
                <th style={{ padding: 12, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donorList.map((donor) => (
                <tr key={donor.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: 12 }}>
                    <strong style={{ color: COLORS.navy }}>{donor.businessName}</strong>
                    <small style={{ display: "block", color: COLORS.muted }}>{donor.address}</small>
                  </td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{donor.type}</td>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 800, color: COLORS.navy }}>{donor.fssaiNumber}</div>
                    <small style={{ color: COLORS.muted }}>GST: {donor.gst}</small>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>{donor.contactPerson}</div>
                    <small style={{ color: COLORS.muted }}>{donor.phone}</small>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 10,
                        background: donor.status === "verified" ? COLORS.softGreen : COLORS.amberBg,
                        color: donor.status === "verified" ? COLORS.green : COLORS.amber,
                      }}
                    >
                      {donor.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setActiveDonorModal(donor)}
                        style={{ padding: "6px 12px", borderRadius: 8, background: "#F1F5F9", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                      >
                        Inspect License 📄
                      </button>
                      {donor.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveDonor(donor)}
                            style={{ padding: "6px 12px", borderRadius: 8, background: COLORS.green, color: "white", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActiveDonorModal(donor);
                              setIsRejectModalOpenDonor(true);
                            }}
                            style={{ padding: "6px 12px", borderRadius: 8, background: COLORS.redBg, color: COLORS.red, border: `1px solid ${COLORS.red}`, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
                <th style={{ padding: 12 }}>Donor Name</th>
                <th style={{ padding: 12 }}>Phone</th>
                <th style={{ padding: 12 }}>Email</th>
                <th style={{ padding: 12 }}>Location</th>
                <th style={{ padding: 12 }}>Registered</th>
                <th style={{ padding: 12 }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {individualDonors.map((ind) => (
                <tr key={ind.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: 12, fontWeight: 850, color: COLORS.navy }}>{ind.name}</td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{ind.phone}</td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{ind.email}</td>
                  <td style={{ padding: 12 }}>{ind.address}</td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{ind.registeredDate}</td>
                  <td style={{ padding: 12 }}>
                    <span style={{ padding: "4px 10px", borderRadius: 999, background: COLORS.softGreen, color: COLORS.green, fontWeight: 800, fontSize: 10 }}>
                      ✓ PHONE VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


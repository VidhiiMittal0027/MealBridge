import React from "react";

export default function NGOVerificationsView({
  ngoList,
  ngoTabFilter,
  setNgoTabFilter,
  selectedNgoIds,
  setSelectedNgoIds,
  handleBulkApproveNgo,
  handleApproveNgo,
  setActiveNgoModal,
  setIsRejectModalOpenNgo,
  COLORS,
}) {
  return (
    <div style={{ background: "white", padding: 26, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, color: COLORS.navy, fontSize: 18, fontWeight: 900 }}>NGO Verification Requests</h2>
          <p style={{ margin: "4px 0 0", color: COLORS.muted, fontSize: 12 }}>Review submitted registration certificates, 80G documents, and NGO Darpan IDs.</p>
        </div>

        {selectedNgoIds.length > 0 && (
          <button
            onClick={handleBulkApproveNgo}
            style={{ padding: "10px 18px", borderRadius: 10, background: COLORS.green, color: "white", border: 0, fontWeight: 800, fontSize: 12, cursor: "pointer" }}
          >
            ✓ Bulk Approve Selected ({selectedNgoIds.length})
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["all", "pending", "verified", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setNgoTabFilter(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${ngoTabFilter === tab ? COLORS.green : COLORS.border}`,
              background: ngoTabFilter === tab ? COLORS.green : "white",
              color: ngoTabFilter === tab ? "white" : COLORS.text,
              fontSize: 11,
              fontWeight: 800,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: `2px solid ${COLORS.border}`, color: COLORS.navy, fontWeight: 900 }}>
              <th style={{ padding: 12, width: 40 }}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) setSelectedNgoIds(ngoList.filter((n) => n.status === "pending").map((n) => n.id));
                    else setSelectedNgoIds([]);
                  }}
                />
              </th>
              <th style={{ padding: 12 }}>Organization Name</th>
              <th style={{ padding: 12 }}>Reg / Darpan ID</th>
              <th style={{ padding: 12 }}>Contact Person</th>
              <th style={{ padding: 12 }}>Capacity</th>
              <th style={{ padding: 12 }}>Submitted</th>
              <th style={{ padding: 12 }}>Status</th>
              <th style={{ padding: 12, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ngoList
              .filter((n) => ngoTabFilter === "all" || n.status === ngoTabFilter)
              .map((ngo) => (
                <tr key={ngo.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: 12 }}>
                    {ngo.status === "pending" && (
                      <input
                        type="checkbox"
                        checked={selectedNgoIds.includes(ngo.id)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedNgoIds((prev) => [...prev, ngo.id]);
                          else setSelectedNgoIds((prev) => prev.filter((id) => id !== ngo.id));
                        }}
                      />
                    )}
                  </td>
                  <td style={{ padding: 12 }}>
                    <strong style={{ color: COLORS.navy, display: "block" }}>{ngo.name}</strong>
                    <small style={{ color: COLORS.muted }}>{ngo.address}</small>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>{ngo.regNum}</div>
                    <small style={{ color: COLORS.green, fontWeight: 800 }}>{ngo.darpanId}</small>
                  </td>
                  <td style={{ padding: 12 }}>
                    <div>{ngo.contactPerson}</div>
                    <small style={{ color: COLORS.muted }}>{ngo.phone}</small>
                  </td>
                  <td style={{ padding: 12 }}>
                    <span style={{ fontWeight: 800, color: COLORS.emerald }}>{ngo.capacity} Meals/Day</span>
                  </td>
                  <td style={{ padding: 12, color: COLORS.muted }}>{ngo.submittedDate}</td>
                  <td style={{ padding: 12 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 10,
                        background: ngo.status === "verified" ? COLORS.softGreen : ngo.status === "rejected" ? COLORS.redBg : COLORS.amberBg,
                        color: ngo.status === "verified" ? COLORS.green : ngo.status === "rejected" ? COLORS.red : COLORS.amber,
                      }}
                    >
                      {ngo.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setActiveNgoModal(ngo)}
                        style={{ padding: "6px 12px", borderRadius: 8, background: "#F1F5F9", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                      >
                        Inspect Docs 🔍
                      </button>
                      {ngo.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveNgo(ngo)}
                            style={{ padding: "6px 12px", borderRadius: 8, background: COLORS.green, color: "white", border: 0, fontWeight: 800, fontSize: 11, cursor: "pointer" }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActiveNgoModal(ngo);
                              setIsRejectModalOpenNgo(true);
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
    </div>
  );
}


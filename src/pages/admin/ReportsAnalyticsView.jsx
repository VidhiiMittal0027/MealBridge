import React from "react";

export default function ReportsAnalyticsView({ COLORS }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 26 }}>
        {/* Category Breakdown */}
        <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>Top Surplus Food Categories</h3>
          {[
            { name: "Cooked Meals & Catering", percent: 45, count: "1,240 boxes" },
            { name: "Bakery & Breads", percent: 25, count: "680 batches" },
            { name: "Raw Fresh Produce", percent: 18, count: "490 crates" },
            { name: "Packaged & Pantry", percent: 12, count: "310 packs" },
          ].map((cat) => (
            <div key={cat.name} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, marginBottom: 4 }}>
                <span>{cat.name}</span>
                <span style={{ color: COLORS.green }}>{cat.percent}% ({cat.count})</span>
              </div>
              <div style={{ height: 6, borderRadius: 999, background: "#EDF2F7", overflow: "hidden" }}>
                <div style={{ width: `${cat.percent}%`, height: "100%", background: COLORS.green }} />
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Rescues Chart */}
        <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
          <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>Monthly Rescue Growth (Meals)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, paddingTop: 20 }}>
            {[
              { month: "Apr", val: 50 },
              { month: "May", val: 65 },
              { month: "Jun", val: 80 },
              { month: "Jul", val: 95 },
              { month: "Aug", val: 120 },
            ].map((m) => (
              <div key={m.month} style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    height: `${(m.val / 120) * 120}px`,
                    background: `linear-gradient(180deg, ${COLORS.emerald}, ${COLORS.green})`,
                    borderRadius: "6px 6px 0 0",
                    margin: "0 auto",
                    width: "80%",
                  }}
                />
                <span style={{ display: "block", fontSize: 11, color: COLORS.muted, marginTop: 6, fontWeight: 700 }}>
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental & Verification Analytics */}
      <div style={{ background: "white", padding: 24, borderRadius: 18, border: `1px solid ${COLORS.border}` }}>
        <h3 style={{ margin: "0 0 16px", color: COLORS.navy, fontSize: 16, fontWeight: 900 }}>System Verification Efficiency</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div style={{ padding: 16, background: COLORS.softGreen, borderRadius: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 950, color: COLORS.green }}>94.2%</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginTop: 2 }}>NGO Approval Rate</div>
          </div>
          <div style={{ padding: 16, background: "#FEF3C7", borderRadius: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 950, color: "#D97706" }}>&lt; 3.2 Hours</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginTop: 2 }}>Avg Verification Turnaround</div>
          </div>
          <div style={{ padding: 16, background: "#EFF6FF", borderRadius: 12 }}>
            <div style={{ fontSize: 24, fontWeight: 950, color: "#2563EB" }}>99.1%</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.navy, marginTop: 2 }}>AI Accuracy Match</div>
          </div>
        </div>
      </div>
    </div>
  );
}


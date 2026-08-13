import React, { useContext } from "react";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";
import "./ImpactDashboard.css";

export default function ImpactDashboard() {
  const { orders } = useContext(MealBridgeContext);

  // Calculate dynamic stats
  const activeOrdersForStats = orders.filter(o => o.status !== "Declined");
  const totalMeals = 247 + activeOrdersForStats.reduce((sum, o) => sum + o.expectedPeople, 0);
  const totalPeopleFed = 856 + activeOrdersForStats.reduce((sum, o) => sum + o.expectedPeople, 0);
  const preventedWasteTons = (1.8 + activeOrdersForStats.reduce((sum, o) => sum + o.expectedPeople * 0.0004, 0)).toFixed(2);
  
  // Base list of unique NGOs plus any new unique ones
  const baseNgos = ["City Hope Kitchen", "Youth Center East", "Bridge Shelter"];
  const orderNgos = activeOrdersForStats.map(o => o.ngoName);
  const allNgos = new Set([...baseNgos, ...orderNgos]);
  const uniqueNGOsCount = allNgos.size;

  // Group orders by NGO for the systematic and professional layout
  const ngoStats = orders.reduce((acc, order) => {
    if (!acc[order.ngoName]) {
      acc[order.ngoName] = {
        count: 0,
        totalServings: 0,
        lastOrderTime: null,
        ordersList: []
      };
    }
    acc[order.ngoName].count += 1;
    acc[order.ngoName].totalServings += order.expectedPeople;
    const orderTime = new Date(order.orderTime);
    if (!acc[order.ngoName].lastOrderTime || orderTime > new Date(acc[order.ngoName].lastOrderTime)) {
      acc[order.ngoName].lastOrderTime = order.orderTime;
    }
    acc[order.ngoName].ordersList.push(order);
    return acc;
  }, {});

  // Sort NGOs by count of orders
  const ngoEngagementList = Object.entries(ngoStats).sort((a, b) => b[1].count - a[1].count);

  return (
    <DashboardLayout>
      <div className="impact-portal-content">
        <header className="dashboard-header-custom">
          <div>
            <p className="eyebrow">DASHBOARD</p>
            <h1>Your Impact Dashboard</h1>
            <p className="subtitle">Real-time overview of your contribution to reducing food waste.</p>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <p>🍽️ Meals Donated</p>
            <h2>{totalMeals}</h2>
            <span className="positive">↑ Active community matches</span>
          </article>
          <article className="stat-card">
            <p>♻️ Food Waste Prevented</p>
            <h2>{preventedWasteTons} tons</h2>
            <span className="positive">↑ Active recycling</span>
          </article>
          <article className="stat-card">
            <p>🏘️ Communities Served</p>
            <h2>{uniqueNGOsCount}</h2>
            <span>Regional outreach centers</span>
          </article>
          <article className="stat-card">
            <p>❤️ People Fed</p>
            <h2>{totalPeopleFed}</h2>
            <span className="positive">↑ Active relief</span>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="main-reports">
            <article className="panel">
              <h2>Impact Timeline</h2>
              <p>Your rescued meals over the last six months</p>
              <div className="chart">
                {["jan", "feb", "mar", "apr", "may", "jun"].map(m => (
                  <div className="bar-group" key={m}>
                    <div className={"bar " + m} />
                    <span>{m.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </article>

            {/* Dynamic NGO Partner Engagement Panel */}
            <article className="panel" style={{ marginTop: "24px" }}>
              <h2>NGO Partner Engagement</h2>
              <p>Detailed history of food orders and donations matching registered shelters.</p>
              
              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {ngoEngagementList.map(([ngoName, stats]) => (
                  <div key={ngoName} className="ngo-engagement-card" style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid rgba(255, 138, 0, 0.12)",
                    borderRadius: "16px",
                    padding: "20px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 138, 0, 0.1)", paddingBottom: "12px", marginBottom: "12px" }}>
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800", color: "var(--primary)" }}>🏘️ {ngoName}</h3>
                      <span className="badge info" style={{ background: "rgba(255, 138, 0, 0.1)", color: "var(--primary)", fontWeight: "700", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem" }}>
                        {stats.count} {stats.count === 1 ? "Order" : "Orders"}
                      </span>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                      <p style={{ margin: 0 }}><strong>Total Servings Received:</strong> {stats.totalServings} portions</p>
                      <p style={{ margin: 0 }}><strong>Last Active Match:</strong> {stats.lastOrderTime ? new Date(stats.lastOrderTime).toLocaleDateString() + " " + new Date(stats.lastOrderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
                    </div>
                    
                    <div>
                      <h4 style={{ margin: "0 0 8px", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", fontWeight: "700" }}>Matched Donations Log</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {stats.ordersList.map(ord => (
                          <div key={ord.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,253,248,0.7)", padding: "10px 14px", borderRadius: "10px", fontSize: "0.85rem", border: "1px solid rgba(255, 138, 0, 0.05)" }}>
                            <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>🍱 {ord.foodRequested} <span style={{ fontWeight: "400", color: "#666" }}>({ord.expectedPeople} servings)</span></span>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                              <span style={{ color: "#777", fontSize: "0.8rem" }}>{new Date(ord.orderTime).toLocaleDateString()} {new Date(ord.orderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span className={`status-badge-custom ${ord.status.replace(/\s+/g, '-').toLowerCase()}`} style={{ fontSize: "0.75rem", padding: "3px 10px" }}>{ord.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="empty-listing-panel" style={{ background: "transparent", border: "1px dashed rgba(255, 138, 0, 0.15)" }}>
                    <span className="empty-icon">📈</span>
                    <h3>No NGO orders placed yet</h3>
                    <p>When recipient shelters request your listed surplus food, the match history and breakdown will display here.</p>
                  </div>
                )}
              </div>
            </article>
          </div>

          <aside className="sidebar-content-custom">
            <article className="recognition-card">
              <h2>Badges & Recognition</h2>
              <div className="badges">
                <div className="badge">🏆<br />Food Rescuer</div>
                <div className="badge">⭐<br />Community Champion</div>
              </div>
              <div className="milestone">
                <h3>🎉 New Milestone!</h3>
                <p>You rescued over 500 meals this year!</p>
                <button className="btn">Share Achievement</button>
              </div>
            </article>

            <article className="mission-card">
              <h2>Continue your mission today</h2>
              <p>12 potential NGOs are waiting for surplus food.</p>
              <a className="white-button" href="/donor-dashboard">View Active Listings →</a>
            </article>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
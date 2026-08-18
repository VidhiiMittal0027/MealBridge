import React, { useContext } from "react";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";
import "./ImpactDashboard.css";

/* =========================================================
   STATIC ACTIVITY DATA
========================================================= */

const activities = [
  {
    food: "Artisan Bread Assortment",
    meals: "45 Meals",
    date: "June 12, 2026",
    receiver: "City Hope Kitchen",
    status: "Completed",
    icon: "🥖",
  },
  {
    food: "Prepared Salad Trays",
    meals: "20 Meals",
    date: "June 10, 2026",
    receiver: "Youth Center East",
    status: "In Transit",
    icon: "🥗",
  },
  {
    food: "Roasted Vegetable Mix",
    meals: "35 Meals",
    date: "June 8, 2026",
    receiver: "Bridge Shelter",
    status: "Pending",
    icon: "🥕",
  },
];

/* =========================================================
   MONTHLY IMPACT DATA
========================================================= */

const monthlyImpact = [
  { month: "JAN", value: 38 },
  { month: "FEB", value: 52 },
  { month: "MAR", value: 44 },
  { month: "APR", value: 67 },
  { month: "MAY", value: 76 },
  { month: "JUN", value: 91 },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function ImpactDashboard() {
  const { orders = [] } = useContext(MealBridgeContext);

  /* =======================================================
     DYNAMIC STATS
  ======================================================= */

  const activeOrdersForStats = orders.filter(
    (order) => order.status !== "Declined"
  );

  const additionalMeals = activeOrdersForStats.reduce(
    (sum, order) => sum + Number(order.expectedPeople || 0),
    0
  );

  const totalMeals = 247 + additionalMeals;

  const totalPeopleFed = 856 + additionalMeals;

  const preventedWasteTons = (
    1.8 +
    activeOrdersForStats.reduce(
      (sum, order) =>
        sum + Number(order.expectedPeople || 0) * 0.0004,
      0
    )
  ).toFixed(2);

  /* =======================================================
     NGO COUNTS
  ======================================================= */

  const baseNgos = [
    "City Hope Kitchen",
    "Youth Center East",
    "Bridge Shelter",
  ];

  const orderNgos = activeOrdersForStats
    .map((order) => order.ngoName)
    .filter(Boolean);

  const allNgos = new Set([...baseNgos, ...orderNgos]);

  const uniqueNGOsCount = allNgos.size;

  /* =======================================================
     NGO ENGAGEMENT DATA
  ======================================================= */

  const ngoStats = orders.reduce((acc, order) => {
    const ngoName = order.ngoName || "Unknown Organization";

    if (!acc[ngoName]) {
      acc[ngoName] = {
        count: 0,
        totalServings: 0,
        lastOrderTime: null,
        ordersList: [],
      };
    }

    acc[ngoName].count += 1;

    acc[ngoName].totalServings += Number(
      order.expectedPeople || 0
    );

    const orderTime = new Date(order.orderTime);

    if (
      !acc[ngoName].lastOrderTime ||
      orderTime > new Date(acc[ngoName].lastOrderTime)
    ) {
      acc[ngoName].lastOrderTime = order.orderTime;
    }

    acc[ngoName].ordersList.push(order);

    return acc;
  }, {});

  const ngoEngagementList = Object.entries(ngoStats).sort(
    (a, b) => b[1].count - a[1].count
  );

  /* =======================================================
     HELPERS
  ======================================================= */

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return `${parsedDate.toLocaleDateString()} ${parsedDate.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  return (
    <DashboardLayout>
      <div className="impact-portal-content">

        {/* =================================================
            PREMIUM HERO
        ================================================= */}

        <section className="impact-hero">

          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="live-dot"></span>
              MEALBRIDGE IMPACT CENTER
            </div>

            <h1>
              Turning rescued food
              <span> into real impact.</span>
            </h1>

            <p>
              Track the meals you've helped rescue, communities
              you've supported, and the food waste you've prevented.
            </p>

            <div className="hero-actions">

              <a
                href="/donate-food"
                className="primary-action"
              >
                <span>＋</span>
                Rescue More Food
              </a>

              <button
                type="button"
                className="secondary-action"
                onClick={() =>
                  window.print()
                }
              >
                View Impact Report
                <span>↗</span>
              </button>

            </div>

          </div>

          <div className="hero-impact">

            <div className="impact-ring">

              <div className="ring-inner">
                <strong>92</strong>
                <span>Impact Score</span>
              </div>

            </div>

            <div className="hero-impact-copy">
              <span>Excellent Impact</span>

              <p>
                Top 8% of MealBridge contributors
              </p>
            </div>

          </div>

        </section>

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="stats-grid">

          {/* MEALS */}

          <article className="premium-stat-card featured-stat">

            <div className="stat-top">

              <div className="stat-icon meals-icon">
                🍽
              </div>

              <span className="stat-trend">
                +12%
              </span>

            </div>

            <div className="stat-label">
              Meals Rescued
            </div>

            <div className="stat-number">
              {totalMeals}
            </div>

            <div className="stat-bottom">
              <span>
                vs. last month
              </span>

              <strong>
                +27 meals
              </strong>
            </div>

            <div className="mini-progress">
              <span
                style={{
                  width: "78%",
                }}
              />
            </div>

          </article>

          {/* WASTE */}

          <article className="premium-stat-card">

            <div className="stat-top">

              <div className="stat-icon waste-icon">
                ♻
              </div>

              <span className="stat-trend">
                +0.4T
              </span>

            </div>

            <div className="stat-label">
              Food Waste Prevented
            </div>

            <div className="stat-number">
              {preventedWasteTons}
              <span> tons</span>
            </div>

            <div className="stat-bottom">
              <span>
                This month
              </span>

              <strong>
                Growing impact
              </strong>
            </div>

            <div className="mini-progress">
              <span
                style={{
                  width: "66%",
                }}
              />
            </div>

          </article>

          {/* COMMUNITIES */}

          <article className="premium-stat-card">

            <div className="stat-top">

              <div className="stat-icon community-icon">
                ⌂
              </div>

              <span className="stat-neutral">
                Active
              </span>

            </div>

            <div className="stat-label">
              Communities Served
            </div>

            <div className="stat-number">
              {uniqueNGOsCount}
            </div>

            <div className="stat-bottom">
              <span>
                Regional centers
              </span>

              <strong>
                +3 this year
              </strong>
            </div>

            <div className="mini-progress">
              <span
                style={{
                  width: "54%",
                }}
              />
            </div>

          </article>

          {/* PEOPLE */}

          <article className="premium-stat-card">

            <div className="stat-top">

              <div className="stat-icon people-icon">
                ♥
              </div>

              <span className="stat-trend">
                +85
              </span>

            </div>

            <div className="stat-label">
              People Fed
            </div>

            <div className="stat-number">
              {totalPeopleFed}
            </div>

            <div className="stat-bottom">
              <span>
                This month
              </span>

              <strong>
                Growing daily
              </strong>
            </div>

            <div className="mini-progress">
              <span
                style={{
                  width: "86%",
                }}
              />
            </div>

          </article>

        </section>

        {/* =================================================
            MAIN DASHBOARD GRID
        ================================================= */}

        <section className="dashboard-grid">

          {/* =================================================
              MAIN REPORTS
          ================================================= */}

          <main className="main-reports">

            {/* =================================================
                IMPACT TIMELINE
            ================================================= */}

            <article className="premium-panel timeline-panel">

              <div className="panel-header">

                <div>

                  <div className="panel-kicker">
                    YOUR PROGRESS
                  </div>

                  <h2>
                    Impact Timeline
                  </h2>

                  <p>
                    Meals rescued over the last six months
                  </p>

                </div>

                <div className="period-selector">

                  <button
                    type="button"
                    className="active-period"
                  >
                    6 Months
                  </button>

                  <button type="button">
                    Year
                  </button>

                </div>

              </div>

              <div className="chart-wrapper">

                <div className="chart-y-axis">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <div className="chart-area">

                  <div className="chart-grid-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="bars">

                    {monthlyImpact.map(
                      (item, index) => (

                        <div
                          className="bar-column"
                          key={item.month}
                        >

                          <div className="bar-value">
                            {item.value}
                          </div>

                          <div className="bar-track">

                            <div
                              className={`impact-bar ${
                                index ===
                                monthlyImpact.length - 1
                                  ? "current-bar"
                                  : ""
                              }`}
                              style={{
                                height: `${item.value}%`,
                              }}
                            >
                              <div className="bar-glow"></div>
                            </div>

                          </div>

                          <span className="bar-month">
                            {item.month}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

              <div className="chart-summary">

                <div>
                  <span className="summary-dot"></span>
                  <span>Rescued meals</span>
                </div>

                <strong>
                  +139% growth
                  <small> since January</small>
                </strong>

              </div>

            </article>

            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <article className="premium-panel activity-panel">

              <div className="panel-header">

                <div>

                  <div className="panel-kicker">
                    LIVE NETWORK
                  </div>

                  <h2>
                    Recent Rescued Food
                  </h2>

                  <p>
                    Latest food rescue activity across
                    your network
                  </p>

                </div>

                <button
                  type="button"
                  className="view-all-btn"
                >
                  View all
                  <span>→</span>
                </button>

              </div>

              <div className="activity-list">

                {activities.map(
                  (activity, index) => (

                    <div
                      className="premium-activity-card"
                      key={activity.food}
                    >

                      <div className="activity-number">
                        0{index + 1}
                      </div>

                      <div className="activity-icon-large">
                        {activity.icon}
                      </div>

                      <div className="activity-details">

                        <h3>
                          {activity.food}
                        </h3>

                        <div className="activity-meta">

                          <span>
                            {activity.meals}
                          </span>

                          <i></i>

                          <span>
                            {activity.date}
                          </span>

                        </div>

                      </div>

                      <div className="activity-destination">

                        <span>
                          DESTINATION
                        </span>

                        <strong>
                          {activity.receiver}
                        </strong>

                      </div>

                      <div
                        className={`premium-status ${
                          activity.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                        }`}
                      >
                        <span></span>
                        {activity.status}
                      </div>

                      <button
                        type="button"
                        className="activity-arrow"
                      >
                        →
                      </button>

                    </div>

                  )
                )}

              </div>

            </article>

            {/* =================================================
                NGO PARTNER ENGAGEMENT
            ================================================= */}

            <article
              className="panel ngo-engagement-panel"
              style={{
                marginTop: "24px",
              }}
            >

              <div className="panel-header">

                <div>
                  <div className="panel-kicker">
                    COMMUNITY NETWORK
                  </div>

                  <h2>
                    NGO Partner Engagement
                  </h2>

                  <p>
                    Detailed history of food orders
                    and donations matched with
                    registered shelters.
                  </p>
                </div>

              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >

                {ngoEngagementList.map(
                  ([ngoName, stats]) => (

                    <div
                      key={ngoName}
                      className="ngo-engagement-card"
                      style={{
                        background:
                          "rgba(255, 255, 255, 0.6)",
                        border:
                          "1px solid rgba(255, 138, 0, 0.12)",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow:
                          "0 4px 15px rgba(0,0,0,0.02)",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          borderBottom:
                            "1px solid rgba(255, 138, 0, 0.1)",
                          paddingBottom: "12px",
                          marginBottom: "12px",
                        }}
                      >

                        <h3
                          style={{
                            margin: 0,
                            fontSize: "1.1rem",
                            fontWeight: "800",
                            color:
                              "var(--primary)",
                          }}
                        >
                          🏘️ {ngoName}
                        </h3>

                        <span
                          className="badge info"
                          style={{
                            background:
                              "rgba(255, 138, 0, 0.1)",
                            color:
                              "var(--primary)",
                            fontWeight: "700",
                            padding:
                              "4px 12px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "0.8rem",
                          }}
                        >
                          {stats.count}{" "}
                          {stats.count === 1
                            ? "Order"
                            : "Orders"}
                        </span>

                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: "12px",
                          fontSize:
                            "0.9rem",
                          color:
                            "var(--text-secondary)",
                          marginBottom:
                            "16px",
                        }}
                      >

                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          <strong>
                            Total Servings
                            Received:
                          </strong>{" "}
                          {stats.totalServings}{" "}
                          portions
                        </p>

                        <p
                          style={{
                            margin: 0,
                          }}
                        >
                          <strong>
                            Last Active
                            Match:
                          </strong>{" "}
                          {formatDateTime(
                            stats.lastOrderTime
                          )}
                        </p>

                      </div>

                      <div>

                        <h4
                          style={{
                            margin:
                              "0 0 8px",
                            fontSize:
                              "0.8rem",
                            textTransform:
                              "uppercase",
                            letterSpacing:
                              "0.5px",
                            color:
                              "var(--text-secondary)",
                            fontWeight:
                              "700",
                          }}
                        >
                          Matched Donations Log
                        </h4>

                        <div
                          style={{
                            display:
                              "flex",
                            flexDirection:
                              "column",
                            gap: "8px",
                          }}
                        >

                          {stats.ordersList.map(
                            (order) => (

                              <div
                                key={
                                  order.id ||
                                  `${ngoName}-${order.orderTime}-${order.foodRequested}`
                                }
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  background:
                                    "rgba(255,253,248,0.7)",
                                  padding:
                                    "10px 14px",
                                  borderRadius:
                                    "10px",
                                  fontSize:
                                    "0.85rem",
                                  border:
                                    "1px solid rgba(255, 138, 0, 0.05)",
                                  gap:
                                    "12px",
                                  flexWrap:
                                    "wrap",
                                }}
                              >

                                <span
                                  style={{
                                    fontWeight:
                                      "600",
                                    color:
                                      "var(--text-primary)",
                                  }}
                                >
                                  🍱{" "}
                                  {order.foodRequested ||
                                    "Food donation"}{" "}

                                  <span
                                    style={{
                                      fontWeight:
                                        "400",
                                      color:
                                        "#666",
                                    }}
                                  >
                                    (
                                    {
                                      order.expectedPeople ||
                                      0
                                    }{" "}
                                    servings)
                                  </span>

                                </span>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap:
                                      "12px",
                                    alignItems:
                                      "center",
                                    flexWrap:
                                      "wrap",
                                  }}
                                >

                                  <span
                                    style={{
                                      color:
                                        "#777",
                                      fontSize:
                                        "0.8rem",
                                    }}
                                  >
                                    {formatDateTime(
                                      order.orderTime
                                    )}
                                  </span>

                                  <span
                                    className={`status-badge-custom ${
                                      String(
                                        order.status ||
                                          "Unknown"
                                      )
                                        .replace(
                                          /\s+/g,
                                          "-"
                                        )
                                        .toLowerCase()
                                    }`}
                                    style={{
                                      fontSize:
                                        "0.75rem",
                                      padding:
                                        "3px 10px",
                                    }}
                                  >
                                    {order.status ||
                                      "Unknown"}
                                  </span>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

                {orders.length === 0 && (

                  <div
                    className="empty-listing-panel"
                    style={{
                      background:
                        "transparent",
                      border:
                        "1px dashed rgba(255, 138, 0, 0.15)",
                    }}
                  >

                    <span className="empty-icon">
                      📈
                    </span>

                    <h3>
                      No NGO orders placed yet
                    </h3>

                    <p>
                      When recipient shelters
                      request your listed surplus
                      food, the match history and
                      breakdown will display here.
                    </p>

                  </div>

                )}

              </div>

            </article>

          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="sidebar-content-custom">

            {/* =================================================
                RECOGNITION
            ================================================= */}

            <article className="premium-panel recognition-panel">

              <div className="panel-kicker">
                ACHIEVEMENTS
              </div>

              <div className="recognition-heading">

                <div>

                  <h2>
                    Recognition
                  </h2>

                  <p>
                    Your contribution is making
                    a difference.
                  </p>

                </div>

                <div className="trophy-icon">
                  🏆
                </div>

              </div>

              <div className="badges">

                <div className="premium-badge">

                  <div className="badge-icon">
                    🥇
                  </div>

                  <strong>
                    Food Rescuer
                  </strong>

                  <span>
                    500+ meals
                  </span>

                </div>

                <div className="premium-badge">

                  <div className="badge-icon">
                    ⭐
                  </div>

                  <strong>
                    Champion
                  </strong>

                  <span>
                    Top contributor
                  </span>

                </div>

              </div>

              <div className="milestone-box">

                <div className="milestone-top">

                  <span className="milestone-icon">
                    🎉
                  </span>

                  <div>

                    <span className="milestone-label">
                      NEW MILESTONE
                    </span>

                    <h3>
                      500 Meals Rescued
                    </h3>

                  </div>

                </div>

                <p>
                  Your network has helped redirect
                  surplus food to people who need
                  it most.
                </p>

                <button
                  type="button"
                  className="share-btn"
                  onClick={() => {
                    if (
                      navigator.share
                    ) {
                      navigator.share({
                        title:
                          "MealBridge Impact",
                        text:
                          "I've helped rescue surplus food through MealBridge!",
                      });
                    }
                  }}
                >
                  <span>↗</span>
                  Share Achievement
                </button>

              </div>

            </article>

            {/* =================================================
                MISSION CARD
            ================================================= */}

            <article className="mission-card-premium">

              <div className="mission-pattern"></div>

              <div className="mission-content">

                <div className="mission-icon">
                  ♻
                </div>

                <span className="mission-label">
                  KEEP THE IMPACT GOING
                </span>

                <h2>
                  Continue your mission today.
                </h2>

                <p>
                  12 potential NGOs are waiting
                  for surplus food in your area.
                </p>

                <a
                  href="/donate-food"
                  className="mission-action"
                >
                  List New Surplus
                  <span>→</span>
                </a>

              </div>

            </article>

            {/* =================================================
                IMPACT SCORE
            ================================================= */}

            <article className="premium-panel score-panel">

              <div className="panel-kicker">
                COMMUNITY SCORE
              </div>

              <div className="score-row">

                <div className="score-circle">

                  <strong>
                    92
                  </strong>

                  <span>
                    /100
                  </span>

                </div>

                <div className="score-info">

                  <h3>
                    Excellent
                  </h3>

                  <p>
                    You're consistently creating
                    measurable community impact.
                  </p>

                </div>

              </div>

              <div className="score-bar">
                <span></span>
              </div>

              <div className="score-footer">

                <span>
                  Next level
                </span>

                <strong>
                  8 points away
                </strong>

              </div>

            </article>

            {/* =================================================
                SIMPLE MISSION CARD
            ================================================= */}

            <article className="mission-card">

              <h2>
                Continue your mission today
              </h2>

              <p>
                12 potential NGOs are waiting
                for surplus food.
              </p>

              <a
                className="white-button"
                href="/donor-dashboard"
              >
                View Active Listings →
              </a>

            </article>

          </aside>

        </section>

        {/* =================================================
            FOOTER IMPACT STRIP
        ================================================= */}

        <section className="impact-footer-strip">

          <div className="footer-impact-icon">
            ♥
          </div>

          <div>

            <span>
              EVERY MEAL MATTERS
            </span>

            <h3>
              Together, we've made a measurable
              difference.
            </h3>

          </div>

          <div className="footer-impact-stats">

            <div>

              <strong>
                {totalMeals}
              </strong>

              <span>
                Meals rescued
              </span>

            </div>

            <div>

              <strong>
                {preventedWasteTons}T
              </strong>

              <span>
                Waste prevented
              </span>

            </div>

            <div>

              <strong>
                {uniqueNGOsCount}
              </strong>

              <span>
                Communities
              </span>

            </div>

          </div>

        </section>

      </div>
    </DashboardLayout>
  );
}
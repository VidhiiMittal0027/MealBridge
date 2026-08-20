import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/react";
import Navbar from "./Navbar";
import FloatingChat from "./FloatingChat";

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("donor");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /* =========================================================
     ROLE
  ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = sessionStorage.getItem("mealbridge-role");
    const metadataRole = user?.unsafeMetadata?.role;

    let activeRole = storedRole || metadataRole;
    if (location.pathname.startsWith("/admin")) {
      activeRole = "admin";
    } else if (location.pathname.startsWith("/receiver") || location.pathname.startsWith("/ngo")) {
      activeRole = "receiver";
    } else if (
      location.pathname.startsWith("/donor") ||
      location.pathname.startsWith("/donate") ||
      location.pathname.startsWith("/food-assessment")
    ) {
      activeRole = "donor";
    } else if (location.pathname.startsWith("/delivery")) {
      activeRole = "delivery";
    } else if (!activeRole) {
      activeRole = "donor";
    }

    setRole(activeRole);
    sessionStorage.setItem("mealbridge-role", activeRole);
  }, [user, location.pathname]);

  /* =========================================================
     CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  ========================================================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await signOut();

      sessionStorage.removeItem("mealbridge-role");

      setIsLogoutConfirmOpen(false);
      setMobileOpen(false);

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /* =========================================================
     ROLE CONFIG
  ========================================================= */

  const roleData = {
    admin: {
      title: "System Admin",
      badge: "ADMIN",
      icon: "🛡️",
      dashboard: "/admin",
    },

    donor: {
      title: "Food Donor",
      badge: "DONOR",
      icon: "🍱",
      dashboard: "/donor-dashboard",
    },

    receiver: {
      title: "Community Partner",
      badge: "RECEIVER",
      icon: "🤝",
      dashboard: "/receiver-dashboard",
    },

    delivery: {
      title: "Delivery Volunteer",
      badge: "VOLUNTEER",
      icon: "🚚",
      dashboard: "/delivery-dashboard",
    },
  };

  const currentRole = roleData[role] || roleData.donor;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const getLinks = () => {
    if (role === "admin") {
      return [
        {
          label: "Overview",
          description: "System & metrics summary",
          href: "/admin",
          icon: "⌂",
        },
        {
          label: "Pending NGO Verifications",
          description: "Review Darpan & 80G",
          href: "/admin/verifications-ngo",
          icon: "🏛️",
        },
        {
          label: "Pending Donor Verifications",
          description: "Review FSSAI licenses",
          href: "/admin/verifications-donor",
          icon: "🍱",
        },
        {
          label: "All Donations",
          description: "Moderate food listings",
          href: "/admin/donations",
          icon: "🍲",
        },
        {
          label: "Orders & Disputes",
          description: "Disputes & resolutions",
          href: "/admin/orders-disputes",
          icon: "⚖️",
        },
        {
          label: "Delivery Agents",
          description: "Fleet & volunteer roster",
          href: "/admin/delivery-agents",
          icon: "🚚",
        },
        {
          label: "Flagged/Suspended Users",
          description: "Trust scores & probation",
          href: "/admin/flagged-users",
          icon: "⛔",
        },
        {
          label: "Reports & Analytics",
          description: "Platform growth metrics",
          href: "/admin/analytics",
          icon: "📊",
        },
        {
          label: "Settings",
          description: "Thresholds & audit log",
          href: "/admin/settings",
          icon: "⚙️",
        },
      ];
    }

    if (role === "donor") {
      return [
        {
          label: "Overview",
          description: "Your donation activity",
          href: "/donor-dashboard",
          icon: "⌂",
        },
        {
          label: "My Listings",
          description: "Manage food listings",
          href: "/donor-dashboard/listings",
          icon: "＋",
        },
        {
          label: "Incoming NGO Requests",
          description: "Review requests",
          href: "/donor-dashboard/requests",
          icon: "◈",
        },
        {
          label: "Order History",
          description: "Past donations",
          href: "/donor-dashboard/history",
          icon: "◷",
        },
        {
          label: "Delivery Status",
          description: "Track active deliveries",
          href: "/donor-dashboard/delivery",
          icon: "🚚",
        },
        {
          label: "Notifications",
          description: "Updates and alerts",
          href: "/donor-dashboard/notifications",
          icon: "🔔",
        },
        {
          label: "Trust & Rating",
          description: "Your donor score",
          href: "/donor-dashboard/trust",
          icon: "⭐",
        },
        {
          label: "Profile & Verification",
          description: "Manage your profile",
          href: "/donor-dashboard/profile",
          icon: "👤",
        },
        {
          label: "Support & Help",
          description: "Get assistance",
          href: "/donor-dashboard/support",
          icon: "❓",
        },
      ];
    }

    if (role === "receiver") {
      return [
        {
          label: "Overview",
          description: "Nearby food & requests",
          href: "/receiver-dashboard",
          icon: "⌂",
        },
        {
          label: "Browse / Matched",
          description: "Find available meals",
          href: "/receiver-dashboard/browse",
          icon: "🍱",
        },
        {
          label: "My Requests",
          description: "Sent, Pending & Accepted",
          href: "/receiver-dashboard/requests",
          icon: "📩",
        },
        {
          label: "Order History",
          description: "Past & completed donations",
          href: "/receiver-dashboard/history",
          icon: "◷",
        },
        {
          label: "Delivery Tracking",
          description: "Incoming pickups & ETA",
          href: "/receiver-dashboard/delivery",
          icon: "🚚",
        },
        {
          label: "Notifications",
          description: "Updates & rescue alerts",
          href: "/receiver-dashboard/notifications",
          icon: "🔔",
        },
        {
          label: "Org Profile & Status",
          description: "Verification & details",
          href: "/receiver-dashboard/profile",
          icon: "🏛️",
        },
        {
          label: "Impact Stats",
          description: "Meals & people served",
          href: "/receiver-dashboard/impact",
          icon: "📊",
        },
        {
          label: "Support / Help",
          description: "Assistance & guides",
          href: "/receiver-dashboard/support",
          icon: "❓",
        },
      ];
    }

    return [
      {
        label: "Overview",
        description: "System & metrics summary",
        href: "/admin",
        icon: "⌂",
      },
      {
        label: "Pending NGO Verifications",
        description: "Review Darpan & 80G",
        href: "/admin/verifications-ngo",
        icon: "🏛️",
      },
      {
        label: "Pending Donor Verifications",
        description: "Review FSSAI licenses",
        href: "/admin/verifications-donor",
        icon: "🍱",
      },
      {
        label: "All Donations",
        description: "Moderate food listings",
        href: "/admin/donations",
        icon: "🍲",
      },
      {
        label: "Orders & Disputes",
        description: "Disputes & resolutions",
        href: "/admin/orders-disputes",
        icon: "⚖️",
      },
      {
        label: "Delivery Agents",
        description: "Fleet & volunteer roster",
        href: "/admin/delivery-agents",
        icon: "🚚",
      },
      {
        label: "Flagged/Suspended Users",
        description: "Trust scores & probation",
        href: "/admin/flagged-users",
        icon: "⛔",
      },
      {
        label: "Reports & Analytics",
        description: "Platform growth metrics",
        href: "/admin/analytics",
        icon: "📊",
      },
      {
        label: "Settings",
        description: "Thresholds & audit log",
        href: "/admin/settings",
        icon: "⚙️",
      },
    ];
  };

  const links = getLinks();

  /* =========================================================
     USER
  ========================================================= */

  const userName =
    user?.fullName ||
    user?.firstName ||
    "Welcome";

  const initial =
    user?.firstName?.[0] ||
    user?.fullName?.[0] ||
    "U";

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="mb-dashboard">

      {/* =====================================================
          PROFESSIONAL DASHBOARD STYLES
      ===================================================== */}

      <style>{`

        /* =====================================================
           ROOT
        ===================================================== */

        .mb-dashboard {
          --mb-navy: #071426;
          --mb-navy-2: #102238;

          --mb-green: #08b486;
          --mb-green-dark: #059b74;

          --mb-teal: #11bfa1;
          --mb-cyan: #2bb9d1;

          --mb-bg: #f5fbfa;

          --mb-text: #0a1a2d;
          --mb-muted: #718198;

          --mb-border: rgba(7, 20, 38, 0.08);

          min-height: 100vh;

          color: var(--mb-text);

          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(8, 180, 134, 0.12),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 20%,
              rgba(43, 185, 209, 0.10),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #f8fdfc 0%,
              #f3fbfb 50%,
              #f7fcfc 100%
            );

          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }


        /* =====================================================
           MAIN LAYOUT
        ===================================================== */

        .mb-dashboard-shell {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 270px minmax(0, 1fr);
          gap: 26px;
          padding: 28px 28px 40px;
          transition: grid-template-columns 0.3s ease;
        }

        .mb-dashboard-shell.collapsed {
          grid-template-columns: 85px minmax(0, 1fr);
        }


        /* =====================================================
           SIDEBAR
        ===================================================== */

        .mb-sidebar {
          position: sticky;

          top: 100px;

          height:
            calc(100vh - 128px);

          min-height: 620px;

          display: flex;

          flex-direction: column;

          overflow: hidden;

          background:
            rgba(255, 255, 255, 0.92);

          border:
            1px solid rgba(7, 20, 38, 0.07);

          border-radius:
            26px;

          box-shadow:
            0 20px 55px rgba(7, 30, 45, 0.08);
          backdrop-filter:
            blur(20px);
          transition: width 0.3s ease;
        }

        .mb-sidebar.collapsed .mb-user-info,
        .mb-sidebar.collapsed .mb-nav-title,
        .mb-sidebar.collapsed .mb-nav-text,
        .mb-sidebar.collapsed .mb-nav-description {
          display: none;
        }

        .mb-sidebar.collapsed .mb-profile {
          flex-direction: column;
          justify-content: center;
          padding: 24px 10px;
        }

        .mb-sidebar.collapsed .mb-nav-link,
        .mb-sidebar.collapsed .mb-logout {
          justify-content: center;
          padding: 12px;
        }

        .mb-sidebar.collapsed .mb-nav-icon {
          margin: 0;
        }


        /* =====================================================
           PROFILE
        ===================================================== */

        .mb-profile {
          padding:
            24px 20px;

          display: flex;

          align-items: center;

          gap: 13px;

          border-bottom:
            1px solid var(--mb-border);

          background:
            linear-gradient(
              135deg,
              rgba(8, 180, 134, 0.09),
              rgba(43, 185, 209, 0.035)
            );

          position: relative;
        }


        .mb-profile::before {
          content: "";

          position: absolute;

          left: 0;
          right: 0;
          top: 0;

          height: 3px;

          background:
            linear-gradient(
              90deg,
              #08b486,
              #11bfa1,
              #2bb9d1
            );
        }


        .mb-avatar {
          width: 48px;
          height: 48px;

          border-radius: 15px;

          object-fit: cover;

          flex-shrink: 0;

          border:
            2px solid white;

          box-shadow:
            0 8px 20px rgba(8, 180, 134, 0.20);
        }


        .mb-avatar-placeholder {
          width: 48px;
          height: 48px;

          display: grid;

          place-items: center;

          flex-shrink: 0;

          border-radius: 15px;

          color: white;

          font-weight: 800;

          font-size: 1rem;

          background:
            linear-gradient(
              135deg,
              #08b486,
              #159fba
            );

          box-shadow:
            0 8px 20px rgba(8, 180, 134, 0.20);
        }


        .mb-user-info {
          min-width: 0;
        }


        .mb-user-name {
          margin: 0;

          overflow: hidden;

          white-space: nowrap;

          text-overflow: ellipsis;

          color:
            var(--mb-navy);

          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;

          font-size:
            0.92rem;

          font-weight:
            800;
        }


        .mb-role {
          display: inline-block;

          margin-top: 5px;

          padding:
            4px 9px;

          border-radius:
            999px;

          color:
            #078b69;

          background:
            rgba(8, 180, 134, 0.10);

          font-size:
            0.62rem;

          font-weight:
            800;

          letter-spacing:
            0.08em;
        }


        /* =====================================================
           SIDEBAR NAV
        ===================================================== */

        .mb-nav {
          flex: 1;
          padding: 22px 13px;
          overflow-y: auto;
        }

        .mb-nav::-webkit-scrollbar {
          width: 4px;
        }
        .mb-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .mb-nav::-webkit-scrollbar-thumb {
          background: rgba(7, 20, 38, 0.1);
          border-radius: 4px;
        }


        .mb-nav-title {
          padding:
            0 13px 12px;

          color:
            #9aa8b7;

          font-size:
            0.63rem;

          font-weight:
            800;

          letter-spacing:
            0.13em;

          text-transform:
            uppercase;
        }


        .mb-nav-link {
          position: relative;

          display: flex;

          align-items: center;

          gap: 12px;

          min-height:
            58px;

          margin-bottom:
            6px;

          padding:
            8px 12px;

          color:
            #718095;

          border-radius:
            15px;

          text-decoration:
            none;

          transition:
            all .22s ease;
        }


        .mb-nav-link:hover {
          color:
            var(--mb-navy);

          background:
            rgba(8, 180, 134, 0.06);

          transform:
            translateX(2px);
        }


        .mb-nav-link.active {
          color:
            var(--mb-navy);

          background:
            linear-gradient(
              135deg,
              rgba(8, 180, 134, 0.13),
              rgba(17, 191, 161, 0.055)
            );
        }


        .mb-nav-link.active::before {
          content: "";

          position: absolute;

          left: 0;

          top: 12px;
          bottom: 12px;

          width: 3px;

          border-radius:
            10px;

          background:
            linear-gradient(
              180deg,
              #08b486,
              #11bfa1
            );
        }


        .mb-nav-icon {
          width: 39px;
          height: 39px;

          display: grid;

          place-items: center;

          flex-shrink: 0;

          border-radius: 12px;

          background:
            #f2f7f8;

          color:
            #718095;

          font-weight:
            700;

          transition:
            all .2s ease;
        }


        .mb-nav-link.active .mb-nav-icon {
          color: white;

          background:
            linear-gradient(
              135deg,
              #08b486,
              #11bfa1
            );

          box-shadow:
            0 8px 18px
            rgba(8, 180, 134, 0.20);
        }


        .mb-nav-text {
          min-width: 0;

          display: flex;

          flex-direction: column;
        }


        .mb-nav-label {
          font-size:
            0.86rem;

          font-weight:
            750;
        }


        .mb-nav-description {
          margin-top: 2px;

          color:
            #9aa7b6;

          font-size:
            0.65rem;
        }


        /* =====================================================
           LOGOUT
        ===================================================== */

        .mb-sidebar-footer {
          padding:
            14px;

          border-top:
            1px solid var(--mb-border);
        }


        .mb-logout {
          width: 100%;

          display: flex;

          align-items: center;

          gap: 12px;

          padding:
            9px 10px;

          border:
            0;

          border-radius:
            14px;

          background:
            transparent;

          color:
            #738196;

          cursor:
            pointer;

          text-align:
            left;

          transition:
            all .2s ease;
        }


        .mb-logout:hover {
          color:
            #c04455;

          background:
            rgba(192, 68, 85, 0.06);
        }


        /* =====================================================
           MAIN CONTENT
        ===================================================== */

        .mb-main {
          min-width: 0;

          width: 100%;

          min-height:
            calc(100vh - 128px);
        }


        .mb-content {
          width: 100%;

          max-width: 1080px;

          margin: 0 auto;

          padding:
            8px 4px 40px;
        }


        /* =====================================================
           COMMON TYPOGRAPHY
        ===================================================== */

        .mb-content h1 {
          margin:
            0 0 10px;

          color:
            var(--mb-navy);

          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;

          font-size:
            clamp(1.8rem, 3vw, 2.6rem);

          line-height:
            1.12;

          font-weight:
            850;

          letter-spacing:
            -0.04em;
        }


        .mb-content h2 {
          margin:
            0 0 16px;

          color:
            var(--mb-navy);

          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;

          font-size:
            1.35rem;

          font-weight:
            800;

          letter-spacing:
            -0.025em;
        }


        .mb-content h3 {
          color:
            var(--mb-navy);

          font-weight:
            800;
        }


        .mb-content p {
          color:
            var(--mb-muted);

          line-height:
            1.65;
        }


        /* =====================================================
           COMMON SECTIONS

           IMPORTANT:
           ImpactDashboard has its own premium section styling,
           so don't force generic cards onto it.
        ===================================================== */

        .mb-content section:not(
          .impact-hero,
          .stats-grid,
          .dashboard-grid,
          .impact-footer-strip
        ),
        .mb-content .dashboard-section,
        .mb-content .section {
          margin-bottom:
            24px;

          padding:
            24px;

          background:
            rgba(255, 255, 255, 0.88);

          border:
            1px solid rgba(7, 20, 38, 0.07);

          border-radius:
            22px;

          box-shadow:
            0 12px 35px rgba(7, 30, 45, 0.045);
        }


        /* =====================================================
           QUICK ACTIONS
        ===================================================== */

        .mb-content .quick-actions,
        .mb-content [class*="quick-actions"] {
          display:
            grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap:
            14px;

          margin:
            0 0 28px;
        }


        .mb-content .quick-actions > *,
        .mb-content [class*="quick-actions"] > * {
          min-width:
            0;

          padding:
            18px;

          border:
            1px solid rgba(8, 180, 134, 0.10);

          border-radius:
            17px;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fdfc
            );

          box-shadow:
            0 8px 25px
            rgba(7, 30, 45, 0.045);

          transition:
            all .2s ease;
        }


        .mb-content .quick-actions > *:hover,
        .mb-content [class*="quick-actions"] > *:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 14px 30px
            rgba(7, 30, 45, 0.08);
        }


        /* =====================================================
           STATS / METRICS
        ===================================================== */

        .mb-content .stats,
        .mb-content .statistics,
        .mb-content .metrics,
        .mb-content .dashboard-stats,
        .mb-content [class*="metric-grid"] {
          display:
            grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap:
            14px;

          margin:
            0 0 28px;
        }


        .mb-content .stats > *,
        .mb-content .statistics > *,
        .mb-content .metrics > *,
        .mb-content .dashboard-stats > *,
        .mb-content [class*="metric-grid"] > * {
          min-width:
            0;

          padding:
            21px;

          background:
            rgba(255, 255, 255, 0.92);

          border:
            1px solid rgba(7, 20, 38, 0.07);

          border-radius:
            19px;

          box-shadow:
            0 10px 28px rgba(7, 30, 45, 0.045);
        }


        /* =====================================================
           GENERIC CARDS
        ===================================================== */

        .mb-content .card,
        .mb-content .dashboard-card,
        .mb-content .stat-card {
          background:
            rgba(255, 255, 255, 0.92);

          border:
            1px solid rgba(7, 20, 38, 0.07);

          border-radius:
            20px;

          box-shadow:
            0 10px 30px rgba(7, 30, 45, 0.05);

          padding:
            22px;
        }


        /* =====================================================
           GENERIC GRIDS

           Avoid overriding ImpactDashboard's own dashboard-grid.
        ===================================================== */

        .mb-content .grid,
        .mb-content .cards-grid {
          display:
            grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap:
            18px;
        }


        /* =====================================================
           BUTTONS
        ===================================================== */

        .mb-content button {
          border-radius:
            12px;

          font-weight:
            700;
        }


        .mb-content button:not(.mb-logout):hover {
          transform:
            translateY(-1px);
        }


        /* =====================================================
           TABLE
        ===================================================== */

        .mb-content table {
          width:
            100%;

          border-collapse:
            separate;

          border-spacing:
            0;

          overflow:
            hidden;

          border:
            1px solid var(--mb-border);

          border-radius:
            16px;

          background:
            white;
        }


        .mb-content th {
          padding:
            14px 16px;

          color:
            #63748a;

          background:
            #f5faf9;

          font-size:
            0.76rem;

          font-weight:
            800;

          text-align:
            left;
        }


        .mb-content td {
          padding:
            15px 16px;

          border-top:
            1px solid var(--mb-border);

          color:
            #53657b;

          font-size:
            0.85rem;
        }


        /* =====================================================
           LOGOUT MODAL
        ===================================================== */

        .mb-logout-modal-backdrop {
          position:
            fixed;

          inset:
            0;

          z-index:
            3000;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          padding:
            20px;

          background:
            rgba(7, 20, 38, 0.48);

          backdrop-filter:
            blur(8px);
        }


        .mb-logout-modal {
          width:
            min(420px, 100%);

          padding:
            30px;

          text-align:
            center;

          background:
            rgba(255, 255, 255, 0.98);

          border:
            1px solid rgba(7, 20, 38, 0.08);

          border-radius:
            24px;

          box-shadow:
            0 30px 80px rgba(7, 20, 38, 0.22);

          animation:
            mbModalIn .22s ease;
        }


        @keyframes mbModalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }


        .mb-logout-modal-icon {
          width:
            62px;

          height:
            62px;

          display:
            grid;

          place-items:
            center;

          margin:
            0 auto 16px;

          border-radius:
            18px;

          background:
            rgba(239, 68, 68, 0.10);

          font-size:
            1.7rem;
        }


        .mb-logout-modal h3 {
          margin:
            0 0 8px;

          color:
            var(--mb-navy);

          font-size:
            1.3rem;

          font-weight:
            850;
        }


        .mb-logout-modal p {
          margin:
            0 0 24px;

          color:
            var(--mb-muted);

          font-size:
            .9rem;

          line-height:
            1.6;
        }


        .mb-logout-modal-actions {
          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            12px;
        }


        .mb-modal-cancel,
        .mb-modal-confirm {
          min-height:
            46px;

          border:
            0;

          border-radius:
            12px;

          cursor:
            pointer;

          font-weight:
            800;

          transition:
            all .2s ease;
        }


        .mb-modal-cancel {
          color:
            #52647a;

          background:
            #eef4f4;
        }


        .mb-modal-cancel:hover {
          background:
            #e5eded;
        }


        .mb-modal-confirm {
          color:
            white;

          background:
            linear-gradient(
              135deg,
              #ef4444,
              #b91c1c
            );

          box-shadow:
            0 8px 20px
            rgba(185, 28, 28, .18);
        }


        .mb-modal-confirm:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 12px 26px
            rgba(185, 28, 28, .24);
        }


        /* =====================================================
           MOBILE BUTTON
        ===================================================== */

        .mb-mobile-button {
          display:
            none;

          position:
            fixed;

          top:
            92px;

          left:
            14px;

          z-index:
            100;

          width:
            45px;

          height:
            45px;

          border:
            1px solid rgba(8, 180, 134, 0.12);

          border-radius:
            14px;

          background:
            rgba(255,255,255,.95);

          color:
            var(--mb-navy);

          box-shadow:
            0 10px 30px rgba(7,30,45,.10);

          font-size:
            1.2rem;

          cursor:
            pointer;
        }


        /* =====================================================
           OVERLAY
        ===================================================== */

        .mb-overlay {
          display:
            none;

          position:
            fixed;

          inset:
            0;

          z-index:
            90;

          background:
            rgba(7,20,38,.35);

          backdrop-filter:
            blur(3px);
        }


        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1100px) {

          .mb-dashboard-shell {
            grid-template-columns:
              240px minmax(0,1fr);

            padding:
              22px;

            gap:
              20px;
          }


          .mb-content .quick-actions,
          .mb-content [class*="quick-actions"] {
            grid-template-columns:
              repeat(2,1fr);
          }


          .mb-content .stats,
          .mb-content .statistics,
          .mb-content .metrics,
          .mb-content .dashboard-stats {
            grid-template-columns:
              repeat(2,1fr);
          }

        }


        @media (max-width: 760px) {

          .mb-dashboard-shell {
            display:
              block;

            padding:
              14px;
          }


          .mb-mobile-button {
            display:
              grid;

            place-items:
              center;
          }


          .mb-overlay {
            display:
              block;

            opacity:
              0;

            visibility:
              hidden;

            pointer-events:
              none;

            transition:
              all .25s ease;
          }


          .mb-overlay.show {
            opacity:
              1;

            visibility:
              visible;

            pointer-events:
              auto;
          }


          .mb-sidebar {
            position:
              fixed;

            top:
              0;

            left:
              0;

            bottom:
              0;

            width:
              min(300px, 88vw);

            height:
              100vh;

            min-height:
              100vh;

            border-radius:
              0 25px 25px 0;

            transform:
              translateX(-105%);

            transition:
              transform .3s ease;

            z-index:
              101;
          }


          .mb-sidebar.open {
            transform:
              translateX(0);
          }


          .mb-main {
            padding-top:
              48px;
          }


          .mb-content {
            padding:
              0 0 30px;
          }


          .mb-content .quick-actions,
          .mb-content [class*="quick-actions"] {
            grid-template-columns:
              1fr 1fr;
          }


          .mb-content .grid,
          .mb-content .cards-grid {
            grid-template-columns:
              1fr;
          }

        }


        @media (max-width: 500px) {

          .mb-content .quick-actions,
          .mb-content [class*="quick-actions"],
          .mb-content .stats,
          .mb-content .statistics,
          .mb-content .metrics,
          .mb-content .dashboard-stats {
            grid-template-columns:
              1fr;
          }


          .mb-content section:not(
            .impact-hero,
            .stats-grid,
            .dashboard-grid,
            .impact-footer-strip
          ),
          .mb-content .dashboard-section,
          .mb-content .section {
            padding:
              18px;
          }


          .mb-logout-modal {
            padding:
              24px;
          }

        }

        @media (max-width: 1080px) {
          .mb-dashboard-shell.collapsed {
            grid-template-columns: 1fr;
          }
          
          .mb-sidebar.collapsed {
            width: 290px;
          }
          
          .mb-sidebar.collapsed .mb-user-info,
          .mb-sidebar.collapsed .mb-nav-title,
          .mb-sidebar.collapsed .mb-nav-text,
          .mb-sidebar.collapsed .mb-nav-description {
            display: block;
          }
          
          .mb-sidebar.collapsed .mb-profile {
            flex-direction: row;
            justify-content: flex-start;
            padding: 24px 20px;
          }
          
          .mb-sidebar.collapsed .mb-nav-link,
          .mb-sidebar.collapsed .mb-logout {
            justify-content: flex-start;
            padding: 8px 12px;
          }

          .mb-profile button {
            display: none !important;
          }
        }
      `}</style>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />


      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        className="mb-mobile-button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open dashboard menu"
        type="button"
      >
        ☰
      </button>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <div
        className={`mb-overlay ${
          mobileOpen ? "show" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      />


      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <div className={`mb-dashboard-shell ${isSidebarCollapsed ? "collapsed" : ""}`}>


        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside
          className={`mb-sidebar ${mobileOpen ? "open" : ""} ${isSidebarCollapsed ? "collapsed" : ""}`}
        >

          {/* PROFILE */}

          <div className="mb-profile">

            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="mb-avatar"
              />
            ) : (
              <div className="mb-avatar-placeholder">
                {initial.toUpperCase()}
              </div>
            )}

            <div className="mb-user-info">

              <div className="mb-user-name">
                {userName}
              </div>

              <span className="mb-role">
                {currentRole.badge}
              </span>

            </div>

            <button 
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                marginLeft: isSidebarCollapsed ? 0 : 'auto',
                marginTop: isSidebarCollapsed ? 10 : 0,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#08b486',
                display: 'grid',
                placeItems: 'center',
                padding: '6px',
                borderRadius: '8px',
              }}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? "▶" : "◀"}
            </button>
          </div>


          {/* NAVIGATION */}

          <nav className="mb-nav">

            <div className="mb-nav-title">
              Workspace
            </div>

            {links.map((link) => {

              const active =
                location.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`mb-nav-link ${
                    active ? "active" : ""
                  }`}
                  title={isSidebarCollapsed ? link.label : ""}
                >

                  <span className="mb-nav-icon">
                    {link.icon}
                  </span>

                  <span className="mb-nav-text">

                    <span className="mb-nav-label">
                      {link.label}
                    </span>

                    <span className="mb-nav-description">
                      {link.description}
                    </span>

                  </span>

                </Link>
              );
            })}

          </nav>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <div className="mb-sidebar-footer">

            <button
              className="mb-logout"
              onClick={() =>
                setIsLogoutConfirmOpen(true)
              }
              type="button"
              title={isSidebarCollapsed ? "Log Out" : ""}
            >

              <span className="mb-nav-icon">
                ↪
              </span>

              <span className="mb-nav-text">

                <span className="mb-nav-label">
                  Log Out
                </span>

                <span className="mb-nav-description">
                  End your session
                </span>

              </span>

            </button>

          </div>

        </aside>


        {/* ===================================================
            MAIN DASHBOARD
        =================================================== */}

        <main className="mb-main">

          <div className="mb-content">

            {children}

          </div>

        </main>

      </div>


      {/* =====================================================
          CHAT
      ===================================================== */}

      <FloatingChat />


      {/* =====================================================
          LOGOUT CONFIRMATION MODAL
      ===================================================== */}

      {isLogoutConfirmOpen && (
        <div
          className="mb-logout-modal-backdrop"
          onClick={() =>
            setIsLogoutConfirmOpen(false)
          }
        >

          <div
            className="mb-logout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mb-logout-modal-icon">
              🚪
            </div>

            <h3>
              Confirm Log Out
            </h3>

            <p>
              Are you sure you want to log out of
              your MealBridge account?
            </p>

            <div className="mb-logout-modal-actions">

              <button
                className="mb-modal-cancel"
                onClick={() =>
                  setIsLogoutConfirmOpen(false)
                }
                type="button"
              >
                Cancel
              </button>

              <button
                className="mb-modal-confirm"
                onClick={handleLogout}
                type="button"
              >
                Log Out
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
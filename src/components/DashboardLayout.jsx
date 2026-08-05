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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("mealbridge-role");
      if (storedRole) setRole(storedRole);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mealbridge-role");
    }
    navigate("/");
  };

  const getLinks = () => {
    if (role === "donor") {
      return [
        { label: "Overview", href: "/donor-dashboard", icon: "📊" },
        { label: "List Surplus", href: "/donate-food", icon: "🍱" },
        { label: "Impact Tracker", href: "/impact-dashboard", icon: "🌱" },
      ];
    }
    if (role === "receiver") {
      return [
        { label: "Overview", href: "/receiver-dashboard", icon: "🏘️" },
        { label: "Available Food", href: "/ngo-matching", icon: "🍱" },
        { label: "Impact Tracker", href: "/impact-dashboard", icon: "🌱" },
      ];
    }
    // delivery / volunteer
    return [
      { label: "Overview", href: "/delivery-dashboard", icon: "🚚" },
      { label: "Impact Tracker", href: "/impact-dashboard", icon: "🌱" },
    ];
  };

  const links = getLinks();

  return (
    <div className="app-layout">
      {/* Top Common Navbar */}
      <Navbar />

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-profile">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.fullName || "Avatar"} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.firstName?.[0] || "U"}
              </div>
            )}
            <div className="profile-info">
              <h4 className="profile-name">{user?.fullName || "Welcome!"}</h4>
              <span className="profile-role">{role.toUpperCase()}</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`sidebar-link ${location.pathname === link.href ? "active" : ""}`}
              >
                <span className="link-icon">{link.icon}</span>
                <span className="link-label">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="link-icon">🚪</span>
              <span className="link-label">Log Out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Panel */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Chat System */}
      <FloatingChat />
    </div>
  );
}

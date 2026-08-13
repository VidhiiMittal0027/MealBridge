import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Show, useUser, useClerk } from "@clerk/react";
import { MealBridgeContext } from "../context/MealBridgeContext";

const navItems = [
  { label: "Home", href: "/#hero" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const { notifications, clearNotifications } = useContext(MealBridgeContext);

  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const [role, setRole] = useState("donor");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("mealbridge-role");
      if (storedRole) setRole(storedRole);
    }
  }, [user]);

  const openRoleModal = (mode) => {
    setAuthMode(mode);
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const confirmRole = () => {
    if (!selectedRole) return;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mealbridge-role", selectedRole);
    }
    closeRoleModal();
    if (selectedRole === "receiver") {
      navigate("/receiver");
    } else {
      navigate(authMode === "signup" ? "/register" : "/login");
    }
  };

  const getDashboardLink = () => {
    const storedRole = typeof window !== "undefined" 
      ? (sessionStorage.getItem("mealbridge-role") || user?.unsafeMetadata?.role) 
      : user?.unsafeMetadata?.role;
    if (storedRole === "donor") return "/donor-dashboard";
    if (storedRole === "receiver") return "/receiver-dashboard";
    if (storedRole === "delivery") return "/delivery-dashboard";
    return "/select-role";
  };

  const handleLogout = async () => {
    await signOut();
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mealbridge-role");
    }
    navigate("/");
  };

  const handleNotifClick = (notif) => {
    notif.unread = false;
    if (notif.targetId) {
      sessionStorage.setItem("mealbridge-open-order", notif.targetId);
      setShowNotifMenu(false);
      navigate(getDashboardLink());
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 24);
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Filter notifications for active user role
  const roleNotifs = notifications.filter(not => not.role === role);
  const unreadCount = roleNotifs.filter(not => not.unread).length;

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${!isVisible ? "navbar-hidden" : ""}`}>
        <div className="navbar-inner">
          {/* <Link className="brand" to="/">
            <img src="/images/logo.png" alt="MealBridge Logo" className="brand-mark" style={{ width: "auto", height: "56px", objectFit: "contain", background: "none", border: "none", boxShadow: "none" }} />
            <span className="brand-text">MealBridge</span>
          </Link> */}
          <Link className="brand" to="/" style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
  <img 
    src="/images/logo.png" 
    alt="MealBridge Logo" 
    className="brand-mark" 
    style={{ 
      width: "auto", 
      height: "56px", 
      objectFit: "contain", 
      background: "transparent", 
      border: "none", 
      boxShadow: "none",
      mixBlendMode: "multiply" // Blends the white background box into the navbar
    }} 
  />
  <span 
    className="brand-text"
    style={{
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      fontSize: "28px",
      fontWeight: "700",
      letterSpacing: "0.5px",
      background: "linear-gradient(135deg, #e65100 0%, #1565c0 100%)", // Ombre gradient matching logo colors
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block"
    }}
  >
    MealBridge
  </span>
</Link>

          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.label} className="nav-link" href={item.href}>
                {item.label}
              </a>
            ))}
            <Show when="signed-in">
              <Link className="nav-link" to={getDashboardLink()}>
                Dashboard
              </Link>
            </Show>
          </div>

          <div className="nav-actions">
            <Show when="signed-in">
              {/* Notification Bell */}
              <div className="notif-dropdown-container">
                <button 
                  className="icon-action-btn" 
                  onClick={() => {
                    setShowNotifMenu(!showNotifMenu);
                    setShowUserMenu(false);
                    if (!showNotifMenu) {
                      clearNotifications(role);
                    }
                  }}
                >
                  🔔
                  {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>
                {showNotifMenu && (
                  <div className="notif-dropdown-menu">
                    <div className="dropdown-header">
                      <h3>Notifications</h3>
                    </div>
                    <hr />
                     <div className="notif-list">
                      {roleNotifs.length === 0 ? (
                        <p className="empty-notifs">No new notifications</p>
                      ) : (
                        roleNotifs.map((n) => (
                          <div 
                            key={n.id} 
                            className={`notif-item ${n.type}`}
                            style={{ cursor: n.targetId ? "pointer" : "default" }}
                            onClick={() => handleNotifClick(n)}
                          >
                            <div className="notif-icon">
                              {n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}
                            </div>
                            <div className="notif-body">
                              <h4>{n.title}</h4>
                              <p>{n.message}</p>
                              <span className="notif-time">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Icon Shortcut */}
              <button 
                className="icon-action-btn"
                onClick={() => {
                  const chatBtn = document.getElementById("floating-chat-trigger");
                  if (chatBtn) chatBtn.click();
                }}
              >
                💬
              </button>

              {/* User Dropdown Profile */}
              <div className="user-dropdown-container">
                <button 
                  className="avatar-btn" 
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                  }}
                >
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Avatar" className="user-avatar-img" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user?.firstName?.[0] || "U"}
                    </div>
                  )}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <div className="dropdown-profile-header">
                      <h4>{user?.fullName || "Welcome!"}</h4>
                      <p>{user?.primaryEmailAddress?.emailAddress || "Verified User"}</p>
                    </div>
                    <hr />
                    <button className="dropdown-item" onClick={() => { setShowUserMenu(false); alert("Profile settings are managed via Clerk."); }}>
                      👤 Profile
                    </button>
                    <button className="dropdown-item" onClick={() => { setShowUserMenu(false); alert("Account configuration is active."); }}>
                      ⚙️ Settings
                    </button>
                    <hr />
                    <button className="dropdown-item logout-item" onClick={() => { setShowUserMenu(false); handleLogout(); }}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </Show>
            <Show when="signed-out">
              <button className="ghost-button" onClick={() => openRoleModal("signin")}>Sign In</button>
              <button className="primary-button" onClick={() => openRoleModal("signup")}>Get Started</button>
            </Show>
          </div>
        </div>
      </nav>

      {isModalOpen ? (
        <div className="modal-backdrop" onClick={closeRoleModal}>
          <div className="role-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{authMode === "signup" ? "Create your account" : "Sign in to your account"}</h3>
            <p>Select one of the roles below to continue with authentication.</p>
            <div className="role-grid">
              <button className={`role-card-modal ${selectedRole === "donor" ? "active" : ""}`} onClick={() => setSelectedRole("donor")}>Donor</button>
              <button className={`role-card-modal ${selectedRole === "receiver" ? "active" : ""}`} onClick={() => setSelectedRole("receiver")}>Receiver</button>
              <button className={`role-card-modal ${selectedRole === "delivery" ? "active" : ""}`} onClick={() => setSelectedRole("delivery")}>Delivery Agent</button>
            </div>
            <div className="role-actions">
              <button className="cancel" onClick={closeRoleModal}>Cancel</button>
              <button className="confirm" onClick={confirmRole} disabled={!selectedRole}>
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
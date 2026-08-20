import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Show, useUser, useClerk } from "@clerk/react";
import { MealBridgeContext } from "../context/MealBridgeContext";
import { supabase } from "../supabase";

/* =========================================================
   MEALBRIDGE — PREMIUM NAVBAR
   Self-contained: NO Navbar.css required
   ========================================================= */

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

  const context = useContext(MealBridgeContext) || {};

  const notifications = context.notifications || [];
  const clearNotifications =
    context.clearNotifications || (() => {});

  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState("signin");

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [role, setRole] = useState("donor");
  const [isAdmin, setIsAdmin] = useState(false);

  /* =========================================================
     LOAD ROLE & ADMIN STATUS
     ========================================================= */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedRole = sessionStorage.getItem("mealbridge-role");
    const clerkRole = user?.unsafeMetadata?.role || user?.publicMetadata?.role;

    if (storedRole) {
      setRole(storedRole);
    } else if (clerkRole) {
      setRole(clerkRole);
    }

    const checkAdmin = async () => {
      if (clerkRole === "admin" || storedRole === "admin") {
        setIsAdmin(true);
        return;
      }

      if (user?.id && supabase) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!error && data?.role === "admin") {
            setIsAdmin(true);
            return;
          }
        } catch (err) {
          console.warn("Supabase admin role check notice:", err);
        }
      }

      setIsAdmin(false);
    };

    if (user) {
      checkAdmin();
    } else {
      setIsAdmin(storedRole === "admin");
    }
  }, [user]);

  /* =========================================================
     SCROLL BEHAVIOR
     ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 100
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  /* =========================================================
     ROLE MODAL
     ========================================================= */

  const openRoleModal = (mode) => {
    setAuthMode(mode);
    setSelectedRole(null);
    setShowMobileMenu(false);
    setIsModalOpen(true);
  };

  const closeRoleModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const confirmRole = () => {
    if (!selectedRole) return;

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "mealbridge-role",
        selectedRole
      );
    }

    setRole(selectedRole);
    closeRoleModal();

    navigate(
      authMode === "signup"
        ? "/register"
        : "/login"
    );
  };

  /* =========================================================
     DASHBOARD ROUTING
     ========================================================= */

  const getDashboardLink = () => {
    const storedRole =
      typeof window !== "undefined"
        ? sessionStorage.getItem("mealbridge-role")
        : null;

    const clerkRole = user?.unsafeMetadata?.role;

    const currentRole = storedRole || clerkRole;

    if (currentRole === "admin") {
      return "/admin";
    }

    if (currentRole === "donor") {
      return "/donor-dashboard";
    }

    if (currentRole === "receiver") {
      return "/receiver-dashboard";
    }

    if (currentRole === "delivery") {
      return "/delivery-dashboard";
    }

    return "/select-role";
  };

  /* =========================================================
     LOGOUT
     ========================================================= */

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("mealbridge-role");
      sessionStorage.removeItem("mealbridge-open-order");
    }

    setShowUserMenu(false);
    setShowNotifMenu(false);
    setShowMobileMenu(false);

    navigate("/");
  };

  /* =========================================================
     NOTIFICATIONS
     ========================================================= */

  const roleNotifs = notifications.filter(
    (notification) =>
      !notification.role ||
      notification.role === role
  );

  const unreadCount = roleNotifs.filter(
    (notification) => notification.unread
  ).length;

  const handleNotifClick = (notif) => {
    if (notif.unread) {
      notif.unread = false;
    }

    if (notif.targetId) {
      sessionStorage.setItem(
        "mealbridge-open-order",
        notif.targetId
      );

      setShowNotifMenu(false);
      navigate(getDashboardLink());
    }
  };

  /* =========================================================
     CLOSE MENUS WHEN CLICKING OUTSIDE
     ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;

      if (
        !target.closest(".mb-user-container") &&
        !target.closest(".mb-notification-container")
      ) {
        setShowUserMenu(false);
        setShowNotifMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     STYLES
     ========================================================= */

  const styles = `
    /* =====================================================
       NAVBAR
       ===================================================== */

    .mb-navbar {
      position: relative;
      margin: 18px auto 0 auto;

      width: min(1180px, calc(100% - 36px));
      height: 72px;

      z-index: 9999;

      background: rgba(255, 255, 255, 0.82);

      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);

      border: 1px solid rgba(15, 23, 42, 0.07);
      border-radius: 22px;

      box-shadow:
        0 10px 35px rgba(15, 23, 42, 0.07),
        0 2px 8px rgba(15, 23, 42, 0.03);

      transition:
        width 0.35s ease,
        top 0.35s ease,
        opacity 0.35s ease,
        transform 0.35s ease,
        box-shadow 0.35s ease;
    }

    .mb-navbar.scrolled {
      top: 12px;

      width: min(1220px, calc(100% - 28px));

      background: rgba(255, 255, 255, 0.94);

      box-shadow:
        0 18px 55px rgba(15, 23, 42, 0.11),
        0 4px 15px rgba(15, 23, 42, 0.05);
    }

    .mb-navbar.hidden {
      transform: translate(-50%, -120%);
      opacity: 0;
      pointer-events: none;
    }

    .mb-navbar-inner {
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 0 12px 0 18px;

      box-sizing: border-box;
    }

    /* =====================================================
       BRAND
       ===================================================== */

    .mb-brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;

      text-decoration: none;

      flex-shrink: 0;
    }

    .mb-brand-logo {
      width: auto;
      height: 56px;

      object-fit: contain;

      background: transparent;
      border: none;
      box-shadow: none;

      mix-blend-mode: multiply;

      transition:
        transform 0.25s ease,
        filter 0.25s ease;
    }

    .mb-brand:hover .mb-brand-logo {
      transform: translateY(-1px) scale(1.02);
      filter: brightness(1.03);
    }

    .mb-brand-text {
      font-family:
        "Poppins",
        "Segoe UI",
        sans-serif;

      font-size: 28px;
      font-weight: 700;

      letter-spacing: 0.5px;

      background:
        linear-gradient(
          135deg,
          #e65100 0%,
          #1565c0 100%
        );

      -webkit-background-clip: text;
      background-clip: text;

      -webkit-text-fill-color: transparent;

      display: inline-block;
    }

    /* =====================================================
       NAV LINKS
       ===================================================== */

    .mb-nav-links {
      display: flex;
      align-items: center;

      gap: 4px;

      margin-left: 20px;
      margin-right: auto;
    }

    .mb-nav-link {
      position: relative;

      display: inline-flex;
      align-items: center;

      height: 42px;

      padding: 0 14px;

      border-radius: 12px;

      color: #667085;

      text-decoration: none;

      font-size: 14px;
      font-weight: 650;

      transition:
        color 0.2s ease,
        background 0.2s ease,
        transform 0.2s ease;
    }

    .mb-nav-link:hover {
      color: #111827;

      background:
        rgba(16, 185, 129, 0.07);

      transform: translateY(-1px);
    }

    .mb-nav-link::after {
      content: "";

      position: absolute;

      left: 14px;
      right: 14px;

      bottom: 5px;

      height: 2px;

      border-radius: 999px;

      background:
        linear-gradient(
          90deg,
          #10b981,
          #06b6d4
        );

      transform: scaleX(0);
      transform-origin: center;

      transition:
        transform 0.25s ease;
    }

    .mb-nav-link:hover::after {
      transform: scaleX(1);
    }

    /* =====================================================
       RIGHT ACTIONS
       ===================================================== */

    .mb-nav-actions {
      display: flex;
      align-items: center;

      gap: 8px;

      flex-shrink: 0;
    }

    .mb-icon-btn {
      position: relative;

      width: 40px;
      height: 40px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 1px solid
        rgba(15, 23, 42, 0.07);

      border-radius: 12px;

      background:
        rgba(248, 250, 252, 0.8);

      cursor: pointer;

      font-size: 16px;

      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
    }

    .mb-icon-btn:hover {
      transform: translateY(-2px);

      background: white;

      border-color:
        rgba(16, 185, 129, 0.22);

      box-shadow:
        0 8px 20px
        rgba(15, 23, 42, 0.08);
    }

    /* =====================================================
       NOTIFICATION BADGE
       ===================================================== */

    .mb-notif-badge {
      position: absolute;

      top: -4px;
      right: -4px;

      min-width: 17px;
      height: 17px;

      padding: 0 4px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 999px;

      background: #ef4444;

      color: white;

      font-size: 9px;
      font-weight: 800;

      border: 2px solid white;

      box-shadow:
        0 3px 8px
        rgba(239, 68, 68, 0.25);
    }

    /* =====================================================
       PROFILE
       ===================================================== */

    .mb-avatar-btn {
      width: 42px;
      height: 42px;

      padding: 0;

      border: 2px solid white;

      border-radius: 50%;

      background: #f1f5f9;

      cursor: pointer;

      overflow: hidden;

      box-shadow:
        0 0 0 1px rgba(15, 23, 42, 0.08),
        0 5px 15px rgba(15, 23, 42, 0.08);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .mb-avatar-btn:hover {
      transform: translateY(-2px);

      box-shadow:
        0 0 0 2px
        rgba(16, 185, 129, 0.2),
        0 8px 20px
        rgba(15, 23, 42, 0.1);
    }

    .mb-avatar-img {
      width: 100%;
      height: 100%;

      object-fit: cover;
    }

    .mb-avatar-placeholder {
      width: 100%;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        linear-gradient(
          135deg,
          #10b981,
          #06b6d4
        );

      color: white;

      font-size: 14px;
      font-weight: 800;
    }

    /* =====================================================
       SIGN IN / GET STARTED
       ===================================================== */

    .mb-ghost-btn {
      height: 42px;

      padding: 0 15px;

      border: none;

      background: transparent;

      border-radius: 12px;

      color: #475467;

      font-size: 14px;
      font-weight: 700;

      cursor: pointer;

      transition:
        color 0.2s ease,
        background 0.2s ease;
    }

    .mb-ghost-btn:hover {
      color: #111827;
      background: #f8fafc;
    }

    .mb-start-btn {
      position: relative;

      height: 44px;

      padding: 0 18px;

      border: none;

      border-radius: 13px;

      background:
        linear-gradient(
          135deg,
          #10b981,
          #059669
        );

      color: white;

      font-size: 14px;
      font-weight: 800;

      cursor: pointer;

      box-shadow:
        0 8px 22px
        rgba(16, 185, 129, 0.2);

      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
    }

    .mb-start-btn:hover {
      transform: translateY(-2px);

      box-shadow:
        0 13px 30px
        rgba(16, 185, 129, 0.3);
    }

    /* =====================================================
       DROPDOWN
       ===================================================== */

    .mb-dropdown {
      position: absolute;

      top: calc(100% + 12px);
      right: 0;

      width: 330px;

      padding: 10px;

      background:
        rgba(255, 255, 255, 0.97);

      border:
        1px solid
        rgba(15, 23, 42, 0.07);

      border-radius: 18px;

      box-shadow:
        0 25px 70px
        rgba(15, 23, 42, 0.14),
        0 5px 20px
        rgba(15, 23, 42, 0.06);

      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);

      animation:
        mbDropIn 0.2s ease;
    }

    @keyframes mbDropIn {
      from {
        opacity: 0;
        transform:
          translateY(-7px)
          scale(0.98);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }

    .mb-dropdown-header {
      padding: 13px 13px 10px;
    }

    .mb-dropdown-header h3 {
      margin: 0;

      font-size: 15px;
      font-weight: 800;

      color: #101828;
    }

    .mb-profile-name {
      margin: 0 0 3px;

      color: #101828;

      font-size: 15px;
      font-weight: 800;
    }

    .mb-profile-email {
      margin: 0;

      color: #98a2b3;

      font-size: 12px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mb-divider {
      height: 1px;

      margin: 5px 3px;

      background: #eef2f6;
    }

    .mb-dropdown-item {
      width: 100%;

      display: flex;
      align-items: center;

      gap: 11px;

      padding: 11px 12px;

      border: none;

      border-radius: 11px;

      background: transparent;

      color: #475467;

      font-size: 13px;
      font-weight: 650;

      text-align: left;

      cursor: pointer;

      transition:
        background 0.2s ease,
        color 0.2s ease;
    }

    .mb-dropdown-item:hover {
      background: #f8fafc;
      color: #101828;
    }

    .mb-dropdown-item.logout:hover {
      background: #fff1f2;
      color: #dc2626;
    }

    /* =====================================================
       NOTIFICATION ITEMS
       ===================================================== */

    .mb-notif-list {
      max-height: 360px;

      overflow-y: auto;
    }

    .mb-notif-item {
      display: flex;

      gap: 11px;

      padding: 12px;

      border-radius: 12px;

      transition:
        background 0.2s ease;
    }

    .mb-notif-item:hover {
      background: #f8fafc;
    }

    .mb-notif-icon {
      width: 34px;
      height: 34px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 10px;

      background: #f0fdf4;

      font-size: 14px;
    }

    .mb-notif-body {
      min-width: 0;
    }

    .mb-notif-body h4 {
      margin: 0 0 3px;

      color: #101828;

      font-size: 13px;
      font-weight: 750;
    }

    .mb-notif-body p {
      margin: 0;

      color: #667085;

      font-size: 12px;

      line-height: 1.5;
    }

    .mb-notif-time {
      display: block;

      margin-top: 5px;

      color: #98a2b3;

      font-size: 10px;
    }

    .mb-empty {
      padding: 35px 15px;

      text-align: center;

      color: #98a2b3;

      font-size: 13px;
    }

    /* =====================================================
       MOBILE BUTTON
       ===================================================== */

    .mb-mobile-toggle {
      display: none;

      width: 42px;
      height: 42px;

      align-items: center;
      justify-content: center;

      border:
        1px solid
        rgba(15, 23, 42, 0.07);

      border-radius: 12px;

      background: #f8fafc;

      cursor: pointer;

      font-size: 20px;
    }

    /* =====================================================
       MOBILE MENU
       ===================================================== */

    .mb-mobile-menu {
      position: absolute;

      top: calc(100% + 10px);

      left: 0;
      right: 0;

      padding: 10px;

      background:
        rgba(255, 255, 255, 0.98);

      border:
        1px solid
        rgba(15, 23, 42, 0.07);

      border-radius: 18px;

      box-shadow:
        0 25px 60px
        rgba(15, 23, 42, 0.13);

      animation:
        mbMobileIn 0.2s ease;
    }

    @keyframes mbMobileIn {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .mb-mobile-link {
      display: block;

      padding: 13px 14px;

      border-radius: 11px;

      color: #475467;

      text-decoration: none;

      font-size: 14px;
      font-weight: 700;
    }

    .mb-mobile-link:hover {
      background: #f8fafc;
      color: #101828;
    }

    .mb-mobile-actions {
      display: flex;

      gap: 8px;

      padding: 8px 5px 3px;
    }

    .mb-mobile-actions button {
      flex: 1;
    }

    /* =====================================================
       ROLE MODAL
       ===================================================== */

    .mb-modal-backdrop {
      position: fixed;

      inset: 0;

      z-index: 10000;

      display: flex;

      align-items: center;
      justify-content: center;

      padding: 20px;

      background:
        rgba(15, 23, 42, 0.48);

      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .mb-role-modal {
      position: relative;

      width: min(500px, 100%);

      padding: 30px;

      background:
        rgba(255, 255, 255, 0.98);

      border:
        1px solid
        rgba(255, 255, 255, 0.8);

      border-radius: 24px;

      box-shadow:
        0 35px 100px
        rgba(15, 23, 42, 0.25);

      animation:
        mbModalIn 0.25s ease;
    }

    @keyframes mbModalIn {
      from {
        opacity: 0;

        transform:
          translateY(15px)
          scale(0.96);
      }

      to {
        opacity: 1;

        transform:
          translateY(0)
          scale(1);
      }
    }

    .mb-modal-close {
      position: absolute;

      top: 15px;
      right: 15px;

      width: 34px;
      height: 34px;

      border: none;

      border-radius: 50%;

      background: #f8fafc;

      color: #667085;

      font-size: 20px;

      cursor: pointer;
    }

    .mb-modal-icon {
      width: 54px;
      height: 54px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 16px;

      border-radius: 16px;

      background:
        linear-gradient(
          135deg,
          #ecfdf5,
          #cffafe
        );

      font-size: 24px;
    }

    .mb-role-modal h3 {
      margin: 0 0 8px;

      color: #101828;

      font-size: 24px;
      font-weight: 850;

      letter-spacing: -0.6px;
    }

    .mb-role-modal-description {
      margin: 0 0 22px;

      color: #667085;

      font-size: 14px;

      line-height: 1.6;
    }

    .mb-role-grid {
      display: grid;

      grid-template-columns:
        repeat(3, 1fr);

      gap: 10px;
    }

    .mb-role-card {
      padding: 17px 10px;

      border:
        1px solid
        #e4e7ec;

      border-radius: 15px;

      background: white;

      color: #475467;

      font-size: 13px;
      font-weight: 750;

      cursor: pointer;

      transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease,
        box-shadow 0.2s ease;
    }

    .mb-role-card:hover {
      transform: translateY(-2px);

      border-color: #a7f3d0;
    }

    .mb-role-card.active {
      background:
        linear-gradient(
          135deg,
          #ecfdf5,
          #f0fdfa
        );

      border-color: #10b981;

      color: #047857;

      box-shadow:
        0 8px 22px
        rgba(16, 185, 129, 0.12);
    }

    .mb-modal-actions {
      display: flex;

      justify-content: flex-end;

      gap: 10px;

      margin-top: 25px;
    }

    .mb-cancel {
      padding: 11px 17px;

      border:
        1px solid
        #e4e7ec;

      border-radius: 11px;

      background: white;

      color: #667085;

      font-weight: 700;

      cursor: pointer;
    }

    .mb-confirm {
      padding: 11px 20px;

      border: none;

      border-radius: 11px;

      background: #10b981;

      color: white;

      font-weight: 800;

      cursor: pointer;

      transition:
        transform 0.2s ease,
        opacity 0.2s ease;
    }

    .mb-confirm:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .mb-confirm:disabled {
      opacity: 0.45;

      cursor: not-allowed;
    }

    /* =====================================================
       RESPONSIVE
       ===================================================== */

    @media (max-width: 950px) {
      .mb-nav-links {
        gap: 0;
        margin-left: 5px;
      }

      .mb-nav-link {
        padding: 0 9px;
        font-size: 13px;
      }

      .mb-brand-text {
        display: none;
      }
    }

    @media (max-width: 760px) {
      .mb-navbar {
        top: 10px;

        width:
          calc(100% - 20px);

        height: 64px;

        border-radius: 18px;
      }

      .mb-navbar.scrolled {
        top: 8px;

        width:
          calc(100% - 14px);
      }

      .mb-navbar-inner {
        padding:
          0 9px 0 11px;
      }

      .mb-nav-links {
        display: none;
      }

      .mb-nav-actions {
        margin-left: auto;
      }

      .mb-mobile-toggle {
        display: flex;
      }

      .mb-icon-btn {
        display: none;
      }

      .mb-start-btn,
      .mb-ghost-btn {
        display: none;
      }

      .mb-dropdown {
        right: -5px;

        width:
          min(
            330px,
            calc(100vw - 35px)
          );
      }

      .mb-role-grid {
        grid-template-columns: 1fr;
      }

      .mb-role-modal {
        padding: 24px;
      }

      .mb-brand-logo {
        height: 50px;
      }

      .mb-brand-text {
        display: inline-block;

        font-size: 22px;
      }
    }

    @media (max-width: 430px) {
      .mb-navbar {
        width:
          calc(100% - 14px);
      }

      .mb-brand-logo {
        height: 46px;
      }

      .mb-brand-text {
        font-size: 20px;
      }

      .mb-avatar-btn {
        width: 40px;
        height: 40px;
      }
    }
  `;

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <style>{styles}</style>

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <nav
        className={`
          mb-navbar
          ${scrolled ? "scrolled" : ""}
          ${!isVisible ? "hidden" : ""}
        `}
      >
        <div className="mb-navbar-inner">

          {/* =================================================
              BRAND
              ================================================= */}

          <Link
            className="mb-brand"
            to="/"
            onClick={() => setShowMobileMenu(false)}
          >
            <img
              src="/images/logo.png"
              alt="MealBridge Logo"
              className="mb-brand-logo"
            />

            <span className="mb-brand-text">
              MealBridge
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <div className="mb-nav-links">
            {navItems.map((item) => (
              <a
                key={item.label}
                className="mb-nav-link"
                href={item.href}
                onClick={() =>
                  setShowMobileMenu(false)
                }
              >
                {item.label}
              </a>
            ))}

            <Show when="signed-in">
              <Link
                className="mb-nav-link"
                to={getDashboardLink()}
              >
                Dashboard
              </Link>
            </Show>
          </div>

          {/* =================================================
              RIGHT SIDE
              ================================================= */}

          <div className="mb-nav-actions">

            {/* =================================================
                SIGNED IN
                ================================================= */}

            <Show when="signed-in">

              {/* NOTIFICATIONS */}

              <div
                className="mb-notification-container"
                style={{
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  className="mb-icon-btn"
                  aria-label="Notifications"
                  onClick={() => {
                    const nextState =
                      !showNotifMenu;

                    setShowNotifMenu(nextState);
                    setShowUserMenu(false);

                    if (
                      nextState &&
                      role
                    ) {
                      clearNotifications(role);
                    }
                  }}
                >
                  🔔

                  {unreadCount > 0 && (
                    <span className="mb-notif-badge">
                      {unreadCount > 9
                        ? "9+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="mb-dropdown">

                    <div className="mb-dropdown-header">
                      <h3>
                        Notifications
                      </h3>
                    </div>

                    <div className="mb-divider" />

                    <div className="mb-notif-list">

                      {roleNotifs.length === 0 ? (
                        <div className="mb-empty">
                          You're all caught up ✨
                        </div>
                      ) : (
                        roleNotifs.map((n) => (
                          <div
                            key={n.id}
                            className="mb-notif-item"
                            style={{
                              cursor:
                                n.targetId
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() =>
                              handleNotifClick(n)
                            }
                          >
                            <div className="mb-notif-icon">
                              {n.type === "success"
                                ? "✅"
                                : n.type === "warning"
                                ? "⚠️"
                                : "ℹ️"}
                            </div>

                            <div className="mb-notif-body">

                              <h4>
                                {n.title}
                              </h4>

                              <p>
                                {n.message}
                              </p>

                              {n.timestamp && (
                                <span className="mb-notif-time">
                                  {new Date(
                                    n.timestamp
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute:
                                        "2-digit",
                                    }
                                  )}
                                </span>
                              )}

                            </div>
                          </div>
                        ))
                      )}

                    </div>
                  </div>
                )}
              </div>

              {/* CHAT */}

              <button
                type="button"
                className="mb-icon-btn"
                aria-label="Open chat"
                onClick={() => {
                  const chatBtn =
                    document.getElementById(
                      "floating-chat-trigger"
                    );

                  if (chatBtn) {
                    chatBtn.click();
                  } else {
                    console.warn(
                      "Chat trigger not found."
                    );
                  }
                }}
              >
                💬
              </button>

              {/* USER MENU */}

              <div
                className="mb-user-container"
                style={{
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  className="mb-avatar-btn"
                  aria-label="User menu"
                  onClick={() => {
                    setShowUserMenu(
                      !showUserMenu
                    );

                    setShowNotifMenu(false);
                  }}
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="Avatar"
                      className="mb-avatar-img"
                    />
                  ) : (
                    <div className="mb-avatar-placeholder">
                      {user?.firstName?.[0] ||
                        user?.fullName?.[0] ||
                        "U"}
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="mb-dropdown">

                    <div className="mb-dropdown-header">

                      <p className="mb-profile-name">
                        {user?.fullName ||
                          "Welcome!"}
                      </p>

                      <p className="mb-profile-email">
                        {user
                          ?.primaryEmailAddress
                          ?.emailAddress ||
                          "Verified User"}
                      </p>

                    </div>

                    <div className="mb-divider" />

                    <button
                      type="button"
                      className="mb-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);

                        alert(
                          "Profile settings are managed via Clerk."
                        );
                      }}
                    >
                      <span>👤</span>
                      Profile
                    </button>

                    <button
                      type="button"
                      className="mb-dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false);

                        alert(
                          "Account configuration is active."
                        );
                      }}
                    >
                      <span>⚙️</span>
                      Settings
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        className="mb-dropdown-item"
                        style={{ color: "#12846E", fontWeight: 700 }}
                        onClick={() => {
                          setShowUserMenu(false);
                          sessionStorage.setItem("mealbridge-role", "admin");
                          navigate("/admin");
                        }}
                      >
                        <span>🛡️</span>
                        Admin Dashboard
                      </button>
                    )}

                    <div className="mb-divider" />

                    <button
                      type="button"
                      className="mb-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <span>🚪</span>
                      Logout
                    </button>

                  </div>
                )}
              </div>

            </Show>

            {/* =================================================
                SIGNED OUT
                ================================================= */}

            <Show when="signed-out">

              <button
                type="button"
                className="mb-ghost-btn"
                onClick={() =>
                  openRoleModal("signin")
                }
              >
                Sign In
              </button>

              <button
                type="button"
                className="mb-start-btn"
                onClick={() =>
                  openRoleModal("signup")
                }
              >
                Get Started →
              </button>

            </Show>

            {/* =================================================
                MOBILE MENU BUTTON
                ================================================= */}

            <button
              type="button"
              className="mb-mobile-toggle"
              aria-label={
                showMobileMenu
                  ? "Close menu"
                  : "Open menu"
              }
              onClick={() => {
                setShowMobileMenu(
                  !showMobileMenu
                );

                setShowUserMenu(false);
                setShowNotifMenu(false);
              }}
            >
              {showMobileMenu
                ? "✕"
                : "☰"}
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
            ===================================================== */}

        {showMobileMenu && (
          <div className="mb-mobile-menu">

            {navItems.map((item) => (
              <a
                key={item.label}
                className="mb-mobile-link"
                href={item.href}
                onClick={() =>
                  setShowMobileMenu(false)
                }
              >
                {item.label}
              </a>
            ))}

            <Show when="signed-in">
              <Link
                className="mb-mobile-link"
                to={getDashboardLink()}
                onClick={() =>
                  setShowMobileMenu(false)
                }
              >
                Dashboard
              </Link>
            </Show>

            <Show when="signed-out">
              <div className="mb-mobile-actions">

                <button
                  type="button"
                  className="mb-ghost-btn"
                  style={{
                    display: "block",
                  }}
                  onClick={() =>
                    openRoleModal("signin")
                  }
                >
                  Sign In
                </button>

                <button
                  type="button"
                  className="mb-start-btn"
                  style={{
                    display: "block",
                  }}
                  onClick={() =>
                    openRoleModal("signup")
                  }
                >
                  Get Started
                </button>

              </div>
            </Show>

          </div>
        )}
      </nav>

      {/* =====================================================
          ROLE MODAL
          ===================================================== */}

      {isModalOpen && (
        <div
          className="mb-modal-backdrop"
          onClick={closeRoleModal}
        >
          <div
            className="mb-role-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="mb-modal-close"
              aria-label="Close"
              onClick={closeRoleModal}
            >
              ×
            </button>

            <div className="mb-modal-icon">
              👋
            </div>

            <h3>
              {authMode === "signup"
                ? "Create your account"
                : "Welcome back"}
            </h3>

            <p className="mb-role-modal-description">
              Choose your MealBridge role to
              continue with authentication.
            </p>

            <div className="mb-role-grid">

              {/* DONOR */}

              <button
                type="button"
                className={`
                  mb-role-card
                  ${
                    selectedRole === "donor"
                      ? "active"
                      : ""
                  }
                `}
                onClick={() =>
                  setSelectedRole("donor")
                }
              >
                🍱
                <br />
                Donor
              </button>

              {/* RECEIVER */}

              <button
                type="button"
                className={`
                  mb-role-card
                  ${
                    selectedRole === "receiver"
                      ? "active"
                      : ""
                  }
                `}
                onClick={() =>
                  setSelectedRole("receiver")
                }
              >
                🤝
                <br />
                Receiver
              </button>

              {/* ADMIN */}

              <button
                type="button"
                className={`
                  mb-role-card
                  ${
                    selectedRole === "admin"
                      ? "active"
                      : ""
                  }
                `}
                onClick={() =>
                  setSelectedRole("admin")
                }
              >
                🛡️
                <br />
                Admin
              </button>

            </div>

            <div className="mb-modal-actions">

              <button
                type="button"
                className="mb-cancel"
                onClick={closeRoleModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="mb-confirm"
                onClick={confirmRole}
                disabled={!selectedRole}
              >
                Continue →
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
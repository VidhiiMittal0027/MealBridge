import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUser } from "@clerk/react";
import { MealBridgeContext } from "../context/MealBridgeContext";
import DashboardLayout from "../components/DashboardLayout";

/* =========================================================
   MEALBRIDGE — PREMIUM RECEIVER COMMAND CENTER
   ---------------------------------------------------------
   Theme:
   • Deep navy
   • Mint / teal
   • Soft blue
   • Premium glass surfaces
   • AI food rescue visual language

   Preserved functionality:
   ✓ MealBridgeContext
   ✓ Available donations
   ✓ Food details
   ✓ Donor chat
   ✓ Request food
   ✓ Request confirmation
   ✓ Existing DashboardLayout / sidebar
   ========================================================= */

const COLORS = {
  navy: "#07182F",
  navySoft: "#102A43",
  green: "#08A979",
  greenDark: "#057B62",
  teal: "#10B9A4",
  cyan: "#0EA5C9",
  blue: "#3B82F6",
  text: "#14283D",
  muted: "#71869A",
  soft: "#F5FAF9",
  softBlue: "#F3F8FF",
  border: "#E4EFEC",
  white: "#FFFFFF",
  danger: "#D9534F",
  warning: "#B77900",
};

/* =========================================================
   ICON
   ========================================================= */

function Icon({ name, size = 20, stroke = 1.9 }) {
  const paths = {
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    sparkles: (
      <>
        <path d="m12 3 1.2 4.2L17 8.5l-3.8 1.3L12 14l-1.2-4.2L7 8.5l3.8-1.3L12 3Z" />
        <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
      </>
    ),
    heart: (
      <path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.2 2" />
      </>
    ),
    map: (
      <>
        <path d="m9 18-6-3V6l6 3 6-3 6 3v9l-6 3-6-3Z" />
        <path d="M9 9v9M15 6v12" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-5 3 1.8-4.7A7.5 7.5 0 1 1 20 11.5Z" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    food: (
      <>
        <path d="M5 11h14" />
        <path d="M7 11c.5-4 2.2-6 5-6s4.5 2 5 6" />
        <path d="M6 11v2a6 6 0 0 0 12 0v-2" />
        <path d="M9 18v2M15 18v2" />
      </>
    ),
    bolt: (
      <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 11a8 8 0 0 0-14.9-4L3 10" />
        <path d="M3 5v5h5" />
        <path d="M4 13a8 8 0 0 0 14.9 4L21 14" />
        <path d="M21 19v-5h-5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.sparkles}
    </svg>
  );
}

/* =========================================================
   HELPERS
   ========================================================= */

function formatTime(dateValue) {
  if (!dateValue) return "Not set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateValue) {
  if (!dateValue) return "Not set";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFreshness(expiryTime) {
  if (!expiryTime) {
    return {
      label: "Fresh window",
      color: COLORS.green,
      background: "#EAF9F4",
    };
  }

  const expiry = new Date(expiryTime);
  const now = new Date();

  if (Number.isNaN(expiry.getTime())) {
    return {
      label: "Fresh window",
      color: COLORS.green,
      background: "#EAF9F4",
    };
  }

  const hours = Math.round(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)
  );

  if (hours <= 0) {
    return {
      label: "Check expiry",
      color: COLORS.danger,
      background: "#FFF1F1",
    };
  }

  if (hours <= 3) {
    return {
      label: `${hours}h remaining`,
      color: "#C17A00",
      background: "#FFF7E8",
    };
  }

  return {
    label: `${hours}h fresh window`,
    color: COLORS.green,
    background: "#EAF9F4",
  };
}

function statusStyle(status) {
  if (status === "Matching Pending") {
    return {
      color: "#B77900",
      background: "#FFF7E8",
      dot: "#F59E0B",
      label: "Request pending",
    };
  }

  if (status === "Available for NGO Matching") {
    return {
      color: COLORS.greenDark,
      background: "#EAF9F4",
      dot: COLORS.green,
      label: "Available now",
    };
  }

  return {
    color: COLORS.muted,
    background: "#F3F6F8",
    dot: COLORS.muted,
    label: status || "Available",
  };
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function StatusBadge({ status }) {
  const style = statusStyle(status);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 10px",
        borderRadius: 999,
        background: style.background,
        color: style.color,
        fontSize: 11,
        fontWeight: 850,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: style.dot,
          boxShadow: `0 0 0 3px ${style.dot}18`,
        }}
      />
      {style.label}
    </span>
  );
}

function StatCard({ icon, label, value, helper, tone = "green" }) {
  const palette =
    tone === "blue"
      ? {
          iconBg: "#EAF4FF",
          iconColor: "#1683BD",
        }
      : tone === "navy"
      ? {
          iconBg: "#E9EEF5",
          iconColor: COLORS.navy,
        }
      : {
          iconBg: "#E8F9F3",
          iconColor: COLORS.greenDark,
        };

  return (
    <div className="receiver-stat-card">
      <div
        className="receiver-stat-icon"
        style={{
          background: palette.iconBg,
          color: palette.iconColor,
        }}
      >
        <Icon name={icon} size={20} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div className="receiver-stat-label">{label}</div>

        <div className="receiver-stat-value">{value}</div>

        {helper && (
          <div className="receiver-stat-helper">{helper}</div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

export default function ReceiverDashboard() {
  const { user } = useUser();

  const {
    donations,
    orders,
    messages,
    toast,
    requestFood,
    sendChatMessage,
  } = useContext(MealBridgeContext);

  const safeDonations = Array.isArray(donations)
    ? donations
    : [];

  const safeOrders = Array.isArray(orders) ? orders : [];

  const safeMessages = Array.isArray(messages)
    ? messages
    : [];

  /* -------------------------------------------------------
     UI STATE
     ------------------------------------------------------- */

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const [expectedPeople, setExpectedPeople] = useState(10);

  const [contactName, setContactName] = useState(
    user?.fullName || "City Hope Kitchen"
  );

  const [questionText, setQuestionText] = useState("");

  const [searchText, setSearchText] = useState("");

  const [activeFilter, setActiveFilter] = useState(
    "All"
  );

  /* -------------------------------------------------------
     USER CONTACT
     ------------------------------------------------------- */

  useEffect(() => {
    if (user?.fullName) {
      setContactName(user.fullName);
    }
  }, [user]);

  /* -------------------------------------------------------
     AVAILABLE FOOD
     ------------------------------------------------------- */

  const availableItems = useMemo(() => {
    return safeDonations.filter(
      (item) =>
        item.status === "Available for NGO Matching" ||
        item.status === "Matching Pending"
    );
  }, [safeDonations]);

  /* -------------------------------------------------------
     FILTERED FOOD
     ------------------------------------------------------- */

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return availableItems.filter((item) => {
      const matchesSearch =
        !query ||
        String(item.name || "")
          .toLowerCase()
          .includes(query) ||
        String(item.category || "")
          .toLowerCase()
          .includes(query) ||
        String(item.donorName || "")
          .toLowerCase()
          .includes(query) ||
        String(item.pickupAddress || "")
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Veg" &&
          item.vegNonVeg === "Veg") ||
        (activeFilter === "Non-Veg" &&
          item.vegNonVeg !== "Veg") ||
        (activeFilter === "Available" &&
          item.status === "Available for NGO Matching") ||
        (activeFilter === "Pending" &&
          item.status === "Matching Pending");

      return matchesSearch && matchesFilter;
    });
  }, [
    availableItems,
    searchText,
    activeFilter,
  ]);

  /* -------------------------------------------------------
     METRICS
     ------------------------------------------------------- */

  const totalAvailableServings = useMemo(
    () =>
      availableItems.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0),
        0
      ),
    [availableItems]
  );

  const pendingMatches = useMemo(
    () =>
      availableItems.filter(
        (item) =>
          item.status === "Matching Pending"
      ).length,
    [availableItems]
  );

  const freshMatches = useMemo(
    () =>
      availableItems.filter(
        (item) =>
          item.status ===
          "Available for NGO Matching"
      ).length,
    [availableItems]
  );

  const rescuedPeople = useMemo(
    () =>
      safeOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.expectedPeople ||
              order.quantity ||
              0
          ),
        0
      ),
    [safeOrders]
  );

  /* -------------------------------------------------------
     SELECTED ITEM ORDER
     ------------------------------------------------------- */

  const activeOrder = useMemo(() => {
    if (!selectedItem) return null;

    return safeOrders.find(
      (order) =>
        order.donationId === selectedItem.id
    );
  }, [safeOrders, selectedItem]);

  /* -------------------------------------------------------
     CHAT
     ------------------------------------------------------- */

  const activeMessages = useMemo(() => {
    if (!selectedItem) return [];

    return safeMessages.filter(
      (message) =>
        message.donationId === selectedItem.id
    );
  }, [safeMessages, selectedItem]);

  /* -------------------------------------------------------
     OPEN DETAILS
     ------------------------------------------------------- */

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
    setQuestionText("");
  };

  /* -------------------------------------------------------
     OPEN REQUEST
     ------------------------------------------------------- */

  const openRequest = () => {
    if (!selectedItem) return;

    const maxPeople = Number(
      selectedItem.quantity || 1
    );

    setExpectedPeople(
      Math.min(10, maxPeople)
    );

    setContactName(
      user?.fullName ||
        "City Hope Kitchen"
    );

    setIsRequestOpen(true);
  };

  /* -------------------------------------------------------
     REQUEST FOOD
     ------------------------------------------------------- */

  const handleConfirmRequest = (event) => {
    event.preventDefault();

    if (!selectedItem) return;

    requestFood(
      selectedItem.id,
      Number(expectedPeople),
      user?.fullName ||
        "City Hope Kitchen",
      contactName
    );

    setIsRequestOpen(false);
    setIsDetailsOpen(false);
  };

  /* -------------------------------------------------------
     CHAT
     ------------------------------------------------------- */

  const handleSendQuestion = (event) => {
    event.preventDefault();

    if (
      !questionText.trim() ||
      !selectedItem
    ) {
      return;
    }

    const senderName =
      user?.fullName ||
      "City Hope Kitchen";

    sendChatMessage(
      selectedItem.id,
      "receiver",
      senderName,
      questionText.trim()
    );

    setQuestionText("");
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <style>{`
        /* =================================================
           MEALBRIDGE RECEIVER PREMIUM THEME
           ================================================= */

        .receiver-premium {
          min-height: 100%;
          color: ${COLORS.text};
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(16,185,164,.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 96% 10%,
              rgba(14,165,201,.10),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #F8FCFB 0%,
              #F6FAFC 45%,
              #F8FBFC 100%
            );

          padding: 24px;
        }

        .receiver-shell {
          width: 100%;
          max-width: 1480px;
          margin: 0 auto;
        }

        .receiver-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 20px;
        }

        .receiver-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: ${COLORS.greenDark};
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .receiver-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${COLORS.green};
          box-shadow:
            0 0 0 4px rgba(8,169,121,.12),
            0 0 14px rgba(8,169,121,.35);
          animation: receiverPulse 2s infinite;
        }

        @keyframes receiverPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(.72);
            opacity: .6;
          }
        }

        .receiver-page-title {
          margin: 0;
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1.05;
          letter-spacing: -.045em;
          color: ${COLORS.navy};
          font-weight: 850;
        }

        .receiver-page-subtitle {
          margin: 9px 0 0;
          color: ${COLORS.muted};
          font-size: 14px;
          line-height: 1.6;
        }

        .receiver-network-pill {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.80);
          border: 1px solid rgba(228,239,236,.95);
          box-shadow:
            0 12px 30px rgba(16,42,67,.06);
          color: ${COLORS.navy};
          font-size: 11px;
          font-weight: 850;
          white-space: nowrap;
          backdrop-filter: blur(16px);
        }

        /* HERO */

        .receiver-hero {
          position: relative;
          overflow: hidden;
          min-height: 300px;
          border-radius: 30px;
          padding: 34px;
          background:
            radial-gradient(
              circle at 82% 20%,
              rgba(16,185,164,.24),
              transparent 26%
            ),
            radial-gradient(
              circle at 95% 95%,
              rgba(14,165,201,.24),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #07182F 0%,
              #0C2944 56%,
              #073D49 100%
            );
          box-shadow:
            0 28px 70px rgba(7,24,47,.18);
          color: white;
          isolation: isolate;
        }

        .receiver-hero::before {
          content: "";
          position: absolute;
          width: 300px;
          height: 300px;
          right: -100px;
          top: -120px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          box-shadow:
            0 0 0 55px rgba(255,255,255,.025),
            0 0 0 110px rgba(255,255,255,.018);
          pointer-events: none;
        }

        .receiver-hero::after {
          content: "";
          position: absolute;
          left: 38%;
          bottom: -100px;
          width: 280px;
          height: 180px;
          background: rgba(16,185,164,.12);
          filter: blur(60px);
          border-radius: 50%;
          pointer-events: none;
        }

        .receiver-hero-content {
          position: relative;
          z-index: 2;
          max-width: 760px;
        }

        .receiver-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          color: #A7F3D0;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
        }

        .receiver-hero h1 {
          margin: 18px 0 0;
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: clamp(34px, 5vw, 62px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 850;
        }

        .receiver-hero h1 span {
          color: #39D5AF;
        }

        .receiver-hero-copy {
          max-width: 640px;
          margin: 18px 0 0;
          color: rgba(238,249,247,.72);
          font-size: 15px;
          line-height: 1.7;
        }

        .receiver-hero-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 25px;
        }

        .receiver-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          cursor: pointer;
          padding: 13px 18px;
          border-radius: 13px;
          background: linear-gradient(
            135deg,
            #0AC18F,
            #09A979
          );
          color: white;
          font-size: 12px;
          font-weight: 850;
          box-shadow:
            0 12px 28px rgba(8,169,121,.25);
          transition: .2s ease;
        }

        .receiver-primary-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 34px rgba(8,169,121,.32);
        }

        .receiver-ghost-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid rgba(255,255,255,.15);
          cursor: pointer;
          padding: 13px 18px;
          border-radius: 13px;
          background: rgba(255,255,255,.07);
          color: rgba(255,255,255,.9);
          font-size: 12px;
          font-weight: 800;
          backdrop-filter: blur(12px);
          transition: .2s ease;
        }

        .receiver-ghost-btn:hover {
          background: rgba(255,255,255,.12);
        }

        .receiver-network-card {
          position: absolute;
          z-index: 3;
          right: 28px;
          top: 28px;
          width: 260px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255,255,255,.09);
          border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(18px);
          box-shadow:
            0 22px 45px rgba(0,0,0,.13);
        }

        .receiver-network-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          font-size: 11px;
          font-weight: 850;
          margin-bottom: 15px;
        }

        .receiver-network-line {
          height: 1px;
          background:
            linear-gradient(
              90deg,
              rgba(57,213,175,.05),
              rgba(57,213,175,.65),
              rgba(57,213,175,.05)
            );
          position: relative;
        }

        .receiver-network-line::after {
          content: "";
          position: absolute;
          left: 48%;
          top: -5px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #39D5AF;
          box-shadow:
            0 0 0 5px rgba(57,213,175,.12),
            0 0 18px rgba(57,213,175,.5);
        }

        .receiver-network-bottom {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 15px;
        }

        .receiver-network-stat {
          min-width: 0;
        }

        .receiver-network-stat strong {
          display: block;
          color: white;
          font-size: 17px;
          font-weight: 850;
        }

        .receiver-network-stat span {
          color: rgba(255,255,255,.5);
          font-size: 9px;
          font-weight: 700;
        }

        /* STATS */

        .receiver-stats {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 13px;
          margin-top: 15px;
        }

        .receiver-stat-card {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          border-radius: 19px;
          background: rgba(255,255,255,.88);
          border: 1px solid ${COLORS.border};
          box-shadow:
            0 12px 35px rgba(16,42,67,.045);
          transition: .2s ease;
        }

        .receiver-stat-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 40px rgba(16,42,67,.08);
        }

        .receiver-stat-icon {
          flex: 0 0 auto;
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
        }

        .receiver-stat-label {
          color: ${COLORS.muted};
          font-size: 10px;
          font-weight: 800;
          margin-bottom: 3px;
        }

        .receiver-stat-value {
          color: ${COLORS.navy};
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: 21px;
          line-height: 1.05;
          font-weight: 850;
          letter-spacing: -.03em;
        }

        .receiver-stat-helper {
          color: #9AA9B5;
          font-size: 9px;
          font-weight: 700;
          margin-top: 4px;
        }

        /* CONTENT HEADER */

        .receiver-content-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-top: 34px;
          margin-bottom: 15px;
        }

        .receiver-section-kicker {
          color: ${COLORS.greenDark};
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .15em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .receiver-section-title {
          margin: 0;
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: 23px;
          line-height: 1.1;
          letter-spacing: -.035em;
          color: ${COLORS.navy};
          font-weight: 850;
        }

        .receiver-section-subtitle {
          margin: 6px 0 0;
          color: ${COLORS.muted};
          font-size: 12px;
          line-height: 1.5;
        }

        /* SEARCH */

        .receiver-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .receiver-search {
          position: relative;
          flex: 1 1 300px;
          min-width: 220px;
        }

        .receiver-search svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #93A3AE;
        }

        .receiver-search input {
          width: 100%;
          box-sizing: border-box;
          height: 46px;
          padding: 0 15px 0 43px;
          border-radius: 13px;
          border: 1px solid ${COLORS.border};
          background: rgba(255,255,255,.9);
          outline: none;
          color: ${COLORS.text};
          font-size: 12px;
          font-weight: 600;
          transition: .2s ease;
        }

        .receiver-search input:focus {
          border-color: rgba(8,169,121,.45);
          box-shadow:
            0 0 0 4px rgba(8,169,121,.08);
        }

        .receiver-filter-row {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
        }

        .receiver-filter {
          border: 1px solid ${COLORS.border};
          background: rgba(255,255,255,.82);
          color: ${COLORS.muted};
          padding: 9px 12px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          transition: .18s ease;
        }

        .receiver-filter:hover {
          border-color: rgba(8,169,121,.35);
          color: ${COLORS.greenDark};
        }

        .receiver-filter.active {
          background: ${COLORS.navy};
          border-color: ${COLORS.navy};
          color: white;
          box-shadow:
            0 7px 18px rgba(7,24,47,.13);
        }

        /* GRID */

        .receiver-food-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .receiver-food-card {
          overflow: hidden;
          border-radius: 22px;
          background: rgba(255,255,255,.94);
          border: 1px solid ${COLORS.border};
          box-shadow:
            0 13px 40px rgba(16,42,67,.055);
          transition:
            transform .25s ease,
            box-shadow .25s ease,
            border-color .25s ease;
        }

        .receiver-food-card:hover {
          transform: translateY(-5px);
          border-color: rgba(8,169,121,.25);
          box-shadow:
            0 24px 55px rgba(16,42,67,.10);
        }

        .receiver-food-image-wrap {
          position: relative;
          height: 185px;
          overflow: hidden;
          background: #EDF4F2;
        }

        .receiver-food-image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .receiver-food-card:hover
        .receiver-food-image {
          transform: scale(1.045);
        }

        .receiver-image-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(7,24,47,.03),
              rgba(7,24,47,.42)
            );
          pointer-events: none;
        }

        .receiver-image-top {
          position: absolute;
          left: 12px;
          right: 12px;
          top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .receiver-ai-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(7,24,47,.74);
          border: 1px solid rgba(255,255,255,.14);
          color: #D4FFF1;
          backdrop-filter: blur(10px);
          font-size: 9px;
          font-weight: 850;
        }

        .receiver-veg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,.91);
          color: ${COLORS.greenDark};
          font-size: 9px;
          font-weight: 850;
        }

        .receiver-food-body {
          padding: 17px;
        }

        .receiver-food-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .receiver-food-title {
          margin: 0;
          color: ${COLORS.navy};
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: 16px;
          line-height: 1.2;
          letter-spacing: -.025em;
          font-weight: 850;
        }

        .receiver-donor {
          display: flex;
          align-items: center;
          gap: 7px;
          color: ${COLORS.muted};
          font-size: 10px;
          font-weight: 700;
          margin-top: 7px;
        }

        .receiver-donor-dot {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #EAF9F4;
          color: ${COLORS.greenDark};
          font-size: 9px;
          font-weight: 900;
        }

        .receiver-food-meta {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 7px;
          margin-top: 15px;
        }

        .receiver-meta-box {
          padding: 10px;
          border-radius: 12px;
          background: ${COLORS.soft};
          border: 1px solid #EDF3F1;
        }

        .receiver-meta-label {
          color: #93A3AE;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .receiver-meta-value {
          color: ${COLORS.text};
          font-size: 10px;
          font-weight: 850;
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .receiver-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
          margin-top: 15px;
        }

        .receiver-view-btn {
          flex: 1;
          min-height: 39px;
          border: 0;
          border-radius: 11px;
          background: ${COLORS.navy};
          color: white;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 850;
          transition: .18s ease;
        }

        .receiver-view-btn:hover {
          background: #0C2944;
          transform: translateY(-1px);
        }

        /* EMPTY */

        .receiver-empty {
          grid-column: 1 / -1;
          padding: 50px 24px;
          border-radius: 22px;
          background: rgba(255,255,255,.88);
          border: 1px dashed #D6E7E3;
          text-align: center;
        }

        .receiver-empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 13px;
          border-radius: 18px;
          background: #EAF9F4;
          color: ${COLORS.greenDark};
        }

        .receiver-empty h3 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: 16px;
          font-weight: 850;
        }

        .receiver-empty p {
          max-width: 440px;
          margin: 8px auto 0;
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.6;
        }

        /* IMPACT STRIP */

        .receiver-impact-strip {
          display: grid;
          grid-template-columns:
            1.35fr repeat(3, 1fr);
          gap: 12px;
          margin-top: 17px;
        }

        .receiver-impact-main {
          position: relative;
          overflow: hidden;
          padding: 20px;
          border-radius: 21px;
          background:
            linear-gradient(
              135deg,
              #0B2944,
              #0B4B4A
            );
          color: white;
        }

        .receiver-impact-main::after {
          content: "";
          position: absolute;
          width: 160px;
          height: 160px;
          right: -50px;
          bottom: -70px;
          border-radius: 50%;
          background: rgba(57,213,175,.15);
        }

        .receiver-impact-main small {
          position: relative;
          z-index: 1;
          color: #8DE6CB;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .13em;
        }

        .receiver-impact-main strong {
          position: relative;
          z-index: 1;
          display: block;
          margin-top: 6px;
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: 27px;
          font-weight: 850;
        }

        .receiver-impact-main p {
          position: relative;
          z-index: 1;
          margin: 4px 0 0;
          color: rgba(255,255,255,.58);
          font-size: 10px;
        }

        .receiver-impact-item {
          padding: 19px;
          border-radius: 21px;
          background: rgba(255,255,255,.9);
          border: 1px solid ${COLORS.border};
        }

        .receiver-impact-item span {
          display: block;
          color: ${COLORS.muted};
          font-size: 9px;
          font-weight: 800;
        }

        .receiver-impact-item strong {
          display: block;
          margin-top: 7px;
          color: ${COLORS.navy};
          font-size: 20px;
          font-weight: 850;
        }

        /* MODAL */

        .receiver-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(4,16,31,.64);
          backdrop-filter: blur(12px);
          animation: receiverFade .18s ease;
        }

        @keyframes receiverFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .receiver-modal {
          width: 100%;
          max-width: 1050px;
          max-height: 92vh;
          overflow: hidden;
          border-radius: 26px;
          background: #FFFFFF;
          box-shadow:
            0 35px 100px rgba(0,0,0,.28);
          animation: receiverModalIn .22s ease;
        }

        @keyframes receiverModalIn {
          from {
            transform: translateY(12px) scale(.985);
            opacity: .7;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .receiver-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 21px;
          border-bottom: 1px solid #EDF2F4;
          background: rgba(255,255,255,.96);
        }

        .receiver-modal-kicker {
          color: ${COLORS.greenDark};
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .receiver-modal-header h2 {
          margin: 0;
          color: ${COLORS.navy};
          font-family:
            "Plus Jakarta Sans",
            Inter,
            sans-serif;
          font-size: 18px;
          letter-spacing: -.025em;
          font-weight: 850;
        }

        .receiver-close {
          flex: 0 0 auto;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border: 1px solid #E5ECEF;
          border-radius: 11px;
          background: white;
          color: ${COLORS.muted};
          cursor: pointer;
        }

        .receiver-close:hover {
          color: ${COLORS.navy};
          background: #F5F8F9;
        }

        .receiver-modal-content {
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(330px, .92fr);
          max-height: calc(92vh - 75px);
          overflow: auto;
        }

        .receiver-details-column {
          padding: 21px;
          border-right: 1px solid #EDF2F4;
          overflow: auto;
        }

        .receiver-details-image {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border-radius: 19px;
          display: block;
          background: #EDF4F2;
        }

        .receiver-details-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 15px;
        }

        .receiver-detail-box {
          padding: 13px;
          border-radius: 14px;
          background: ${COLORS.soft};
          border: 1px solid #EAF1EF;
        }

        .receiver-detail-box span {
          display: block;
          color: #91A1AC;
          font-size: 8px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .receiver-detail-box strong {
          display: block;
          margin-top: 5px;
          color: ${COLORS.text};
          font-size: 11px;
          line-height: 1.35;
          font-weight: 850;
        }

        .receiver-detail-section {
          margin-top: 17px;
        }

        .receiver-detail-section h3 {
          margin: 0 0 7px;
          color: ${COLORS.navy};
          font-size: 12px;
          font-weight: 850;
        }

        .receiver-detail-section p {
          margin: 4px 0;
          color: ${COLORS.muted};
          font-size: 10px;
          line-height: 1.65;
        }

        /* CHAT */

        .receiver-action-column {
          padding: 21px;
          background:
            linear-gradient(
              180deg,
              #FBFDFC,
              #F7FBFA
            );
        }

        .receiver-chat-card {
          display: flex;
          flex-direction: column;
          min-height: 390px;
          border-radius: 19px;
          background: white;
          border: 1px solid ${COLORS.border};
          box-shadow:
            0 14px 35px rgba(16,42,67,.05);
          overflow: hidden;
        }

        .receiver-chat-header {
          padding: 16px;
          border-bottom: 1px solid #EDF2F4;
        }

        .receiver-chat-header-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .receiver-chat-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #EAF9F4;
          color: ${COLORS.greenDark};
        }

        .receiver-chat-header h3 {
          margin: 0;
          color: ${COLORS.navy};
          font-size: 12px;
          font-weight: 850;
        }

        .receiver-chat-header p {
          margin: 3px 0 0;
          color: ${COLORS.muted};
          font-size: 9px;
          line-height: 1.4;
        }

        .receiver-chat-messages {
          flex: 1;
          min-height: 230px;
          max-height: 280px;
          overflow: auto;
          padding: 15px;
        }

        .receiver-chat-empty {
          height: 100%;
          min-height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #94A3AE;
          font-size: 10px;
          line-height: 1.6;
          padding: 20px;
        }

        .receiver-message {
          display: flex;
          flex-direction: column;
          margin-bottom: 11px;
        }

        .receiver-message.me {
          align-items: flex-end;
        }

        .receiver-message.them {
          align-items: flex-start;
        }

        .receiver-message-name {
          color: #91A1AC;
          font-size: 8px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .receiver-message-bubble {
          max-width: 82%;
          padding: 9px 11px;
          border-radius: 12px;
          background: #F1F6F5;
          color: ${COLORS.text};
          font-size: 10px;
          line-height: 1.5;
        }

        .receiver-message.me
        .receiver-message-bubble {
          background:
            linear-gradient(
              135deg,
              ${COLORS.green},
              ${COLORS.teal}
            );
          color: white;
          border-bottom-right-radius: 4px;
        }

        .receiver-message.them
        .receiver-message-bubble {
          border-bottom-left-radius: 4px;
        }

        .receiver-chat-form {
          display: flex;
          gap: 8px;
          padding: 11px;
          border-top: 1px solid #EDF2F4;
          background: #FBFDFC;
        }

        .receiver-chat-form input {
          min-width: 0;
          flex: 1;
          height: 40px;
          border: 1px solid #E0EAE7;
          border-radius: 10px;
          padding: 0 11px;
          outline: none;
          background: white;
          color: ${COLORS.text};
          font-size: 10px;
          font-weight: 600;
        }

        .receiver-chat-form input:focus {
          border-color: rgba(8,169,121,.4);
          box-shadow:
            0 0 0 3px rgba(8,169,121,.07);
        }

        .receiver-send-btn {
          flex: 0 0 auto;
          height: 40px;
          border: 0;
          border-radius: 10px;
          padding: 0 13px;
          background: ${COLORS.navy};
          color: white;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        /* REQUEST BOX */

        .receiver-request-box {
          margin-top: 13px;
          padding: 16px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #07182F,
              #0D3A43
            );
          color: white;
        }

        .receiver-request-box h3 {
          margin: 0;
          font-size: 12px;
          font-weight: 850;
        }

        .receiver-request-box p {
          margin: 6px 0 0;
          color: rgba(255,255,255,.58);
          font-size: 9px;
          line-height: 1.5;
        }

        .receiver-request-btn {
          width: 100%;
          min-height: 40px;
          margin-top: 13px;
          border: 0;
          border-radius: 11px;
          background: linear-gradient(
            135deg,
            #0AC18F,
            #09A979
          );
          color: white;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          box-shadow:
            0 10px 22px rgba(8,169,121,.20);
        }

        .receiver-pending-box {
          margin-top: 13px;
          padding: 14px;
          border-radius: 16px;
          background: #FFF8E9;
          border: 1px solid #F4E3BC;
          color: #8D620F;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.55;
        }

        /* FORM MODAL */

        .receiver-small-modal {
          width: 100%;
          max-width: 470px;
          border-radius: 24px;
          overflow: hidden;
          background: white;
          box-shadow:
            0 35px 100px rgba(0,0,0,.3);
        }

        .receiver-form {
          padding: 21px;
        }

        .receiver-form-copy {
          margin: 0 0 17px;
          color: ${COLORS.muted};
          font-size: 11px;
          line-height: 1.6;
        }

        .receiver-field {
          display: block;
          margin-bottom: 13px;
        }

        .receiver-field span {
          display: block;
          color: ${COLORS.text};
          font-size: 9px;
          font-weight: 850;
          margin-bottom: 6px;
        }

        .receiver-field input {
          width: 100%;
          height: 43px;
          box-sizing: border-box;
          border-radius: 11px;
          border: 1px solid #DDE8E5;
          outline: none;
          padding: 0 12px;
          color: ${COLORS.text};
          background: #FBFDFC;
          font-size: 11px;
          font-weight: 650;
        }

        .receiver-field input:focus {
          border-color: rgba(8,169,121,.4);
          box-shadow:
            0 0 0 4px rgba(8,169,121,.07);
        }

        .receiver-form-actions {
          display: flex;
          gap: 9px;
          justify-content: flex-end;
          margin-top: 21px;
        }

        .receiver-cancel {
          height: 42px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid #DDE8E5;
          background: white;
          color: ${COLORS.muted};
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
        }

        .receiver-confirm {
          height: 42px;
          padding: 0 17px;
          border-radius: 11px;
          border: 0;
          background:
            linear-gradient(
              135deg,
              ${COLORS.green},
              ${COLORS.teal}
            );
          color: white;
          font-size: 10px;
          font-weight: 850;
          cursor: pointer;
          box-shadow:
            0 9px 20px rgba(8,169,121,.20);
        }

        /* TOAST */

        .receiver-toast {
          position: fixed;
          z-index: 10001;
          right: 22px;
          bottom: 22px;
          max-width: 360px;
          padding: 13px 16px;
          border-radius: 14px;
          background: ${COLORS.navy};
          color: white;
          border: 1px solid rgba(255,255,255,.12);
          box-shadow:
            0 18px 45px rgba(7,24,47,.25);
          font-size: 11px;
          font-weight: 750;
          animation: receiverToastIn .25s ease;
        }

        @keyframes receiverToastIn {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .receiver-network-card {
            display: none;
          }

          .receiver-food-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .receiver-impact-strip {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .receiver-impact-main {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 850px) {
          .receiver-premium {
            padding: 15px;
          }

          .receiver-stats {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .receiver-modal-content {
            grid-template-columns: 1fr;
          }

          .receiver-details-column {
            border-right: 0;
            border-bottom: 1px solid #EDF2F4;
          }
        }

        @media (max-width: 650px) {
          .receiver-topbar {
            align-items: flex-start;
          }

          .receiver-network-pill {
            display: none;
          }

          .receiver-hero {
            padding: 25px;
            border-radius: 23px;
          }

          .receiver-hero h1 {
            font-size: 38px;
          }

          .receiver-stats {
            grid-template-columns: 1fr 1fr;
          }

          .receiver-food-grid {
            grid-template-columns: 1fr;
          }

          .receiver-content-header {
            align-items: flex-start;
          }

          .receiver-toolbar {
            display: block;
          }

          .receiver-search {
            width: 100%;
            margin-bottom: 8px;
          }

          .receiver-impact-strip {
            grid-template-columns: 1fr;
          }

          .receiver-impact-main {
            grid-column: auto;
          }

          .receiver-details-grid {
            grid-template-columns: 1fr;
          }

          .receiver-details-image {
            height: 210px;
          }

          .receiver-modal-backdrop {
            padding: 10px;
          }

          .receiver-modal {
            max-height: 95vh;
            border-radius: 20px;
          }

          .receiver-action-column,
          .receiver-details-column {
            padding: 15px;
          }
        }

        @media (max-width: 430px) {
          .receiver-premium {
            padding: 10px;
          }

          .receiver-stats {
            grid-template-columns: 1fr;
          }

          .receiver-hero {
            padding: 21px;
          }

          .receiver-hero h1 {
            font-size: 33px;
          }

          .receiver-hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .receiver-primary-btn,
          .receiver-ghost-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="receiver-premium">
        <div className="receiver-shell">

          {/* =================================================
              TOP HEADER
              ================================================= */}

          <div className="receiver-topbar">
            <div>
              <div className="receiver-eyebrow">
                <span className="receiver-live-dot" />
                AI-POWERED FOOD RESCUE
              </div>

              <h1 className="receiver-page-title">
                Receiver Command Center
              </h1>

              <p className="receiver-page-subtitle">
                Find fresh surplus meals, connect with donors,
                and get food where it matters most.
              </p>
            </div>

            <div className="receiver-network-pill">
              <span className="receiver-live-dot" />
              Live rescue network
            </div>
          </div>

          {/* =================================================
              HERO
              ================================================= */}

          <section className="receiver-hero">
            <div className="receiver-hero-content">

              <div className="receiver-hero-kicker">
                <Icon name="sparkles" size={13} />
                Smart matching • Fresh • Verified
              </div>

              <h1>
                Good food is waiting.
                <br />
                <span>Let's get it to people.</span>
              </h1>

              <p className="receiver-hero-copy">
                Hi{" "}
                <strong>
                  {user?.firstName ||
                    "NGO Partner"}
                </strong>
                . Explore verified surplus meals
                from restaurants, hotels, caterers
                and community partners.
              </p>

              <div className="receiver-hero-actions">
                <button
                  className="receiver-primary-btn"
                  onClick={() =>
                    document
                      .getElementById(
                        "available-meals"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  <Icon name="food" size={16} />
                  Browse available meals
                  <Icon name="arrow" size={14} />
                </button>

                <button
                  className="receiver-ghost-btn"
                  onClick={() =>
                    document
                      .getElementById(
                        "receiver-impact"
                      )
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  <Icon name="heart" size={15} />
                  View my impact
                </button>
              </div>
            </div>

            {/* Floating network visualization */}
            <div className="receiver-network-card">
              <div className="receiver-network-title">
                <span>DONATION COORDINATION</span>
                <span
                  style={{
                    color: "#39D5AF",
                    fontSize: 9,
                  }}
                >
                  LIVE
                </span>
              </div>

              <div className="receiver-network-line" />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: 17,
                  color:
                    "rgba(255,255,255,.55)",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                <span>DONOR</span>
                <span>YOU</span>
              </div>

              <div className="receiver-network-bottom">
                <div className="receiver-network-stat">
                  <strong>
                    {freshMatches}
                  </strong>
                  <span>
                    live matches
                  </span>
                </div>

                <div className="receiver-network-stat">
                  <strong>
                    {totalAvailableServings}
                  </strong>
                  <span>
                    servings
                  </span>
                </div>

                <div className="receiver-network-stat">
                  <strong>
                    {pendingMatches}
                  </strong>
                  <span>
                    pending
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              STATS
              ================================================= */}

          <div className="receiver-stats">
            <StatCard
              icon="food"
              label="Meals available"
              value={totalAvailableServings}
              helper="Ready to rescue"
              tone="green"
            />

            <StatCard
              icon="sparkles"
              label="AI matches"
              value={freshMatches}
              helper="Match-ready donations"
              tone="blue"
            />

            <StatCard
              icon="clock"
              label="Requests pending"
              value={pendingMatches}
              helper="Awaiting donor approval"
              tone="navy"
            />

            <StatCard
              icon="users"
              label="People reached"
              value={rescuedPeople}
              helper="Across your requests"
              tone="green"
            />
          </div>

          {/* =================================================
              AVAILABLE FOOD
              ================================================= */}

          <section
            id="available-meals"
            style={{ marginTop: 34 }}
          >
            <div className="receiver-content-header">
              <div>
                <div className="receiver-section-kicker">
                  FOOD RESCUE NETWORK
                </div>

                <h2 className="receiver-section-title">
                  Available meals
                </h2>

                <p className="receiver-section-subtitle">
                  Fresh surplus food matched for
                  community organizations.
                </p>
              </div>

              <div
                style={{
                  color: COLORS.muted,
                  fontSize: 10,
                  fontWeight: 800,
                }}
              >
                {filteredItems.length}{" "}
                {filteredItems.length === 1
                  ? "listing"
                  : "listings"}{" "}
                found
              </div>
            </div>

            {/* SEARCH + FILTER */}

            <div className="receiver-toolbar">
              <div className="receiver-search">
                <Icon
                  name="search"
                  size={17}
                />

                <input
                  type="text"
                  placeholder="Search meals, categories, donors or pickup locations..."
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="receiver-filter-row">
                {[
                  "All",
                  "Available",
                  "Pending",
                  "Veg",
                  "Non-Veg",
                ].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`receiver-filter ${
                      activeFilter === filter
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveFilter(
                        filter
                      )
                    }
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* FOOD GRID */}

            <div className="receiver-food-grid">
              {filteredItems.length === 0 ? (
                <div className="receiver-empty">
                  <div className="receiver-empty-icon">
                    <Icon
                      name="food"
                      size={25}
                    />
                  </div>

                  <h3>
                    No matching meals right now
                  </h3>

                  <p>
                    Try changing your search or
                    filters. New surplus food can
                    appear as donors register meals
                    on the network.
                  </p>

                  <button
                    type="button"
                    className="receiver-primary-btn"
                    style={{
                      marginTop: 16,
                    }}
                    onClick={() => {
                      setSearchText("");
                      setActiveFilter("All");
                    }}
                  >
                    <Icon
                      name="refresh"
                      size={14}
                    />
                    Reset filters
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const freshness =
                    getFreshness(
                      item.expiryTime
                    );

                  const donorName =
                    item.donorName ||
                    "Verified Meal Partner";

                  return (
                    <article
                      key={item.id}
                      className="receiver-food-card"
                    >
                      <div className="receiver-food-image-wrap">
                        <img
                          src={
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=85"
                          }
                          alt={item.name}
                          className="receiver-food-image"
                        />

                        <div className="receiver-image-overlay" />

                        <div className="receiver-image-top">
                          <span className="receiver-ai-badge">
                            <Icon
                              name="sparkles"
                              size={11}
                            />
                            AI MATCH READY
                          </span>

                          <span className="receiver-veg-badge">
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius:
                                  "50%",
                                background:
                                  item.vegNonVeg ===
                                  "Veg"
                                    ? COLORS.green
                                    : "#E65D5D",
                              }}
                            />
                            {item.vegNonVeg ===
                            "Veg"
                              ? "Veg"
                              : "Non-Veg"}
                          </span>
                        </div>
                      </div>

                      <div className="receiver-food-body">
                        <div className="receiver-food-title-row">
                          <div>
                            <h3 className="receiver-food-title">
                              {item.name ||
                                "Surplus Meal"}
                            </h3>

                            <div className="receiver-donor">
                              <span className="receiver-donor-dot">
                                {donorName
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <span>
                                {donorName}
                              </span>
                            </div>
                          </div>

                          <StatusBadge
                            status={
                              item.status
                            }
                          />
                        </div>

                        <div className="receiver-food-meta">
                          <div className="receiver-meta-box">
                            <div className="receiver-meta-label">
                              Servings
                            </div>

                            <div className="receiver-meta-value">
                              {item.quantity ||
                                0}{" "}
                              people
                            </div>
                          </div>

                          <div className="receiver-meta-box">
                            <div className="receiver-meta-label">
                              Freshness
                            </div>

                            <div
                              className="receiver-meta-value"
                              style={{
                                color:
                                  freshness.color,
                              }}
                            >
                              {freshness.label}
                            </div>
                          </div>

                          <div className="receiver-meta-box">
                            <div className="receiver-meta-label">
                              Category
                            </div>

                            <div className="receiver-meta-value">
                              {item.category ||
                                "Cooked Meals"}
                            </div>
                          </div>

                          <div className="receiver-meta-box">
                            <div className="receiver-meta-label">
                              Pickup
                            </div>

                            <div className="receiver-meta-value">
                              {formatTime(
                                item.cookingTime
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="receiver-card-bottom">
                          <div
                            style={{
                              display:
                                "inline-flex",
                              alignItems:
                                "center",
                              gap: 5,
                              color:
                                COLORS.muted,
                              fontSize: 9,
                              fontWeight: 750,
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <Icon
                              name="map"
                              size={12}
                            />

                            <span
                              style={{
                                overflow:
                                  "hidden",
                                textOverflow:
                                  "ellipsis",
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {item.pickupAddress ||
                                "Pickup location available"}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="receiver-view-btn"
                            onClick={() =>
                              openDetails(
                                item
                              )
                            }
                          >
                            View details
                            <Icon
                              name="arrow"
                              size={12}
                            />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* =================================================
              IMPACT / NETWORK SUMMARY
              ================================================= */}

          <section
            id="receiver-impact"
            className="receiver-impact-strip"
          >
            <div className="receiver-impact-main">
              <small>
                Your rescue network
              </small>

              <strong>
                {rescuedPeople} people reached
              </strong>

              <p>
                Every accepted meal helps move
                good food from surplus to community.
              </p>
            </div>

            <div className="receiver-impact-item">
              <span>
                Available servings
              </span>

              <strong>
                {totalAvailableServings}
              </strong>
            </div>

            <div className="receiver-impact-item">
              <span>
                Live food matches
              </span>

              <strong>
                {freshMatches}
              </strong>
            </div>

            <div className="receiver-impact-item">
              <span>
                Active requests
              </span>

              <strong>
                {pendingMatches}
              </strong>
            </div>
          </section>
        </div>

        {/* ===================================================
            DETAILS MODAL
            =================================================== */}

        {isDetailsOpen &&
          selectedItem && (
            <div
              className="receiver-modal-backdrop"
              onClick={() =>
                setIsDetailsOpen(false)
              }
            >
              <div
                className="receiver-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="receiver-modal-header">
                  <div>
                    <div className="receiver-modal-kicker">
                      VERIFIED SURPLUS FOOD
                    </div>

                    <h2>
                      {selectedItem.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="receiver-close"
                    onClick={() =>
                      setIsDetailsOpen(false)
                    }
                    aria-label="Close"
                  >
                    <Icon
                      name="close"
                      size={17}
                    />
                  </button>
                </div>

                <div className="receiver-modal-content">

                  {/* LEFT */}

                  <div className="receiver-details-column">
                    <img
                      src={
                        selectedItem.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=85"
                      }
                      alt={
                        selectedItem.name
                      }
                      className="receiver-details-image"
                    />

                    <div className="receiver-details-grid">
                      <div className="receiver-detail-box">
                        <span>
                          Category
                        </span>

                        <strong>
                          {selectedItem.category ||
                            "Cooked Meals"}
                        </strong>
                      </div>

                      <div className="receiver-detail-box">
                        <span>
                          Servings
                        </span>

                        <strong>
                          {selectedItem.quantity ||
                            0}{" "}
                          servings
                        </strong>
                      </div>

                      <div className="receiver-detail-box">
                        <span>
                          Food type
                        </span>

                        <strong>
                          {selectedItem.vegNonVeg ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div className="receiver-detail-box">
                        <span>
                          Status
                        </span>

                        <strong
                          style={{
                            color:
                              statusStyle(
                                selectedItem.status
                              ).color,
                          }}
                        >
                          {
                            statusStyle(
                              selectedItem.status
                            ).label
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="receiver-detail-section">
                      <h3>
                        <Icon
                          name="clock"
                          size={13}
                          style={{
                            verticalAlign:
                              "middle",
                          }}
                        />{" "}
                        Timings
                      </h3>

                      <p>
                        <strong>
                          Cooking:
                        </strong>{" "}
                        {formatDate(
                          selectedItem.cookingTime
                        )}{" "}
                        •{" "}
                        {formatTime(
                          selectedItem.cookingTime
                        )}
                      </p>

                      <p>
                        <strong>
                          Best before:
                        </strong>{" "}
                        {formatDate(
                          selectedItem.expiryTime
                        )}{" "}
                        •{" "}
                        {formatTime(
                          selectedItem.expiryTime
                        )}
                      </p>
                    </div>

                    <div className="receiver-detail-section">
                      <h3>
                        Pickup location
                      </h3>

                      <p>
                        {selectedItem.pickupAddress ||
                          "Pickup address not provided."}
                      </p>

                      {selectedItem.gpsLocation && (
                        <p>
                          Coordinates:{" "}
                          {
                            selectedItem.gpsLocation
                          }
                        </p>
                      )}
                    </div>

                    <div className="receiver-detail-section">
                      <h3>
                        About this meal
                      </h3>

                      <p>
                        {selectedItem.description ||
                          "The donor has not added a description for this meal."}
                      </p>

                      <p>
                        <strong>
                          Special instructions:
                        </strong>{" "}
                        {selectedItem.specialInstructions ||
                          "None provided."}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="receiver-action-column">

                    {/* CHAT */}

                    <div className="receiver-chat-card">
                      <div className="receiver-chat-header">
                        <div className="receiver-chat-header-row">
                          <div className="receiver-chat-icon">
                            <Icon
                              name="message"
                              size={17}
                            />
                          </div>

                          <div>
                            <h3>
                              Talk to the donor
                            </h3>

                            <p>
                              Ask about packaging,
                              logistics or dietary
                              requirements.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="receiver-chat-messages">
                        {activeMessages.length ===
                        0 ? (
                          <div className="receiver-chat-empty">
                            No conversation yet.
                            <br />
                            Send the donor a quick
                            question before requesting
                            the meal.
                          </div>
                        ) : (
                          activeMessages.map(
                            (message) => {
                              const isMe =
                                message.senderId ===
                                "receiver";

                              return (
                                <div
                                  key={
                                    message.id
                                  }
                                  className={`receiver-message ${
                                    isMe
                                      ? "me"
                                      : "them"
                                  }`}
                                >
                                  <span className="receiver-message-name">
                                    {
                                      message.senderName
                                    }
                                  </span>

                                  <div className="receiver-message-bubble">
                                    {
                                      message.text
                                    }
                                  </div>
                                </div>
                              );
                            }
                          )
                        )}
                      </div>

                      <form
                        className="receiver-chat-form"
                        onSubmit={
                          handleSendQuestion
                        }
                      >
                        <input
                          type="text"
                          placeholder="Ask the donor something..."
                          value={
                            questionText
                          }
                          onChange={(event) =>
                            setQuestionText(
                              event.target.value
                            )
                          }
                        />

                        <button
                          type="submit"
                          className="receiver-send-btn"
                        >
                          Send
                        </button>
                      </form>
                    </div>

                    {/* REQUEST */}

                    {selectedItem.status ===
                    "Matching Pending" ? (
                      <div className="receiver-pending-box">
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 8,
                          }}
                        >
                          <Icon
                            name="clock"
                            size={14}
                          />

                          Request pending
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontWeight: 650,
                          }}
                        >
                          Your request is waiting
                          for donor approval.
                        </div>

                        {activeOrder && (
                          <div
                            style={{
                              marginTop: 5,
                            }}
                          >
                            Requested for{" "}
                            {
                              activeOrder.expectedPeople
                            }{" "}
                            people.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="receiver-request-box">
                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 8,
                          }}
                        >
                          <Icon
                            name="sparkles"
                            size={15}
                          />

                          <h3>
                            Ready to rescue this meal?
                          </h3>
                        </div>

                        <p>
                          Confirm how many people
                          you're serving and send a
                          request to the donor.
                        </p>

                        <button
                          type="button"
                          className="receiver-request-btn"
                          onClick={
                            openRequest
                          }
                        >
                          Request this food
                          <span
                            style={{
                              marginLeft: 5,
                            }}
                          >
                            →
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* ===================================================
            REQUEST MODAL
            =================================================== */}

        {isRequestOpen &&
          selectedItem && (
            <div
              className="receiver-modal-backdrop"
              onClick={() =>
                setIsRequestOpen(false)
              }
            >
              <div
                className="receiver-small-modal"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="receiver-modal-header">
                  <div>
                    <div className="receiver-modal-kicker">
                      REQUEST FOOD
                    </div>

                    <h2>
                      Confirm your request
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="receiver-close"
                    onClick={() =>
                      setIsRequestOpen(false)
                    }
                  >
                    <Icon
                      name="close"
                      size={17}
                    />
                  </button>
                </div>

                <form
                  className="receiver-form"
                  onSubmit={
                    handleConfirmRequest
                  }
                >
                  <p className="receiver-form-copy">
                    You're requesting{" "}
                    <strong>
                      {selectedItem.name}
                    </strong>
                    . Confirm the number of people
                    you'll serve so the donor can
                    prepare the right quantity.
                  </p>

                  <label className="receiver-field">
                    <span>
                      Number of people
                    </span>

                    <input
                      type="number"
                      min="1"
                      max={
                        selectedItem.quantity
                      }
                      value={
                        expectedPeople
                      }
                      onChange={(event) =>
                        setExpectedPeople(
                          event.target.value
                        )
                      }
                      required
                    />
                  </label>

                  <label className="receiver-field">
                    <span>
                      Point of contact
                    </span>

                    <input
                      type="text"
                      value={contactName}
                      onChange={(event) =>
                        setContactName(
                          event.target.value
                        )
                      }
                      placeholder="Enter contact name"
                      required
                    />
                  </label>

                  <div
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      background:
                        "#F3F9F7",
                      border:
                        "1px solid #E2EFEB",
                      color:
                        COLORS.muted,
                      fontSize: 9,
                      lineHeight: 1.55,
                      marginTop: 5,
                    }}
                  >
                    <strong
                      style={{
                        color:
                          COLORS.greenDark,
                      }}
                    >
                      MealBridge safety note:
                    </strong>{" "}
                    Please verify pickup timing and
                    food handling requirements with
                    the donor before collection.
                  </div>

                  <div className="receiver-form-actions">
                    <button
                      type="button"
                      className="receiver-cancel"
                      onClick={() =>
                        setIsRequestOpen(
                          false
                        )
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="receiver-confirm"
                    >
                      Confirm request
                      <span
                        style={{
                          marginLeft: 5,
                        }}
                      >
                        →
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        {/* ===================================================
            TOAST
            =================================================== */}

        {toast && (
          <div className="receiver-toast">
            {toast.message}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useUser, useClerk } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

/* =========================================================
   MEALBRIDGE — PREMIUM LANDING PAGE
   ========================================================= */

const partnerNames = [
  "Food Bank NY",
  "Shelter House",
  "Whole Foods",
  "Marriott",
  "Red Cross",
  "Rescue Mission",
  "Food Bank NY",
  "Shelter House",
  "Whole Foods",
  "Marriott",
  "Red Cross",
  "Rescue Mission",
  "Food Bank NY",
  "Shelter House",
  "Whole Foods",
  "Marriott",
  "Red Cross",
  "Rescue Mission"
];

const features = [
  {
    icon: "📍",
    title: "Live Delivery Tracking",
    description:
      "Track every donation from pickup to successful delivery with real-time status updates.",
    color: "blue",
  },
  {
    icon: "⚡",
    title: "Smart Logistics",
    description:
      "Intelligently connect donations with nearby partners for faster and more efficient delivery.",
    color: "cyan",
  },
  {
    icon: "🛡️",
    title: "Verified Network",
    description:
      "Connect only with verified restaurants, NGOs, shelters and trusted delivery partners.",
    color: "emerald",
  },
  {
    icon: "🔔",
    title: "Instant Notifications",
    description:
      "Receive immediate updates about donations, pickups, matching and successful deliveries.",
    color: "violet",
  },
  {
    icon: "👥",
    title: "Role-Based Dashboards",
    description:
      "Personalized experiences built specifically for donors, receivers, drivers and administrators.",
    color: "orange",
  },
  {
    icon: "📸",
    title: "QR & Photo Verification",
    description:
      "Securely verify pickups and deliveries using QR codes and image-based proof.",
    color: "pink",
  },
];

const crisisCards = [
  {
    icon: "🍽️",
    title: "Restaurant Surplus",
    description:
      "Restaurants and food businesses generate large amounts of surplus food that can still serve communities.",
    url: "https://wri-india.org/perspectives/defining-food-waste-sustainable-food-systems",
    tag: "FOOD WASTE",
  },
  {
    icon: "🚚",
    title: "Inefficient Distribution",
    description:
      "Without real-time coordination, valuable surplus food can expire before reaching people who need it.",
    url: "https://blog.globalialogisticsnetwork.com/2024/06/05/the-logistics-of-food-how-emerging-transportation-and-logistics-technology-trends-can-help-to-reduce-food-waste/",
    tag: "LOGISTICS",
  },
];

const faqItems = [
  {
    question: "Is MealBridge free to use?",
    answer:
      "Yes. MealBridge allows verified donors and recipient organizations to connect at no cost. Optional transportation services may be provided through delivery partners based on availability.",
  },
  {
    question: "How do restaurants donate food?",
    answer:
      "Restaurants can list surplus food by entering details such as food type, quantity, preparation time and expiry information. Nearby verified organizations can then respond to the donation.",
  },
  {
    question: "How is food quality ensured?",
    answer:
      "Food safety is a priority. Donors provide preparation details, expiry information and images that can be evaluated through MealBridge's verification workflow.",
  },
  {
    question: "Who can receive donated food?",
    answer:
      "Verified NGOs, shelters, orphanages and other eligible community organizations can use MealBridge to discover and receive available food donations.",
  },
];

/* =========================================================
   ANIMATIONS
   ========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* =========================================================
   COUNTER
   ========================================================= */

function Counter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let start = 0;
    const duration = 1600;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        start = value;
        clearInterval(timer);
      }

      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [started, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* =========================================================
   FLOATING ORB
   ========================================================= */

function FloatingOrb({ className }) {
  return (
    <motion.div
      className={`floating-orb ${className}`}
      animate={{
        y: [0, -25, 0],
        x: [0, 15, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* =========================================================
   PREMIUM HERO VISUAL
   ========================================================= */

function PremiumHeroVisual() {
  return (
    <div className="premium-hero-visual">

      <div className="hero-visual-glow hero-glow-one" />
      <div className="hero-visual-glow hero-glow-two" />

      <motion.div
        className="hero-dashboard"
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          y: -8,
          rotateX: 1,
          rotateY: -1,
        }}
      >

        <div className="hero-dashboard-header">
          <div className="hero-window-dots">
            <span />
            <span />
            <span />
          </div>

          <div className="hero-live-status">
            <span className="hero-live-dot" />
            LIVE NETWORK
          </div>
        </div>

        <div className="hero-dashboard-title-row">
          <div>
            <span className="hero-dashboard-label">
              FOOD RESCUE NETWORK
            </span>

            <h3>Donation coordination</h3>
          </div>

          <div className="hero-dashboard-date">
            <span>Today</span>
            <strong>24/7</strong>
          </div>
        </div>

        <div className="hero-map">

          <div className="hero-map-grid" />

          <div className="hero-map-glow" />

          <svg
            className="hero-route"
            viewBox="0 0 500 250"
            preserveAspectRatio="none"
          >
            <path
              d="M75 185 C155 140, 180 65, 265 105 S355 205, 430 65"
              fill="none"
              stroke="rgba(16,185,129,0.28)"
              strokeWidth="7"
              strokeLinecap="round"
            />

            <motion.path
              d="M75 185 C155 140, 180 65, 265 105 S355 205, 430 65"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="10 12"
              animate={{
                strokeDashoffset: [0, -100],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>

          <motion.div
            className="hero-map-location restaurant-location"
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
            }}
          >
            <div className="location-pulse" />
            <span>🍽️</span>
          </motion.div>

          <motion.div
            className="hero-driver"
            animate={{
              left: ["23%", "49%", "72%"],
              top: ["67%", "45%", "32%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            🚚
          </motion.div>

          <motion.div
            className="hero-map-location ngo-location"
            animate={{
              scale: [1, 1.08, 1],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
            }}
          >
            <div className="location-pulse blue-pulse" />
            <span>❤️</span>
          </motion.div>

          <div className="hero-map-label restaurant-map-label">
            <strong>Green Bowl</strong>
            <small>Restaurant</small>
          </div>

          <div className="hero-map-label ngo-map-label">
            <strong>Hope Center</strong>
            <small>NGO • 2.4 km</small>
          </div>
        </div>

        <div className="hero-dashboard-stats">

          <div className="hero-stat-card">
            <div className="hero-stat-icon green-stat">
              ✓
            </div>

            <div>
              <span>Matched</span>
              <strong>128</strong>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon blue-stat">
              ⚡
            </div>

            <div>
              <span>Active</span>
              <strong>42</strong>
            </div>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon orange-stat">
              🍱
            </div>

            <div>
              <span>Meals</span>
              <strong>3.8K</strong>
            </div>
          </div>
        </div>

        <div className="hero-active-delivery">

          <div className="active-delivery-left">
            <div className="active-delivery-icon">
              🚚
            </div>

            <div>
              <span>ACTIVE DELIVERY</span>
              <strong>Fresh Meal Donation</strong>
            </div>
          </div>

          <div className="hero-eta">
            <span>ETA</span>
            <strong>12 min</strong>
          </div>
        </div>

        <div className="hero-progress">
          <div className="hero-progress-top">
            <span>Pickup confirmed</span>
            <strong>72%</strong>
          </div>

          <div className="hero-progress-track">
            <motion.div
              className="hero-progress-value"
              animate={{
                width: ["42%", "72%", "92%", "72%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="premium-floating-card matched-card"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="premium-floating-icon success-icon">
          ✓
        </div>

        <div>
          <strong>Donation matched</strong>
          <span>Just now • 2.4 km away</span>
        </div>
      </motion.div>

      <motion.div
        className="premium-floating-card meals-card"
        animate={{
          y: [0, 9, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="premium-floating-icon meal-icon">
          🍱
        </div>

        <div>
          <strong>84 meals rescued</strong>
          <span>This week</span>
        </div>
      </motion.div>

      <motion.div
        className="hero-ai-badge"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
        }}
      >
        <span className="ai-badge-icon">✦</span>

        <div>
          <strong>AI MATCHING</strong>
          <small>Smart • Fast • Verified</small>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(0);

  const navigate = useNavigate();

  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [targetRole, setTargetRole] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroY = useTransform(
    smoothProgress,
    [0, 0.3],
    [0, -80]
  );

  /* =========================================================
     ROLE HANDLERS
     ========================================================= */

  const handleShareMealClick = () => {
    if (!isSignedIn) {
      sessionStorage.setItem("mealbridge-role", "donor");
      navigate("/login");
      return;
    }

    const activeRole =
      user?.unsafeMetadata?.role ||
      sessionStorage.getItem("mealbridge-role") ||
      "donor";

    if (activeRole === "donor") {
      navigate("/donor-dashboard");
    } else {
      setTargetRole("donor");

      setConfirmTitle(
        "You're signed in as a Receiver"
      );

      setConfirmMessage(
        "To access the Donor Portal, you need to continue with a Donor account."
      );

      setShowSwitchModal(true);
    }
  };

  const handleReceiveSupportClick = () => {
    if (!isSignedIn) {
      sessionStorage.setItem("mealbridge-role", "receiver");
      navigate("/login");
      return;
    }

    const activeRole =
      user?.unsafeMetadata?.role ||
      sessionStorage.getItem("mealbridge-role") ||
      "receiver";

    if (activeRole === "receiver") {
      navigate("/receiver-dashboard");
    } else {
      setTargetRole("receiver");

      setConfirmTitle(
        "You're signed in as a Donor"
      );

      setConfirmMessage(
        "To access the Receiver Portal, you need to continue with a Receiver account."
      );

      setShowSwitchModal(true);
    }
  };

  const handleContinueSwitch = async () => {
    setShowSwitchModal(false);

    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "mealbridge-role",
        targetRole
      );
    }

    navigate("/login");
  };

  const handleRoleAction = (role) => {
    if (role === "donor") {
      handleShareMealClick();
    } else {
      handleReceiveSupportClick();
    }
  };

  return (
    <div className="mealbridge-page">

      {/* =====================================================
          PREMIUM HERO
          ===================================================== */}

      <style>{`

        /* =====================================================
           PREMIUM HERO
           ===================================================== */

        .hero-section {
          position: relative;
          min-height: 760px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 75% 35%,
              rgba(16,185,129,.14),
              transparent 32%
            ),
            radial-gradient(
              circle at 15% 65%,
              rgba(59,130,246,.10),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #f8fffc 0%,
              #f7fbff 48%,
              #ffffff 100%
            );
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          opacity: .42;
          background-image:
            linear-gradient(
              rgba(15,23,42,.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15,23,42,.045) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0,0,0,.7) 55%,
            transparent 100%
          );
        }

        /* =====================================================
           ONLY WIDTH ADJUSTMENT
           ===================================================== */

        .hero-content {
          position: relative;
          z-index: 2;

          /* CHANGED:
             Previously:
             width: min(1240px, calc(100% - 48px));

             Now the hero uses the complete available
             screen width while keeping safe side spacing.
          */
          width: 100%;
          box-sizing: border-box;
          padding-left: 24px;
          padding-right: 24px;

          margin: 0 auto;
          min-height: 760px;

          display: grid;
          grid-template-columns:
            minmax(0, .95fr)
            minmax(520px, 1.05fr);

          align-items: center;
          gap: 55px;

          padding-top: 95px;
          padding-bottom: 100px;
        }

        .hero-copy {
          position: relative;
          z-index: 5;
          max-width: 650px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(16,185,129,.20);
          box-shadow:
            0 10px 30px rgba(15,23,42,.06),
            inset 0 1px 0 rgba(255,255,255,.8);
          color: #047857;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .13em;
          backdrop-filter: blur(14px);
        }

        .badge-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow:
            0 0 0 5px rgba(16,185,129,.10),
            0 0 20px rgba(16,185,129,.45);
        }

        .hero-title {
          margin: 25px 0 22px;
          max-width: 700px;
          color: #071426;
          font-size: clamp(54px, 5.2vw, 82px);
          line-height: .98;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .gradient-text {
          display: inline;
          background: linear-gradient(
            100deg,
            #059669 0%,
            #10b981 42%,
            #0891b2 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-description {
          max-width: 610px;
          margin: 0;
          color: #64748b;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 34px;
        }

        .primary-button,
        .secondary-button {
          min-height: 56px;
          padding: 0 21px;
          border-radius: 16px;
          border: 1px solid transparent;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: .25s ease;
        }

        .primary-button {
          color: white;
          background:
            linear-gradient(
              135deg,
              #059669,
              #10b981
            );
          box-shadow:
            0 14px 35px rgba(16,185,129,.25),
            inset 0 1px 0 rgba(255,255,255,.2);
        }

        .primary-button:hover {
          box-shadow:
            0 20px 45px rgba(16,185,129,.34);
          transform: translateY(-2px);
        }

        .secondary-button {
          color: #0f172a;
          background: rgba(255,255,255,.78);
          border-color: rgba(15,23,42,.10);
          box-shadow: 0 10px 30px rgba(15,23,42,.06);
          backdrop-filter: blur(14px);
        }

        .secondary-button:hover {
          border-color: rgba(16,185,129,.25);
          box-shadow: 0 15px 35px rgba(15,23,42,.09);
          transform: translateY(-2px);
        }

        .button-arrow {
          font-size: 18px;
          transition: transform .25s ease;
        }

        .primary-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-top: 32px;
        }

        .avatar-stack {
          display: flex;
          align-items: center;
        }

        .avatar-stack span {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          margin-left: -7px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #f8fffc;
          box-shadow: 0 5px 15px rgba(15,23,42,.08);
          font-size: 16px;
        }

        .avatar-stack span:first-child {
          margin-left: 0;
        }

        .hero-trust strong,
        .hero-trust small {
          display: block;
        }

        .hero-trust strong {
          color: #1e293b;
          font-size: 13px;
        }

        .hero-trust small {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 11px;
        }

        .hero-mini-stats {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 1px solid rgba(15,23,42,.08);
          max-width: 600px;
        }

        .hero-mini-stats div:not(.mini-divider) {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-mini-stats strong {
          color: #0f172a;
          font-size: 17px;
          letter-spacing: -.02em;
        }

        .hero-mini-stats span {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .05em;
        }

        .mini-divider {
          width: 1px;
          height: 30px;
          background: rgba(15,23,42,.10);
        }

        /* =====================================================
           HERO VISUAL
           ===================================================== */

        .hero-visual-wrapper {
          position: relative;
          min-height: 590px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }

        .premium-hero-visual {
          position: relative;
          width: 100%;
          max-width: 620px;
          min-height: 590px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-visual-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(35px);
          pointer-events: none;
        }

        .hero-glow-one {
          width: 260px;
          height: 260px;
          right: 3%;
          top: 8%;
          background: rgba(16,185,129,.17);
        }

        .hero-glow-two {
          width: 230px;
          height: 230px;
          left: 5%;
          bottom: 8%;
          background: rgba(59,130,246,.13);
        }

        .hero-dashboard {
          position: relative;
          z-index: 3;
          width: min(100%, 555px);
          padding: 18px;
          border-radius: 27px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.94),
              rgba(247,250,252,.86)
            );
          border: 1px solid rgba(255,255,255,.85);
          box-shadow:
            0 40px 100px rgba(15,23,42,.15),
            0 10px 35px rgba(16,185,129,.07),
            inset 0 1px 0 rgba(255,255,255,1);
          backdrop-filter: blur(24px);
          transform-style: preserve-3d;
        }

        .hero-dashboard::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,.8),
              transparent 35%,
              transparent 70%,
              rgba(16,185,129,.06)
            );
        }

        .hero-dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 3px 16px;
        }

        .hero-window-dots {
          display: flex;
          gap: 5px;
        }

        .hero-window-dots span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .hero-live-status {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(16,185,129,.08);
          color: #047857;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .hero-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px rgba(16,185,129,.6);
        }

        .hero-dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 15px;
        }

        .hero-dashboard-label {
          display: block;
          margin-bottom: 5px;
          color: #10b981;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .13em;
        }

        .hero-dashboard-title-row h3 {
          margin: 0;
          color: #0f172a;
          font-size: 19px;
          letter-spacing: -.025em;
        }

        .hero-dashboard-date {
          text-align: right;
        }

        .hero-dashboard-date span,
        .hero-dashboard-date strong {
          display: block;
        }

        .hero-dashboard-date span {
          color: #94a3b8;
          font-size: 9px;
        }

        .hero-dashboard-date strong {
          margin-top: 2px;
          color: #334155;
          font-size: 12px;
        }

        .hero-map {
          position: relative;
          height: 245px;
          overflow: hidden;
          border-radius: 19px;
          background:
            radial-gradient(
              circle at 30% 30%,
              rgba(16,185,129,.13),
              transparent 25%
            ),
            radial-gradient(
              circle at 75% 70%,
              rgba(59,130,246,.10),
              transparent 30%
            ),
            #f4f9f7;
          border: 1px solid rgba(15,23,42,.05);
        }

        .hero-map-grid {
          position: absolute;
          inset: 0;
          opacity: .55;
          background-image:
            linear-gradient(
              rgba(15,23,42,.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(15,23,42,.045) 1px,
              transparent 1px
            );
          background-size: 29px 29px;
        }

        .hero-map-glow {
          position: absolute;
          width: 230px;
          height: 230px;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
          border-radius: 50%;
          background: rgba(16,185,129,.06);
          filter: blur(25px);
        }

        .hero-route {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-map-location {
          position: absolute;
          z-index: 4;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: white;
          border: 4px solid rgba(255,255,255,.8);
          box-shadow:
            0 8px 22px rgba(15,23,42,.13);
          font-size: 17px;
        }

        .restaurant-location {
          left: 10%;
          top: 66%;
        }

        .ngo-location {
          right: 9%;
          top: 18%;
        }

        .location-pulse {
          position: absolute;
          inset: -7px;
          border-radius: inherit;
          border: 1px solid rgba(16,185,129,.25);
          animation: heroPulse 2s infinite;
        }

        .blue-pulse {
          border-color: rgba(59,130,246,.28);
        }

        @keyframes heroPulse {
          0% {
            opacity: .9;
            transform: scale(.9);
          }

          70% {
            opacity: 0;
            transform: scale(1.35);
          }

          100% {
            opacity: 0;
          }
        }

        .hero-driver {
          position: absolute;
          z-index: 5;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #0f172a;
          border: 3px solid white;
          box-shadow:
            0 10px 25px rgba(15,23,42,.22);
          font-size: 17px;
          transform: translate(-50%,-50%);
        }

        .hero-map-label {
          position: absolute;
          z-index: 6;
          padding: 7px 10px;
          border-radius: 9px;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(255,255,255,.9);
          box-shadow: 0 6px 20px rgba(15,23,42,.08);
          backdrop-filter: blur(10px);
        }

        .hero-map-label strong,
        .hero-map-label small {
          display: block;
        }

        .hero-map-label strong {
          color: #1e293b;
          font-size: 9px;
        }

        .hero-map-label small {
          margin-top: 2px;
          color: #94a3b8;
          font-size: 7px;
        }

        .restaurant-map-label {
          left: 7%;
          top: 49%;
        }

        .ngo-map-label {
          right: 4%;
          top: 41%;
        }

        .hero-dashboard-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .hero-stat-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px;
          border-radius: 13px;
          background: rgba(255,255,255,.72);
          border: 1px solid rgba(15,23,42,.055);
        }

        .hero-stat-icon {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 900;
        }

        .green-stat {
          background: rgba(16,185,129,.11);
          color: #059669;
        }

        .blue-stat {
          background: rgba(59,130,246,.11);
          color: #2563eb;
        }

        .orange-stat {
          background: rgba(249,115,22,.11);
          color: #ea580c;
        }

        .hero-stat-card span,
        .hero-stat-card strong {
          display: block;
        }

        .hero-stat-card span {
          color: #94a3b8;
          font-size: 7px;
          font-weight: 700;
        }

        .hero-stat-card strong {
          margin-top: 2px;
          color: #0f172a;
          font-size: 14px;
        }

        .hero-active-delivery {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding: 12px;
          border-radius: 14px;
          background: #0f172a;
          box-shadow: 0 10px 25px rgba(15,23,42,.13);
        }

        .active-delivery-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .active-delivery-icon {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(16,185,129,.14);
          font-size: 14px;
        }

        .active-delivery-left span,
        .active-delivery-left strong {
          display: block;
        }

        .active-delivery-left span {
          color: #34d399;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .active-delivery-left strong {
          margin-top: 3px;
          color: white;
          font-size: 10px;
        }

        .hero-eta {
          text-align: right;
        }

        .hero-eta span,
        .hero-eta strong {
          display: block;
        }

        .hero-eta span {
          color: #94a3b8;
          font-size: 7px;
        }

        .hero-eta strong {
          margin-top: 2px;
          color: white;
          font-size: 12px;
        }

        .hero-progress {
          margin-top: 11px;
          padding: 0 2px 2px;
        }

        .hero-progress-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .hero-progress-top span {
          color: #94a3b8;
          font-size: 8px;
        }

        .hero-progress-top strong {
          color: #059669;
          font-size: 8px;
        }

        .hero-progress-track {
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #e2e8f0;
        }

        .hero-progress-value {
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              #10b981,
              #06b6d4
            );
          box-shadow: 0 0 12px rgba(16,185,129,.25);
        }

        .premium-floating-card {
          position: absolute;
          z-index: 8;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border-radius: 15px;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(255,255,255,.9);
          box-shadow:
            0 18px 40px rgba(15,23,42,.12);
          backdrop-filter: blur(18px);
        }

        .matched-card {
          right: -10px;
          top: 90px;
        }

        .meals-card {
          left: -12px;
          bottom: 86px;
        }

        .premium-floating-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          font-size: 14px;
        }

        .success-icon {
          background: rgba(16,185,129,.11);
          color: #059669;
        }

        .meal-icon {
          background: rgba(59,130,246,.10);
        }

        .premium-floating-card strong,
        .premium-floating-card span {
          display: block;
        }

        .premium-floating-card strong {
          color: #1e293b;
          font-size: 10px;
        }

        .premium-floating-card span {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 8px;
        }

        .hero-ai-badge {
          position: absolute;
          z-index: 9;
          right: 2px;
          bottom: 24px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border-radius: 13px;
          background: rgba(15,23,42,.92);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 15px 35px rgba(15,23,42,.20);
        }

        .ai-badge-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: linear-gradient(
            135deg,
            #10b981,
            #06b6d4
          );
          color: white;
          font-size: 13px;
        }

        .hero-ai-badge strong,
        .hero-ai-badge small {
          display: block;
        }

        .hero-ai-badge strong {
          color: white;
          font-size: 8px;
          letter-spacing: .08em;
        }

        .hero-ai-badge small {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 7px;
        }

        .hero-scroll {
          position: absolute;
          left: 50%;
          bottom: 28px;
          z-index: 5;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .scroll-line {
          width: 1px;
          height: 35px;
          background: linear-gradient(
            to bottom,
            #10b981,
            transparent
          );
        }

        /* =====================================================
           RESPONSIVE HERO
           ===================================================== */

        @media (max-width: 1100px) {

          .hero-content {
            grid-template-columns: 1fr;
            gap: 20px;
            padding-top: 75px;
          }

          .hero-copy {
            max-width: 800px;
          }

          .hero-description {
            max-width: 700px;
          }

          .hero-visual-wrapper {
            min-height: 570px;
          }

          .premium-hero-visual {
            max-width: 650px;
          }
        }

        @media (max-width: 700px) {

          .hero-section {
            min-height: auto;
          }

          .hero-content {
            width: 100%;
            min-height: auto;
            padding: 55px 14px 80px;
          }

          .hero-title {
            font-size: clamp(45px, 13vw, 65px);
            line-height: 1;
          }

          .hero-description {
            font-size: 15px;
            line-height: 1.65;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-mini-stats {
            gap: 12px;
          }

          .hero-mini-stats strong {
            font-size: 14px;
          }

          .hero-mini-stats span {
            font-size: 8px;
          }

          .hero-visual-wrapper {
            min-height: 500px;
          }

          .premium-hero-visual {
            min-height: 500px;
          }

          .hero-dashboard {
            padding: 12px;
            border-radius: 21px;
          }

          .hero-map {
            height: 205px;
          }

          .hero-dashboard-stats {
            gap: 5px;
          }

          .hero-stat-card {
            padding: 8px;
          }

          .hero-stat-icon {
            width: 26px;
            height: 26px;
          }

          .hero-stat-card strong {
            font-size: 11px;
          }

          .hero-stat-card span {
            font-size: 6px;
          }

          .premium-floating-card {
            padding: 9px;
          }

          .matched-card {
            right: -3px;
            top: 65px;
          }

          .meals-card {
            left: -3px;
            bottom: 55px;
          }

          .hero-ai-badge {
            right: 0;
            bottom: 3px;
          }

          .hero-scroll {
            display: none;
          }
        }

        @media (max-width: 480px) {

          .hero-dashboard-date {
            display: none;
          }

          .hero-dashboard-title-row h3 {
            font-size: 16px;
          }

          .hero-map {
            height: 180px;
          }

          .hero-dashboard-stats {
            display: none;
          }

          .hero-active-delivery {
            margin-top: 9px;
          }

          .premium-floating-card {
            transform: scale(.88);
          }

          .matched-card {
            right: -22px;
          }

          .meals-card {
            left: -22px;
          }
        }

      `}</style>

      {/* =====================================================
          SCROLL PROGRESS
          ===================================================== */}

      <motion.div
        className="scroll-progress"
        style={{ scaleX: smoothProgress }}
      />

      <Navbar />

      <main>

        {/* ===================================================
            PREMIUM HERO
            =================================================== */}

        <section
          className="hero-section"
          id="hero"
        >
          <div className="hero-background">

            <div className="hero-grid" />

            <FloatingOrb className="orb-one" />
            <FloatingOrb className="orb-two" />
            <FloatingOrb className="orb-three" />

          </div>

          {/* Hero Visual Graphic (Right) */}
          <motion.div
            className="hero-content"
            style={{ y: heroY }}
          >

            {/* LEFT CONTENT */}

            <motion.div
              className="hero-copy"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >

              <motion.div
                className="hero-badge"
                variants={fadeUp}
              >
                <span className="badge-pulse" />
                AI-POWERED FOOD RESCUE
              </motion.div>

              <motion.h1
                className="hero-title"
                variants={fadeUp}
              >
                Turn surplus food into{" "}
                <span className="gradient-text">
                  meaningful impact.
                </span>
              </motion.h1>

              <motion.p
                className="hero-description"
                variants={fadeUp}
              >
                MealBridge intelligently connects restaurants,
                hotels and event organizers with verified NGOs,
                shelters and community organizations — helping
                good food reach people before it goes to waste.
              </motion.p>

              <motion.div
                className="hero-actions"
                variants={fadeUp}
              >

                <motion.button
                  className="primary-button"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={handleShareMealClick}
                >
                  <span>🍱</span>

                  Share a Meal

                  <span className="button-arrow">
                    →
                  </span>
                </motion.button>

                <motion.button
                  className="secondary-button"
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  onClick={handleReceiveSupportClick}
                >
                  <span>🤝</span>

                  Receive Support
                </motion.button>

              </motion.div>

              <motion.div
                className="hero-trust"
                variants={fadeUp}
              >

                <div className="avatar-stack">
                  <span>👩🏻</span>
                  <span>👨🏽</span>
                  <span>👩🏾</span>
                  <span>👨🏻</span>
                </div>

                <div>
                  <strong>
                    Making an impact together
                  </strong>

                  <small>
                    Trusted by donors & community partners
                  </small>
                </div>

              </motion.div>

              <motion.div
                className="hero-mini-stats"
                variants={fadeUp}
              >

                <div>
                  <strong>24/7</strong>
                  <span>Live coordination</span>
                </div>

                <div className="mini-divider" />

                <div>
                  <strong>&lt; 15m</strong>
                  <span>Smart matching</span>
                </div>

                <div className="mini-divider" />

                <div>
                  <strong>100%</strong>
                  <span>Verified partners</span>
                </div>

              </motion.div>

            </motion.div>

            {/* RIGHT PREMIUM VISUAL */}

            <div className="hero-visual-wrapper">
              <PremiumHeroVisual />
            </div>

          </motion.div>

          <motion.div
            className="hero-scroll"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span>SCROLL TO EXPLORE</span>
            <div className="scroll-line" />
          </motion.div>

        </section>

        {/* ===================================================
            IMPACT STATS
            =================================================== */}

        <section className="impact-section">

          <div className="impact-container">

            <motion.div
              className="impact-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.3,
              }}
              variants={fadeUp}
            >

              <span className="section-eyebrow">
                OUR MISSION
              </span>

              <h2>
                Small actions.
                <span> Massive impact.</span>
              </h2>

            </motion.div>

            <div className="impact-grid">

              <motion.div
                className="impact-stat"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
              >

                <strong>
                  <Counter
                    value={10000}
                    suffix="+"
                  />
                </strong>

                <span>
                  Meals with potential to be rescued
                </span>

              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.1,
                }}
              >

                <strong>
                  <Counter
                    value={500}
                    suffix="+"
                  />
                </strong>

                <span>
                  Community organizations
                </span>

              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.2,
                }}
              >

                <strong>
                  <Counter
                    value={50}
                    suffix="+"
                  />
                </strong>

                <span>
                  Food partners
                </span>

              </motion.div>

              <motion.div
                className="impact-stat"
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.3,
                }}
              >

                <strong>24/7</strong>

                <span>
                  Smart coordination
                </span>

              </motion.div>

            </div>
          </div>
        </section>

        {/* ===================================================
            PARTNERS
            =================================================== */}

        <section className="partners-section">

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-eyebrow">
                BUILT FOR COLLABORATION
              </span>

              <h2>
                Connecting the people
                <br />
                <span>
                  who can make a difference.
                </span>
              </h2>

            </div>

            <div className="partner-marquee-wrapper">

              <div className="partner-fade left" />

              <motion.div
                className="partner-track"
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >

                {[...partnerNames, ...partnerNames].map(
                  (name, index) => (
                    <div
                      className="partner-logo"
                      key={`${name}-${index}`}
                    >
                      <span className="partner-dot" />
                      {name}
                    </div>
                  )
                )}

              </motion.div>

              <div className="partner-fade right" />

            </div>

          </div>
        </section>

        {/* ===================================================
            CRISIS
            =================================================== */}

        <section className="crisis-section">

          <div className="section-container">

            <motion.div
              className="crisis-intro"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={fadeUp}
            >

              <div>

                <span className="section-eyebrow">
                  THE PROBLEM
                </span>

                <h2>
                  Food shouldn't become
                  <span className="red-gradient">
                    waste.
                  </span>
                </h2>

              </div>

              <p>
                The problem isn't always a lack of food.
                It's often a lack of coordination. MealBridge
                uses technology to close that gap.
              </p>

            </motion.div>

            <div className="crisis-grid">

              {crisisCards.map((card, index) => (

                <motion.a
                  key={card.title}
                  href={card.url}
                  target="_blank"
                  rel="noreferrer"
                  className="crisis-card"
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -10,
                  }}
                >

                  <div className="crisis-card-top">

                    <span className="crisis-icon">
                      {card.icon}
                    </span>

                    <span className="crisis-tag">
                      {card.tag}
                    </span>

                  </div>

                  <h3>
                    {card.title}
                  </h3>

                  <p>
                    {card.description}
                  </p>

                  <div className="crisis-card-link">
                    Explore the problem
                    <span>↗</span>
                  </div>

                </motion.a>

              ))}

            </div>
          </div>
        </section>

        {/* ===================================================
            HOW IT WORKS
            =================================================== */}

        <section className="how-section">

          <div className="section-container">

            <div className="section-heading centered">

              <span className="section-eyebrow">
                HOW MEALBRIDGE WORKS
              </span>

              <h2>
                From surplus to impact
                <span> in four steps.</span>
              </h2>

            </div>

            <div className="steps-grid">

              {[
                {
                  number: "01",
                  icon: "📦",
                  title: "List surplus",
                  text:
                    "Donors add available food, quantity, pickup time and expiry information.",
                },
                {
                  number: "02",
                  icon: "🤖",
                  title: "Smart matching",
                  text:
                    "MealBridge identifies suitable verified organizations nearby.",
                },
                {
                  number: "03",
                  icon: "🚚",
                  title: "Coordinate pickup",
                  text:
                    "Drivers and partners coordinate pickup through the platform.",
                },
                {
                  number: "04",
                  icon: "❤️",
                  title: "Make an impact",
                  text:
                    "Food reaches people and every successful delivery becomes measurable impact.",
                },
              ].map((step, index) => (

                <motion.div
                  className="step-card"
                  key={step.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                >

                  <div className="step-number">
                    {step.number}
                  </div>

                  <div className="step-icon">
                    {step.icon}
                  </div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>

                  {index < 3 && (
                    <div className="step-arrow">
                      →
                    </div>
                  )}

                </motion.div>

              ))}

            </div>
          </div>
        </section>

        {/* ===================================================
            FEATURES
            =================================================== */}

        <section
          className="features-section"
          id="features"
        >

          <div className="section-container">

            <motion.div
              className="section-heading"
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
              }}
              variants={fadeUp}
            >

              <span className="section-eyebrow">
                POWERFUL PLATFORM
              </span>

              <h2>
                Everything needed to
                <span> move food faster.</span>
              </h2>

              <p>
                One intelligent platform for food donors,
                NGOs, delivery partners and administrators.
              </p>

            </motion.div>

            <div className="features-grid">

              {features.map((feature, index) => (

                <motion.article
                  key={feature.title}
                  className={`feature-card feature-${feature.color}`}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -8,
                  }}
                >

                  <div className="feature-top">

                    <div className="feature-icon">
                      {feature.icon}
                    </div>

                    <span className="feature-number">
                      0{index + 1}
                    </span>

                  </div>

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.description}
                  </p>

                  <div className="feature-line" />

                </motion.article>

              ))}

            </div>
          </div>
        </section>

        {/* ===================================================
            AI SECTION
            =================================================== */}

        <section className="ai-section">

          <div className="ai-glow" />

          <div className="section-container">

            <div className="ai-content">

              <motion.div
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
              >

                <span className="section-eyebrow light">
                  INTELLIGENT FOOD RESCUE
                </span>

                <h2>
                  Technology that
                  <span> understands timing.</span>
                </h2>

                <p>
                  Food has a limited window. MealBridge is
                  designed around that reality — helping donors,
                  receivers and delivery partners coordinate
                  before that window closes.
                </p>

                <div className="ai-points">

                  <div>
                    <span>✓</span>
                    <p>
                      Smart organization matching
                    </p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>
                      Real-time delivery coordination
                    </p>
                  </div>

                  <div>
                    <span>✓</span>
                    <p>
                      Food verification workflow
                    </p>
                  </div>

                </div>

                <button
                  className="ai-button"
                  onClick={handleShareMealClick}
                >
                  Start rescuing food →
                </button>

              </motion.div>

              <motion.div
                className="ai-visual"
                initial={{
                  opacity: 0,
                  scale: 0.85,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
              >

                <div className="ai-orbit orbit-one" />
                <div className="ai-orbit orbit-two" />

                <motion.div
                  className="ai-core"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 30px rgba(52,211,153,.2)",
                      "0 0 80px rgba(52,211,153,.4)",
                      "0 0 30px rgba(52,211,153,.2)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <span>MB</span>
                  <small>AI</small>
                </motion.div>

                <motion.div
                  className="ai-node node-one"
                  animate={{
                    y: [-8, 8, -8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  📍
                </motion.div>

                <motion.div
                  className="ai-node node-two"
                  animate={{
                    y: [8, -8, 8],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                >
                  🍱
                </motion.div>

                <motion.div
                  className="ai-node node-three"
                  animate={{
                    y: [-6, 6, -6],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                  }}
                >
                  🚚
                </motion.div>

              </motion.div>

            </div>
          </div>
        </section>

        {/* ===================================================
            FAQ
            =================================================== */}

        <section
          className="faq-section"
          id="faq"
        >

          <div className="section-container faq-container">

            <motion.div
              className="faq-heading"
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
            >

              <span className="section-eyebrow">
                FAQ
              </span>

              <h2>
                Questions?
                <span> We've got answers.</span>
              </h2>

              <p>
                Everything donors and community partners need
                to know about MealBridge.
              </p>

            </motion.div>

            <div className="faq-list">

              {faqItems.map((item, index) => {

                const isOpen = activeFaq === index;

                return (
                  <motion.div
                    key={item.question}
                    className={`faq-item ${
                      isOpen ? "faq-open" : ""
                    }`}
                    onClick={() =>
                      setActiveFaq(
                        isOpen ? null : index
                      )
                    }
                    initial={{
                      opacity: 0,
                      x: 25,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: index * 0.07,
                    }}
                  >

                    <div className="faq-question">

                      <span>
                        {item.question}
                      </span>

                      <motion.div
                        animate={{
                          rotate: isOpen ? 45 : 0,
                        }}
                      >
                        +
                      </motion.div>

                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      className="faq-answer-wrapper"
                    >

                      <p>
                        {item.answer}
                      </p>

                    </motion.div>

                  </motion.div>
                );
              })}

            </div>
          </div>
        </section>

        {/* ===================================================
            FINAL CTA
            =================================================== */}

        <section className="final-cta-section">

          <div className="section-container">

            <motion.div
              className="final-cta"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
            >

              <div className="cta-glow" />

              <div className="cta-content">

                <span className="section-eyebrow light">
                  JOIN THE MOVEMENT
                </span>

                <h2>
                  Don't let good food
                  <br />
                  become waste.
                </h2>

                <p>
                  One donation can become someone's next meal.
                  Start making a difference today.
                </p>

                <div className="cta-actions">

                  <button
                    className="cta-primary"
                    onClick={() =>
                      handleRoleAction("donor")
                    }
                  >
                    🍱 Share a Meal
                  </button>

                  <button
                    className="cta-secondary"
                    onClick={() =>
                      handleRoleAction("receiver")
                    }
                  >
                    🤝 Become a Partner
                  </button>

                </div>

              </div>

              <div className="cta-decoration">

                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <span>
                    MEALBRIDGE • FOOD • IMPACT • COMMUNITY •
                  </span>
                </motion.div>

                <div className="cta-center-icon">
                  ❤️
                </div>

              </div>

            </motion.div>
          </div>
        </section>

      </main>

      <Footer />

      {/* =====================================================
          ROLE SWITCH MODAL
          ===================================================== */}

      {showSwitchModal && (
        <motion.div
          className="role-modal-backdrop"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >

          <motion.div
            className="role-modal"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >

            <button
              className="modal-close"
              onClick={() =>
                setShowSwitchModal(false)
              }
            >
              ×
            </button>

            <div className="modal-icon">
              🔄
            </div>

            <h2>
              {confirmTitle}
            </h2>

            <p>
              {confirmMessage}
            </p>

            <div className="modal-actions">

              <button
                className="modal-cancel"
                onClick={() =>
                  setShowSwitchModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="modal-confirm"
                onClick={handleContinueSwitch}
              >
                Continue
                <span>→</span>
              </button>

            </div>

          </motion.div>
        </motion.div>
      )}

    </div>
  );
}

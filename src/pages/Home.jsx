import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";

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
    title: "Live Delivery Tracking",
    description:
      "Track every donation in real time from pickup to successful delivery.",
    icon: "📍"
  },
  {
    title: "Smart Logistics",
    description:
      "Assigns the fastest delivery partner for timely and efficient transportation.",
    icon: "🚚"
  },
  {
    title: "Verified Network",
    description:
      "Only verified restaurants, NGOs, and partners ensure trusted food distribution.",
    icon: "🛡️"
  },
  {
    title: "Instant Notifications",
    description:
      "Receive real-time updates for donations, pickups, and deliveries.",
    icon: "🔔"
  },
  {
    title: "Role-Based Dashboards",
    description:
      "Personalized dashboards designed for donors, NGOs, drivers, and admins.",
    icon: "📊"
  },
  {
    title: "QR & Photo Verification",
    description:
      "Confirm every pickup and delivery with secure QR codes and image proof.",
    icon: "📸"
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
      "Restaurants can quickly list their surplus food by uploading details such as food type, quantity, preparation time, and expiry location. MealBridge notifies nearby NGOs in real time.",
  },
  {
    question: "How is food quality ensured?",
    answer:
      "Food safety is our priority. Donors provide preparation time, expiry details, and images which are processed through our AI detection system.",
  },
];

const crisisCards = [
  {
    title: "Restaurant Surplus",
    description:
      "Every day restaurants discard thousands of kilograms of perfectly safe food while millions remain hungry.",
    url: "https://wri-india.org/perspectives/defining-food-waste-sustainable-food-systems",
    icon: "🍽️",
  },
  {
    title: "Inefficient Distribution",
    description:
      "Without real-time coordination and transportation, surplus food rarely reaches those who need it before it expires.",
    url: "https://blog.globalialogisticsnetwork.com/2024/06/05/the-logistics-of-food-how-emerging-transportation-and-logistics-technology-trends-can-help-to-reduce-food-waste/",
    icon: "🚚",
  },
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(0);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  // Role Switcher Modal states
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [targetRole, setTargetRole] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const handleShareMealClick = () => {
    if (!isSignedIn) {
      sessionStorage.setItem("mealbridge-role", "donor");
      navigate("/login");
    } else {
      const activeRole = user?.unsafeMetadata?.role || sessionStorage.getItem("mealbridge-role") || "donor";
      if (activeRole === "donor") {
        navigate("/donor-dashboard");
      } else {
        setTargetRole("donor");
        setConfirmTitle("You are currently signed in as a Receiver.");
        setConfirmMessage("To access the Donor Portal, you must sign in with a Donor account.");
        setShowSwitchModal(true);
      }
    }
  };

  const handleReceiveSupportClick = () => {
    if (!isSignedIn) {
      sessionStorage.setItem("mealbridge-role", "receiver");
      navigate("/login");
    } else {
      const activeRole = user?.unsafeMetadata?.role || sessionStorage.getItem("mealbridge-role") || "receiver";
      if (activeRole === "receiver") {
        navigate("/receiver-dashboard");
      } else {
        setTargetRole("receiver");
        setConfirmTitle("You are currently signed in as a Donor.");
        setConfirmMessage("To access the Receiver Portal, you must sign in with a Receiver account.");
        setShowSwitchModal(true);
      }
    }
  };

  const handleContinueSwitch = async () => {
    setShowSwitchModal(false);
    await signOut();
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mealbridge-role", targetRole);
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
    <>
      <Navbar />
      <main className="home-shell">
        
        {/* HERO SECTION */}
        <section className="hero" id="hero">
          <div className="hero-copy">
            <div className="hero-live-badge">
              <span className="live-dot"></span> Live Matching Active
            </div>
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Every surplus meal can become someone’s next meal.
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
            >
              Our intelligent platform ensures that good food never goes to waste by connecting restaurants, hotels and event organizers with NGOs, orphanages, and shelters in real-time.
            </motion.p>

            <div className="hero-actions">
              <motion.button
                className="hero-cta hero-cta-primary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleShareMealClick}
              >
                Share a Meal
              </motion.button>
              <motion.button
                className="hero-cta hero-cta-secondary"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleReceiveSupportClick}
              >
                Receive Support
              </motion.button>
            </div>

            <div className="hero-badges">
              <span>✓ Live Tracking</span>
              <span>✓ Nearby NGO Found</span>
              <span>✓ 24/7 Support</span>
            </div>
          </div>

          {/* Hero Visual Graphic (Right) */}
          <motion.div
            className="hero-visual"
            style={{ 
              padding: 0, 
              overflow: "hidden", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              minHeight: "auto", 
              background: "none", 
              border: "none", 
              boxShadow: "none",
              height: "auto"
            }}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          >
            <img 
              src="/images/delivery_illustration.png" 
              alt="MealBridge Delivery Illustration" 
              style={{ 
                width: "100%", 
                height: "auto", 
                objectFit: "contain", 
                display: "block", 
                borderRadius: "24px",
                boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.08)",
                filter: "saturate(0.80)" 
              }} 
            />
          </motion.div>
        </section>

        {/* TRUSTED PARTNER LOGOS */}
        <section className="section center-section">
          <div className="section-header">
            <p className="eyebrow-pill">Empowering Global Partners</p>
            <h2>Trusted by leading food rescue organizations.</h2>
          </div>
          <div className="partner-marquee">
            <div className="marquee-track">
              {partnerNames.map((name, index) => (
                <div key={`${name}-${index}`} className="partner-pill">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GLOBAL CRISIS / PROBLEM CARDS */}
        <section className="section">
          <div className="section-header center">
            <p className="eyebrow-pill">Global Crisis</p>
            <h2>MealBridge builds a sustainable food ecosystem by connecting food providers with verified organizations through technology.</h2>
          </div>
          <div className="crisis-grid">
            {crisisCards.map((card, idx) => (
              <motion.a
                key={card.title}
                className="crisis-card"
                href={card.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <div className="crisis-icon">{card.icon}</div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <span className="crisis-link">Learn More →</span>
              </motion.a>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="section" id="features">
          <div className="section-header center">
            <p className="eyebrow-pill">POWERFUL FEATURES</p>
            <h2>Designed to keep surplus food moving, fast.</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.article
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="feature-mark">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="section faq-section" id="faq">
          <div className="section-header center">
            <p className="eyebrow-pill">COMMON QUESTIONS</p>
            <h2>Everything donors and receivers want to know.</h2>
          </div>
          <div className="faq-grid">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                className={`accordion-card ${activeFaq === index ? "open" : ""}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <div className="accordion-title">
                  <h3>{item.question}</h3>
                  <span className="accordion-chevron">↓</span>
                </div>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="section cta-section">
          <div className="cta-card">
            <div>
              <h2>Don't Let Good Food Go to Waste.</h2>
              <p>Join MealBridge and help build a world where surplus food reaches every hungry plate.</p>
            </div>
            <div className="cta-actions">
              <button className="hero-cta hero-cta-primary" onClick={() => handleRoleAction("donor")}>Share a Meal Now</button>
              <button className="hero-cta hero-cta-secondary" onClick={() => handleRoleAction("receiver")}>Become a Partner</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Confirmation Dialog Box */}
      {showSwitchModal && (
        <div className="modal-backdrop-custom animate-fade-in" style={{ zIndex: 2000 }}>
          <div className="modal-card-custom small-modal" style={{ padding: "32px", textAlign: "center" }}>
            <span style={{ fontSize: "3rem" }}>🔄</span>
            <h2 style={{ marginTop: "16px", fontSize: "1.3rem", fontWeight: "800" }}>{confirmTitle}</h2>
            <p style={{ margin: "16px 0 24px", color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.5" }}>
              {confirmMessage}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="btn-cancel" onClick={() => setShowSwitchModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm-action" onClick={handleContinueSwitch}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

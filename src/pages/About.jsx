import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

const stats = [
  {
    label: "Meals Served",
    value: 120000,
    suffix: "+",
    icon: "🍽",
  },
  {
    label: "NGOs Connected",
    value: 50,
    suffix: "+",
    icon: "🤝",
  },
  {
    label: "Delivery Partners",
    value: 50,
    suffix: "+",
    icon: "🚚",
  },
];

const steps = [
  {
    number: "01",
    icon: "📦",
    title: "Surplus is listed",
    text: "Restaurants, hotels and event organizers upload safe surplus food in seconds.",
  },
  {
    number: "02",
    icon: "✦",
    title: "AI verifies it",
    text: "Our intelligent assessment helps evaluate food quality and estimate its safe window.",
  },
  {
    number: "03",
    icon: "📍",
    title: "NGOs are matched",
    text: "Nearby verified NGOs and shelters receive relevant food availability alerts.",
  },
  {
    number: "04",
    icon: "🚚",
    title: "Food reaches people",
    text: "Delivery partners coordinate pickup and transport with real-time visibility.",
  },
];

const values = [
  {
    icon: "♻",
    title: "Zero-waste mindset",
    text: "Good food should feed people, not landfills.",
  },
  {
    icon: "✓",
    title: "Trust by design",
    text: "Verified partners and transparent movement create accountability.",
  },
  {
    icon: "⚡",
    title: "Real-time action",
    text: "Fast matching means surplus food can reach communities while it's still useful.",
  },
];

export default function About() {
  const navigate = useNavigate();

  const [counters, setCounters] = useState([0, 0, 0]);

  useEffect(() => {
    const target = stats.map((item) => item.value);
    const duration = 1800;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min(
        (time - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters(
        target.map((value) =>
          Math.round(value * eased)
        )
      );

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <>
      <Navbar />

      <main className="about-shell">

        {/* =====================================================
            PREMIUM HERO
        ====================================================== */}

        <section className="about-hero">

          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />

          <div className="about-copy">

            <motion.div
              className="about-eyebrow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="eyebrow-dot" />
              ABOUT MEALBRIDGE
            </motion.div>

            <motion.h1
              className="about-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Turning surplus food
              <span>into meaningful impact.</span>
            </motion.h1>

            <motion.p
              className="about-description"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1,
              }}
            >
              MealBridge connects restaurants, hotels and
              event organizers with verified NGOs,
              shelters and delivery partners — creating a
              smarter path for safe surplus food to reach
              people who need it.
            </motion.p>

            <motion.div
              className="about-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
              }}
            >
              <motion.button
                className="about-primary-btn"
                whileHover={{
                  y: -3,
                  boxShadow:
                    "0 18px 35px rgba(82, 220, 158, .25)",
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
              >
                Join MealBridge
                <span>→</span>
              </motion.button>

              <button
                className="about-secondary-btn"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                Explore how it works
                <span>↓</span>
              </button>
            </motion.div>

            <motion.div
              className="hero-trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
              }}
            >
              <div className="trust-avatars">
                <span>R</span>
                <span>N</span>
                <span>O</span>
                <span>+</span>
              </div>

              <div>
                <strong>Built for collective impact</strong>
                <p>
                  Connecting food donors, NGOs and logistics.
                </p>
              </div>
            </motion.div>

          </div>

          {/* =================================================
              HERO VISUAL
          ================================================== */}

          <motion.div
            className="about-visual"
            initial={{
              opacity: 0,
              x: 45,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.15,
            }}
          >

            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="floating-node node-top">
              <span>✓</span>
              <div>
                <strong>Verified</strong>
                <small>Food quality</small>
              </div>
            </div>

            <div className="floating-node node-bottom">
              <span>♥</span>
              <div>
                <strong>Impact</strong>
                <small>Every meal matters</small>
              </div>
            </div>

            <div className="about-main-card">

              <div className="main-card-top">
                <div>
                  <span className="card-label">
                    MEALBRIDGE NETWORK
                  </span>

                  <h3>
                    Food, moving with purpose.
                  </h3>
                </div>

                <div className="live-badge">
                  <span />
                  LIVE
                </div>
              </div>

              <div className="network-visual">

                <div className="network-line line-one" />
                <div className="network-line line-two" />
                <div className="network-line line-three" />

                <div className="network-node donor-node">
                  <span>🍽</span>
                  <small>DONOR</small>
                </div>

                <div className="network-node ai-node">
                  <span>✦</span>
                  <small>AI</small>
                </div>

                <div className="network-node ngo-node">
                  <span>♥</span>
                  <small>NGO</small>
                </div>

                <div className="network-node delivery-node">
                  <span>🚚</span>
                  <small>DELIVERY</small>
                </div>

              </div>

              <div className="network-footer">
                <div>
                  <span>Current status</span>
                  <strong>
                    Donation successfully matched
                  </strong>
                </div>

                <div className="success-check">
                  ✓
                </div>
              </div>

            </div>

          </motion.div>

        </section>

        {/* =====================================================
            IMPACT STATS
        ====================================================== */}

        <section className="about-stats-section">

          <div className="stats-heading">
            <div>
              <span>OUR IMPACT</span>
              <h2>
                Small actions.
                <br />
                Measurable change.
              </h2>
            </div>

            <p>
              Every connection made through MealBridge
              helps create a more efficient and
              compassionate food ecosystem.
            </p>
          </div>

          <div className="stats-grid">

            {stats.map((item, index) => (

              <motion.div
                key={item.label}
                className="premium-stat-card"
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -6,
                }}
              >

                <div className="stat-card-icon">
                  {item.icon}
                </div>

                <div className="stat-number">
                  {counters[index].toLocaleString()}
                  <span>{item.suffix}</span>
                </div>

                <div className="stat-label">
                  {item.label}
                </div>

                <div className="stat-line">
                  <span />
                </div>

              </motion.div>

            ))}

          </div>

        </section>

        {/* =====================================================
            MISSION
        ====================================================== */}

        <section className="mission-section">

          <div className="mission-visual">

            <div className="mission-circle circle-one" />
            <div className="mission-circle circle-two" />

            <div className="mission-center">
              <span>MB</span>
              <strong>
                ONE
                <br />
                NETWORK
              </strong>
            </div>

            <div className="mission-orbit-card orbit-card-one">
              <span>🍽</span>
              <div>
                <strong>Donors</strong>
                <small>Surplus food</small>
              </div>
            </div>

            <div className="mission-orbit-card orbit-card-two">
              <span>♥</span>
              <div>
                <strong>Communities</strong>
                <small>People served</small>
              </div>
            </div>

            <div className="mission-orbit-card orbit-card-three">
              <span>🚚</span>
              <div>
                <strong>Logistics</strong>
                <small>Live movement</small>
              </div>
            </div>

          </div>

          <div className="mission-copy">

            <div className="section-eyebrow">
              <span />
              WHY MEALBRIDGE
            </div>

            <h2>
              A bridge between
              <span>abundance and need.</span>
            </h2>

            <p>
              Food waste and food insecurity can exist
              side-by-side. MealBridge is designed to
              close that gap by connecting the right food
              with the right organization at the right
              moment.
            </p>

            <p>
              Instead of letting safe surplus food go to
              waste, our platform creates a transparent,
              technology-driven redistribution network.
            </p>

            <div className="mission-highlight">
              <div className="highlight-icon">
                ✦
              </div>

              <div>
                <strong>
                  Technology with a human purpose.
                </strong>

                <p>
                  AI, real-time coordination and
                  verified networks working together
                  for social impact.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          className="about-steps"
          id="how-it-works"
        >

          <div className="section-header">

            <div>
              <div className="section-eyebrow">
                <span />
                HOW IT WORKS
              </div>

              <h2>
                Four steps.
                <br />
                One powerful mission.
              </h2>
            </div>

            <p>
              From surplus discovery to final delivery,
              MealBridge keeps every stage visible,
              coordinated and accountable.
            </p>

          </div>

          <div className="work-grid">

            {steps.map((step, index) => (

              <motion.div
                key={step.title}
                className="premium-work-card"
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
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -7,
                }}
              >

                <div className="work-card-top">

                  <span className="work-number">
                    {step.number}
                  </span>

                  <div className="work-icon">
                    {step.icon}
                  </div>

                </div>

                <div className="work-card-content">

                  <h3>{step.title}</h3>

                  <p>{step.text}</p>

                </div>

                <div className="work-arrow">
                  →
                </div>

              </motion.div>

            ))}

          </div>

        </section>

        {/* =====================================================
            VALUES
        ====================================================== */}

        <section className="values-section">

          <div className="values-header">

            <div className="section-eyebrow">
              <span />
              OUR PRINCIPLES
            </div>

            <h2>
              Built around impact,
              <span>not just technology.</span>
            </h2>

          </div>

          <div className="values-grid">

            {values.map((value, index) => (

              <motion.div
                key={value.title}
                className="value-card"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >

                <div className="value-icon">
                  {value.icon}
                </div>

                <h3>{value.title}</h3>

                <p>{value.text}</p>

              </motion.div>

            ))}

          </div>

        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="about-final-cta">

          <div className="cta-glow" />

          <div className="final-cta-content">

            <div className="cta-badge">
              <span>♥</span>
              MAKE AN IMPACT
            </div>

            <h2>
              Don't let good food
              <span>go to waste.</span>
            </h2>

            <p>
              Join the MealBridge network and help
              turn surplus into sustenance.
            </p>

            <div className="final-actions">

              <motion.button
                className="final-primary-btn"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
              >
                Get Started Free
                <span>→</span>
              </motion.button>

              <button
                className="final-secondary-btn"
                onClick={() => navigate("/login")}
              >
                Already a member? Sign in
              </button>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
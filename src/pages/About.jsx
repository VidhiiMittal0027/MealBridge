import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

const stats = [
  { label: "Meals Served", value: 120000, suffix: "+" },
  { label: "NGOs Connected", value: 50, suffix: "+" },
  { label: "Delivery Partners", value: 50, suffix: "+" },
];

const steps = [
  "Restaurant uploads surplus food.",
  "AI verifies food quality and predicts shelf life.",
  "Nearby NGOs receive instant notifications.",
  "Delivery partner transports food with live tracking.",
];

export default function About() {
  const navigate = useNavigate();
  const [counters, setCounters] = useState([0, 0, 0]);

  useEffect(() => {
    const target = [120000, 50, 50];
    const duration = 1800;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setCounters(target.map((value) => Math.round(value * progress)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  return (
    <>
      <Navbar />
      <main className="about-shell">
        <section className="about-hero">
          <div className="about-copy">
            <span className="eyebrow-pill">ABOUT MEALBRIDGE</span>
            <motion.h1
              className="about-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bridging surplus to sustenance with real-time food rescue.
            </motion.h1>
            <motion.p
              className="about-description"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              MealBridge connects restaurants, hotels and event organizers with verified NGOs, shelters and delivery partners to make sure every safe meal reaches the people who need it.
            </motion.p>
            <motion.button
              className="hero-cta hero-cta-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/register")}
            >
              Join Free
            </motion.button>
          </div>
          <div className="about-visual">
            <div className="about-blob blob-one" />
            <div className="about-blob blob-two" />
            <div className="about-card">
              <h3>Verified food redistribution in real-time.</h3>
              <p>Live traceability, trusted partners, and every donation tracked from pickup to delivery.</p>
            </div>
          </div>
        </section>

        <section className="about-stats">
          <div className="stats-grid">
            {stats.map((item, index) => (
              <motion.div
                key={item.label}
                className="stat-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <span>{counters[index].toLocaleString()}{item.suffix}</span>
                <p>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="about-steps">
          <div className="section-header center">
            <p className="eyebrow-pill">HOW IT WORKS</p>
            <h2>Four simple steps to keep food moving.</h2>
          </div>
          <div className="work-grid">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                className="work-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <div className="work-step">{index + 1}</div>
                <p>{step}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

    </>
  );
}

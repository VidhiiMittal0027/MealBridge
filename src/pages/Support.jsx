import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MealBridgeContext } from "../context/MealBridgeContext";
import "./Support.css";

export default function Support() {
  const { showToast } = useContext(MealBridgeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General Support");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const tid = `MB-PUB-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(tid);
    setSubmitted(true);
    showToast(`Support inquiry ${tid} submitted successfully!`, "success");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <main className="static-page section" style={{ minHeight: "80vh", padding: "60px 20px" }}>
        <div className="static-content" style={{ maxWidth: 800, margin: "0 auto" }}>
          <p className="eyebrow" style={{ color: "#12846E", fontWeight: 900, textTransform: "uppercase" }}>
            MEALBRIDGE HELP CENTER
          </p>
          <h1 style={{ color: "#071A2F", fontSize: "2.4rem", fontWeight: 900, letterSpacing: "-.03em", margin: "10px 0 16px" }}>
            How can we assist you today?
          </h1>
          <p style={{ color: "#5A7184", fontSize: "16px", lineHeight: 1.6, marginBottom: "30px" }}>
            Reach out for immediate assistance with food donations, NGO receiver onboarding, AI freshness verification, or live delivery dispatches.
          </p>

          {submitted && (
            <div style={{ background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 14, padding: "18px 22px", marginBottom: 25 }}>
              <strong style={{ color: "#065F46", fontSize: 16 }}>✓ Inquiry Received (#{ticketId})</strong>
              <p style={{ margin: "6px 0 0", color: "#047857", fontSize: 14 }}>
                Thank you! Our support coordination desk will contact you at your email address shortly.
              </p>
            </div>
          )}

          <div style={{ background: "white", padding: 30, borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: 40 }}>
            <h2 style={{ fontSize: "1.3rem", color: "#071A2F", marginBottom: 20 }}>Send a Support Message</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#071A2F" }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#071A2F" }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.org"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#071A2F" }}>Inquiry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14 }}
                >
                  <option value="Donor Listing Assistance">Donor Listing Assistance</option>
                  <option value="NGO Partner Verification">NGO Partner Verification</option>
                  <option value="Delivery & Pickup Logistics">Delivery & Pickup Logistics</option>
                  <option value="Food Safety & Compliance">Food Safety & Compliance</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#071A2F" }}>Message Description *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our community team help you?"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #CBD5E1", fontSize: 14, resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "#12846E",
                  color: "white",
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: 0,
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: "pointer",
                  alignSelf: "flex-start",
                }}
              >
                Submit Inquiry →
              </button>
            </form>
          </div>

          <div style={{ background: "#F8FAFC", padding: 24, borderRadius: 16, border: "1px solid #E2E8F0" }}>
            <h3 style={{ color: "#071A2F", fontSize: 18, marginBottom: 12 }}>Emergency Helpline & Direct Contact</h3>
            <p style={{ margin: "4px 0", color: "#64748B", fontSize: 14 }}>
              📞 <strong>24/7 Hotline:</strong> +91 1800-MEAL-BRIDGE (Toll Free)
            </p>
            <p style={{ margin: "4px 0", color: "#64748B", fontSize: 14 }}>
              ✉️ <strong>Direct Desk:</strong> support@mealbridge.org
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

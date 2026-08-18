import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");

    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <>
      <style>{`
        /* =========================================================
           MEALBRIDGE — PREMIUM FOOTER
           ========================================================= */

        .premium-footer {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(16, 185, 129, 0.12),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 10%,
              rgba(6, 182, 212, 0.10),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #071713 0%,
              #08100f 45%,
              #050908 100%
            );
          color: #fff;
          margin-top: 0;
        }

        .premium-footer::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8),
            transparent 85%
          );
        }

        .footer-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.08);
          filter: blur(90px);
          top: -280px;
          left: -160px;
          pointer-events: none;
        }

        .footer-glow-right {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(6, 182, 212, 0.07);
          filter: blur(90px);
          bottom: -260px;
          right: -150px;
          pointer-events: none;
        }

        .footer-container {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 48px));
          margin: 0 auto;
        }

        /* =========================================================
           NEWSLETTER
           ========================================================= */

        .footer-newsletter {
          position: relative;
          transform: translateY(-1px);
          padding: 42px 48px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-top: 0;
          border-radius: 0 0 28px 28px;
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.075),
              rgba(255, 255, 255, 0.025)
            );
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .newsletter-copy {
          max-width: 570px;
        }

        .newsletter-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          color: #6ee7b7;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .newsletter-eyebrow span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 14px rgba(52, 211, 153, 0.8);
        }

        .newsletter-copy h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(25px, 3vw, 38px);
          line-height: 1.1;
          letter-spacing: -0.04em;
        }

        .newsletter-copy h2 span {
          color: #6ee7b7;
        }

        .newsletter-copy p {
          margin: 12px 0 0;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.7;
        }

        .newsletter-form {
          width: min(460px, 100%);
          display: flex;
          gap: 10px;
        }

        .newsletter-input {
          min-width: 0;
          flex: 1;
          height: 52px;
          padding: 0 18px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          outline: none;
          background: rgba(0, 0, 0, 0.25);
          color: #fff;
          font-size: 14px;
          transition: 0.25s ease;
        }

        .newsletter-input::placeholder {
          color: #6b7280;
        }

        .newsletter-input:focus {
          border-color: rgba(52, 211, 153, 0.6);
          box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.08);
        }

        .newsletter-button {
          height: 52px;
          padding: 0 23px;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          color: #052e24;
          background:
            linear-gradient(
              135deg,
              #6ee7b7,
              #34d399
            );
          font-size: 14px;
          font-weight: 800;
          box-shadow:
            0 12px 30px rgba(52, 211, 153, 0.18);
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
          white-space: nowrap;
        }

        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 38px rgba(52, 211, 153, 0.28);
        }

        .newsletter-success {
          color: #6ee7b7;
          font-size: 13px;
          font-weight: 700;
          margin-top: 10px;
        }

        /* =========================================================
           MAIN FOOTER
           ========================================================= */

        .footer-main {
          display: grid;
          grid-template-columns: 1.45fr 0.8fr 0.8fr 1.25fr;
          gap: 70px;
          padding: 82px 0 70px;
        }

        .footer-brand {
          max-width: 340px;
        }

        .footer-brand-top {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 20px;
        }

        .footer-logo {
          width: 48px;
          height: 48px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              135deg,
              #34d399,
              #10b981
            );
          color: #03291f;
          font-size: 15px;
          font-weight: 900;
          box-shadow:
            0 12px 30px rgba(16, 185, 129, 0.22);
        }

        .footer-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 7px;
        }

        .footer-brand-name {
          font-size: 21px;
          font-weight: 850;
          letter-spacing: -0.03em;
        }

        .footer-brand p {
          margin: 0;
          color: #9ca3af;
          font-size: 14px;
          line-height: 1.8;
          max-width: 320px;
        }

        .footer-impact-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding: 9px 13px;
          border-radius: 999px;
          border: 1px solid rgba(52, 211, 153, 0.16);
          background: rgba(52, 211, 153, 0.06);
          color: #a7f3d0;
          font-size: 11px;
          font-weight: 750;
          letter-spacing: 0.04em;
        }

        .footer-impact-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow:
            0 0 10px rgba(52, 211, 153, 0.8);
        }

        .footer-column h3 {
          margin: 5px 0 20px;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footer-links a {
          width: fit-content;
          color: #8f9a96;
          text-decoration: none;
          font-size: 14px;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .footer-links a:hover {
          color: #6ee7b7;
          transform: translateX(4px);
        }

        /* =========================================================
           SOCIAL
           ========================================================= */

        .footer-social-title {
          margin-top: 30px !important;
        }

        .footer-socials {
          display: flex;
          gap: 10px;
        }

        .social-link {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.04);
          color: #d1d5db;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          transition:
            transform 0.25s ease,
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .social-link:hover {
          transform: translateY(-4px);
          background: rgba(52, 211, 153, 0.1);
          border-color: rgba(52, 211, 153, 0.3);
          color: #6ee7b7;
        }

        /* =========================================================
           BOTTOM BAR
           ========================================================= */

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .footer-bottom p {
          margin: 0;
          color: #68736f;
          font-size: 12px;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .footer-bottom-links a {
          color: #68736f;
          text-decoration: none;
          font-size: 12px;
          transition: color 0.2s ease;
        }

        .footer-bottom-links a:hover {
          color: #6ee7b7;
        }

        .footer-made {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #68736f;
          font-size: 12px;
        }

        .footer-made span {
          color: #f87171;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */

        @media (max-width: 1000px) {
          .footer-main {
            grid-template-columns:
              1.3fr 1fr 1fr;
            gap: 45px;
          }

          .footer-brand {
            grid-column: 1 / -1;
            max-width: 600px;
          }

          .footer-newsletter {
            flex-direction: column;
            align-items: flex-start;
          }

          .newsletter-form {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .footer-container {
            width: min(100% - 30px, 1180px);
          }

          .footer-newsletter {
            padding: 30px 24px;
            border-radius: 0 0 22px 22px;
          }

          .newsletter-form {
            flex-direction: column;
          }

          .newsletter-input,
          .newsletter-button {
            width: 100%;
          }

          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px 25px;
            padding: 60px 0 50px;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-bottom-links {
            flex-wrap: wrap;
          }
        }

        @media (max-width: 450px) {
          .footer-main {
            grid-template-columns: 1fr;
          }

          .footer-column {
            grid-column: auto;
          }

          .footer-bottom-links {
            gap: 14px;
          }
        }
      `}</style>

      <footer className="premium-footer">
        <div className="footer-glow" />
        <div className="footer-glow-right" />

        <div className="footer-container">

          {/* =====================================================
              NEWSLETTER
          ===================================================== */}

          <div className="footer-newsletter">

            <div className="newsletter-copy">

              <div className="newsletter-eyebrow">
                <span />
                Stay connected
              </div>

              <h2>
                Be part of the
                <span> food rescue movement.</span>
              </h2>

              <p>
                Get occasional updates about MealBridge, rescued food,
                community impact and new platform features.
              </p>

            </div>

            <div>

              <form
                className="newsletter-form"
                onSubmit={handleSubscribe}
              >

                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="newsletter-button"
                >
                  Subscribe →
                </button>

              </form>

              {subscribed && (
                <div className="newsletter-success">
                  ✓ You're now part of the MealBridge community.
                </div>
              )}

            </div>

          </div>

          {/* =====================================================
              MAIN FOOTER
          ===================================================== */}

          <div className="footer-main">

            {/* BRAND */}

            <div className="footer-brand">

              <div className="footer-brand-top">

                <div className="footer-logo">
                  <img
                    src="/images/logo.png"
                    alt="MealBridge"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement.textContent = "MB";
                    }}
                  />
                </div>

                <div className="footer-brand-name">
                  MealBridge
                </div>

              </div>

              <p>
                Connecting surplus food with verified community
                organizations — helping good food reach people
                before it becomes waste.
              </p>

              <div className="footer-impact-pill">
                <span className="footer-impact-dot" />
                Technology for social impact
              </div>

            </div>

            {/* PLATFORM */}

            <div className="footer-column">

              <h3>Platform</h3>

              <div className="footer-links">
                <Link to="/">Home</Link>
                <Link to="/#features">Features</Link>
                <Link to="/#faq">FAQ</Link>
                <Link to="/about">About Us</Link>
                <Link to="/dashboard">Dashboard</Link>
              </div>

            </div>

            {/* COMPANY */}

            <div className="footer-column">

              <h3>Company</h3>

              <div className="footer-links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms & Conditions</Link>
                <Link to="/support">Support</Link>
                <Link to="/contact">Contact</Link>
              </div>

            </div>

            {/* MISSION / SOCIAL */}

            <div className="footer-column">

              <h3>Our Mission</h3>

              <div className="footer-links">
                <Link to="/about">Our Story</Link>
                <Link to="/#hero">Food Rescue</Link>
                <Link to="/#features">How It Works</Link>
              </div>

              <h3 className="footer-social-title">
                Follow MealBridge
              </h3>

              <div className="footer-socials">

                <a
                  href="#"
                  className="social-link"
                  aria-label="Twitter"
                  onClick={(e) => e.preventDefault()}
                >
                  X
                </a>

                <a
                  href="#"
                  className="social-link"
                  aria-label="LinkedIn"
                  onClick={(e) => e.preventDefault()}
                >
                  in
                </a>

                <a
                  href="#"
                  className="social-link"
                  aria-label="Instagram"
                  onClick={(e) => e.preventDefault()}
                >
                  ◎
                </a>

                <a
                  href="#"
                  className="social-link"
                  aria-label="GitHub"
                  onClick={(e) => e.preventDefault()}
                >
                  GH
                </a>

              </div>

            </div>

          </div>

          {/* =====================================================
              BOTTOM BAR
          ===================================================== */}

          <div className="footer-bottom">

            <p>
              © 2026 MealBridge. All rights reserved.
            </p>

            <div className="footer-bottom-links">

              <Link to="/privacy">
                Privacy
              </Link>

              <Link to="/terms">
                Terms
              </Link>

              <Link to="/contact">
                Contact
              </Link>

            </div>

            <div className="footer-made">
              Built with
              <span>♥</span>
              for communities
            </div>

          </div>

        </div>
      </footer>
    </>
  );
}
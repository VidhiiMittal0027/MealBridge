export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand-mark-footer">MB</div>
          <div>
            <h3>MealBridge</h3>
            <p>
              Connecting restaurant surplus directly to local NGOs in real-time.
              Together we can end food waste.
            </p>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <a href="/#hero">Home</a>
          <a href="/#features">Features</a>
          <a href="/about">About Us</a>
          <a href="/impact-dashboard">Dashboard</a>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
          <a href="/support">Support</a>
          <a href="/contact">Contact</a>
        </div>

        <div className="footer-subscribe">
          <h4>Join our Mission</h4>
          <p>Get updates on impact and new features.</p>
          <div className="subscribe-row">
            <input type="email" placeholder="Email address" />
            <button type="button">Subscribe</button>
          </div>
          <div className="social-row">
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 5.9c-.8.4-1.6.6-2.5.7a4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.8 1.1 4.5 4.5 0 0 0-7.6 4.1A12.7 12.7 0 0 1 3 4.9a4.5 4.5 0 0 0 1.4 6 4.4 4.4 0 0 1-2-.6v.1a4.5 4.5 0 0 0 3.6 4.4 4.6 4.6 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.2A9 9 0 0 1 2 19.5 12.8 12.8 0 0 0 8.6 21c10.3 0 15.9-8.5 15.9-15.9v-.7A11.4 11.4 0 0 0 22 5.9Z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 21H2.8V8.94h4.14V21ZM4.87 7.3a2.4 2.4 0 1 1 .01-4.8 2.4 2.4 0 0 1-.01 4.8ZM21 21h-4.14v-5.7c0-1.36-.02-3.12-1.9-3.12-1.9 0-2.18 1.48-2.18 3v5.82H9.8V8.94h3.98v1.66h.06c.55-1.04 1.9-2.14 3.9-2.14 4.17 0 4.94 2.75 4.94 6.33V21Z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.5A4 4 0 0 0 3.5 7.5v9A4 4 0 0 0 7.5 20.5h9a4 4 0 0 0 4-4v-9a4 4 0 0 0-4-4h-9Zm9 2.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2026 MealBridge · Connecting surplus food with communities.</div>
    </footer>
  );
}

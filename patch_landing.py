from pathlib import Path
import json

base = Path(r'c:\Users\Dell\IdeaProjects\MealBridge-hackathon\MealBridge')

files = {
    'src/App.jsx': '''import SupabaseTest from "./pages/SupabaseTest";

import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";
import FoodDonation from "./pages/FoodDonation";
import FoodAssessment from "./pages/FoodAssessment";
import NGOMatching from "./pages/NGOMatching";
import DeliveryTracking from "./pages/DeliveryTracking";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import ImpactDashboard from "./pages/ImpactDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/supabase-test" element={<SupabaseTest />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/donate-food" element={<FoodDonation />} />
      <Route path="/food-assessment" element={<FoodAssessment />} />
      <Route path="/ngo-matching" element={<NGOMatching />} />
      <Route path="/delivery-tracking" element={<DeliveryTracking />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/ngo-dashboard" element={<NGODashboard />} />
      <Route path="/impact-dashboard" element={<ImpactDashboard />} />
    </Routes>
  );
}
''',
    'src/index.css': '''@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap");

:root {
  color-scheme: light;
  --bg: #fffdf8;
  --surface: #fff7ef;
  --text-primary: #1b1b1b;
  --text-secondary: #5c5c5c;
  --primary: #ff8a00;
  --accent: #ffb547;
  --success: #28c76f;
  --teal: #3ccfcf;
  --shadow: 0 30px 80px rgba(27, 27, 27, 0.08);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(255, 186, 71, 0.16), transparent 28%),
    radial-gradient(circle at bottom right, rgba(60, 207, 207, 0.12), transparent 24%),
    var(--bg);
  color: var(--text-primary);
  font-family: "Inter", system-ui, sans-serif;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at 20% 10%, rgba(255, 138, 0, 0.18), transparent 18%),
    radial-gradient(circle at 80% 20%, rgba(60, 207, 207, 0.16), transparent 18%);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

button {
  border: none;
}

img {
  max-width: 100%;
  display: block;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 1100;
  width: 100%;
  backdrop-filter: blur(18px);
  background: rgba(255, 253, 248, 0.92);
  border-bottom: 1px solid rgba(255, 138, 0, 0.12);
}

.navbar-scrolled {
  padding: 8px 0;
  box-shadow: 0 18px 40px rgba(27, 27, 27, 0.09);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 7%;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-weight: 800;
  color: var(--text-primary);
}

.brand-mark,
.brand-mark-footer {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 800;
}

.brand-text {
  font-size: 1.1rem;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  font-weight: 600;
  transition: color 0.25s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ghost-button,
.primary-button,
.footer-shell button,
.hero-cta,
.role-actions .cancel,
.role-actions .confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ghost-button {
  border-radius: 999px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.85);
  color: var(--text-primary);
  border: 1px solid rgba(255, 138, 0, 0.14);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ghost-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(27, 27, 27, 0.08);
}

.primary-button {
  padding: 12px 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 700;
  box-shadow: 0 22px 48px rgba(255, 138, 0, 0.2);
  transition: transform 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
}

.footer-shell {
  background: #181818;
  color: rgba(255, 255, 255, 0.88);
  padding: 64px 7% 30px;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) repeat(2, minmax(180px, 1fr)) minmax(260px, 1fr);
  gap: 32px;
  margin-bottom: 32px;
}

.footer-brand h3,
.footer-links-group h4,
.footer-subscribe h4 {
  margin: 0 0 16px;
  color: #fff;
}

.footer-brand p,
.footer-links-group a,
.footer-subscribe p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links-group a {
  display: block;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.72);
  transition: color 0.2s ease;
}

.footer-links-group a:hover {
  color: #fff;
}

.subscribe-row {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.subscribe-row input {
  flex: 1;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.subscribe-row input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.subscribe-row button {
  padding: 14px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
}

.social-row {
  display: flex;
  gap: 14px;
  margin-top: 22px;
}

.social-row a {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: transform 0.2s ease, background 0.2s ease;
}

.social-row a:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.16);
}

.footer-bottom {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

@media (max-width: 1120px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 760px) {
  .navbar-inner,
  .footer-shell {
    padding-left: 5%;
    padding-right: 5%;
  }

  .nav-links {
    display: none;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }
}
''',
}
for rel, content in files.items():
    path = base / rel
    path.write_text(content, encoding='utf-8')

package_json = {
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "@vitejs/plugin-react": "latest",
        "framer-motion": "latest",
        "react": "latest",
        "react-dom": "latest",
        "react-router-dom": "latest",
        "vite": "latest"
    },
    "devDependencies": {}
}
(base / 'package.json').write_text(json.dumps(package_json, indent=2), encoding='utf-8')
print('patched')
''
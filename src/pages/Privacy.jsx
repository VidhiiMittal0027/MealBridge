import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Privacy.css";

export default function Privacy() {
  return (
    <>
      <Navbar />
      <main className="static-page section">
        <div className="static-content">
          <p className="eyebrow">Privacy Policy</p>
          <h1>Privacy matters at MealBridge</h1>
          <p>
            We collect only the minimum user data necessary to match food donors, NGOs, and volunteers. Your information is used to support authentication, secure routing, and personalized dashboard access.
          </p>
          <p>
            We never share your personal details with third parties except for services required to operate this platform.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

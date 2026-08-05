import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Terms.css";

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="static-page section">
        <div className="static-content">
          <p className="eyebrow">Terms & Conditions</p>
          <h1>Make sure you know the rules</h1>
          <p>
            By using MealBridge, you agree to act responsibly and only donate or request food that meets local safety standards. All users should follow applicable health, transportation, and donation regulations.
          </p>
          <p>
            The platform is provided as-is for educational and community support purposes. Please review our policies before sharing or requesting food.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Support.css";

export default function Support() {
  return (
    <>
      <Navbar />
      <main className="static-page section">
        <div className="static-content">
          <p className="eyebrow">Support</p>
          <h1>Need help with MealBridge?</h1>
          <p>
            Reach out for assistance with registration, donations, matching, or delivery tracking. We’re here to help every step of the way.
          </p>
          <p>
            For the fastest support, please use the contact form on the Contact page or send an email to support@mealbridge.example.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

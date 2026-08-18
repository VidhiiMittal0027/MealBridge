import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="static-page section">
        <div className="static-content">
          <p className="eyebrow">Contact</p>
          <h1>Get in touch with MealBridge</h1>
          <p>
            Whether you’re a donor, NGO, or delivery volunteer, we’d love to hear from you. Use the information below to connect with our support team.
          </p>
          <ul>
            <li>Email: support@mealbridge.example</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Community Lane, Food City</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
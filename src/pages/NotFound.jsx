import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./NotFound.css";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="static-page section">
        <div className="static-content">
          <p className="eyebrow">Page not found</p>
          <h1>Oops — this page doesn’t exist.</h1>
          <p>
            The link you clicked may not be available yet or the page was moved. Use the button below to return home.
          </p>
          <Link to="/" className="btn wide">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

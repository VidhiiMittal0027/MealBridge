import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./FoodDonation.css";

export default function FoodDonation() {
  const navigate = useNavigate();

  const [foodName, setFoodName] = useState("");
  const [estimatedMeals, setEstimatedMeals] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("food_donations")
      .insert({
        food_name: foodName,
        quantity: Number(estimatedMeals),
        prepared_at: preparedAt,
        pickup_location: pickupAddress,
        food_type: "Veg"
      });

    setLoading(false);

    if (error) {
      console.error(error);
      setMessage("❌ " + error.message);
      return;
    }

    setMessage("✅ Donation saved successfully!");

    setTimeout(() => {
      navigate("/food-assessment");
    }, 1000);
  }

  return (
    <>
      <Navbar />

      <main className="auth">
        <form className="form-card" onSubmit={handleSubmit}>
          <h1>List New Surplus</h1>

          <label className="field">
            Food name
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Estimated meals
            <input
              type="number"
              min="1"
              value={estimatedMeals}
              onChange={(e) => setEstimatedMeals(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Prepared time
            <input
              type="datetime-local"
              value={preparedAt}
              onChange={(e) => setPreparedAt(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Pickup address
            <textarea
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              required
            />
          </label>

          <label className="field">
            Food image
            <input type="file" accept="image/*" />
          </label>

          <button
            type="submit"
            className="btn wide"
            disabled={loading}
          >
            {loading ? "Saving..." : "Run AI Assessment →"}
          </button>

          {message && <p>{message}</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}
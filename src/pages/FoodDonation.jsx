import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useUser } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./FoodDonation.css";

export default function FoodDonation() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [foodName, setFoodName] = useState("");
  const [estimatedMeals, setEstimatedMeals] = useState("");
  const [preparedAt, setPreparedAt] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      setMessage("❌ Authentication required to list food.");
      return;
    }

    setLoading(true);
    setMessage("");

    let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60";

    try {
      // 1. Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("food-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError.message);
        } else {
          const { data: publicData } = supabase.storage
            .from("food-images")
            .getPublicUrl(filePath);
          if (publicData) {
            imageUrl = publicData.publicUrl;
          }
        }
      }

      // 2. Insert food listing to PostgreSQL
      const { error } = await supabase
        .from("food_donations")
        .insert({
          donor_id: user.id,
          food_name: foodName,
          quantity: Number(estimatedMeals),
          servings: Number(estimatedMeals),
          prepared_at: preparedAt,
          pickup_address: pickupAddress,
          veg_non_veg: "Veg",
          image_url: imageUrl,
          status: 'available'
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
    } catch (err) {
      setLoading(false);
      setMessage("❌ Connection error: " + err.message);
    }
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
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])}
            />
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
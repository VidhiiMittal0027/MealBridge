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
    
    if (!imageFile) {
      setMessage("❌ Please upload a food image for AI Assessment.");
      return;
    }

    setLoading(true);
    setMessage("Running AI Assessment...");

    let imageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=60";
    let aiResult = null;

    try {
      // 1. Run AI Assessment
      const formData = new FormData();
      formData.append("file", imageFile);

      const aiResponse = await fetch("http://127.0.0.1:8000/predict-freshness", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) {
        throw new Error("AI assessment failed. Please try again.");
      }

      aiResult = await aiResponse.json();
      
      if (aiResult.error) {
        throw new Error(aiResult.error);
      }
      
      setMessage("Saving image and listing...");

      // 2. Upload image to Supabase
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

      // 3. Insert food listing to PostgreSQL with AI scores
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
          status: 'available',
          freshness_score: aiResult.freshness_score,
          freshness_label: aiResult.freshness_label,
          ai_model_version: aiResult.model_version
        });

      if (error) {
        throw new Error(error.message);
      }

      setMessage("✅ Assessment & Donation saved successfully!");

      // Pass the AI result to the assessment page
      setTimeout(() => {
        navigate("/donor-dashboard");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setMessage("❌ Error: " + err.message);
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
            Food image (Required for AI Safety Check)
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])}
              required
            />
          </label>

          <button
            type="submit"
            className="btn wide"
            disabled={loading}
          >
            {loading ? "Running AI Check..." : "Run AI Assessment →"}
          </button>

          {message && <p style={{ marginTop: "10px", fontWeight: "bold" }}>{message}</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}
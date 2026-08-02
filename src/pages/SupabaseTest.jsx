import { useState } from "react";
import { supabase } from "../supabase";

export default function SupabaseTest() {
  const [message, setMessage] = useState("Ready to test Supabase");

  async function saveTestDonation() {
    setMessage("Saving...");

    const { error } = await supabase
      .from("food_donations")
      .insert({
        food_name: "Test Vegetable Biryani",
        food_type: "Veg",
        quantity: 25,
        prepared_at: new Date().toISOString(),
        pickup_location: "Faridabad"
      });

    if (error) {
      console.log(error);
      setMessage("Error: " + error.message);
    } else {
      setMessage("✅ Donation saved successfully!");
    }
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>MealBridge Backend Test</h1>

      <button onClick={saveTestDonation}>
        Save Test Donation
      </button>

      <p>{message}</p>
    </div>
  );
}
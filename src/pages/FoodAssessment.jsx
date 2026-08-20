import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./FoodAssessment.css";

export default function FoodAssessment() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeFood = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-freshness", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to analyze image.");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="section">
        <p className="eyebrow">AI FOOD SAFETY</p>
        <h1>Food Assessment</h1>
        <div className="grid">
          <article className="panel">
            <h2>Upload food image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button className="btn wide" onClick={analyzeFood} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze Food"}
            </button>
            {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
          </article>
          
          {result && (
            <article className="panel">
              <h2>Assessment Result</h2>
              {result.error ? (
                <div className="result">
                  <h3 style={{ color: "red" }}>Error: {result.error}</h3>
                </div>
              ) : (
                <div className="result">
                  <h3 style={{ color: result.freshness_label === "fresh" ? "green" : result.freshness_label === "moderate" ? "orange" : "red" }}>
                    {result.freshness_label === "fresh" ? "✓ Suitable for donation" : result.freshness_label === "moderate" ? "! Handle with care" : "✗ Spoilage Detected"}
                  </h3>
                  <p>Food Type: <b>{result.food_type}</b></p>
                  <p>Freshness score: <b>{result.freshness_score}%</b></p>
                  <p>Recommendation: {result.recommendation}</p>
                </div>
              )}
              {result.freshness_label !== "spoiled" && (
                <a className="btn" href="/donor-dashboard" style={{ marginTop: "1rem", display: "inline-block" }}>
                  Go to Dashboard →
                </a>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
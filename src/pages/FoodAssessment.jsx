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
              {(!result.is_valid_image || result.rejection_reason) ? (
                <div className="result" style={{ background: "#FEF2F2", border: "1px solid #FEE2E2", color: "#991B1B", padding: 16, borderRadius: 8 }}>
                  <h3 style={{ margin: "0 0 8px 0" }}>⚠️ Image Unsuitable</h3>
                  <p>{result.rejection_reason || "Unable to confidently analyze this image. Please upload a clearer image showing the food clearly."}</p>
                </div>
              ) : (
                <div className="result" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{
                    color: result.freshness_label === "fresh" ? "green" : result.freshness_label === "moderate" ? "orange" : "red",
                    margin: 0,
                    textTransform: "uppercase"
                  }}>
                    {result.freshness_label === "fresh" ? "✓ Visual Freshness: FRESH" : result.freshness_label === "moderate" ? "! Visual Freshness: MODERATE / QUESTIONABLE" : "✗ Potential Spoilage Detected"}
                  </h3>
                  <p style={{ margin: 0 }}>Detected Food: <b>{result.food_type}</b></p>
                  <p style={{ margin: 0 }}>Confidence: <b>{result.freshness_score}%</b></p>
                  <p style={{ margin: 0 }}>AI Assessment: <b>{result.recommendation}</b></p>
                  
                  <div style={{
                    padding: 10,
                    background: "#FEF2F2",
                    border: "1px solid #FEE2E2",
                    borderRadius: 8,
                    color: "#991B1B",
                    fontSize: 11,
                    lineHeight: "1.4",
                    marginTop: 8
                  }}>
                    <strong>⚠️ SAFETY DISCLAIMER:</strong> AI assessment does not certify food safety. Actual food safety depends on storage temperature, preparation time, handling, hygiene, contamination, packaging, expiry information, and storage conditions.
                  </div>
                </div>
              )}
              {result.is_valid_image && result.freshness_label !== "spoiled" && (
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
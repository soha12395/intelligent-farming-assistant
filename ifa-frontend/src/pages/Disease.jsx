import React, { useState } from "react";
import api from "../services/api";
import "../styles/Disease.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const plants = [
  { value: "Tomato", label: "Tomato" },
  { value: "Potato", label: "Potato" },
  { value: "Pepper, bell", label: "Pepper" },
  { value: "Corn (Maize)", label: "Corn" },
  { value: "Grape", label: "Grape" },
  { value: "Apple", label: "Apple" },
  { value: "Cherry", label: "Cherry" },
  { value: "Peach", label: "Peach" },
  { value: "Strawberry", label: "Strawberry" },
  { value: "Raspberry", label: "Raspberry" },
];

function Disease() {
  const [plant, setPlant] = useState("");
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return setError("Please select an image");
    if (!plant) return setError("Please select a plant");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("plant", plant);

    setLoading(true);
    setError("");
    try {
      const res = await api.post("/disease/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.Status === "Success") {
        setResult(res.data.result);
      } else {
        setError(res.data.Error);
      }
    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const getUrgencyClass = (urgency) => {
    if (urgency === "High") return "urgency-high";
    if (urgency === "Medium") return "urgency-medium";
    return "urgency-low";
  };

  return (
    <div className="disease-container">
      <Navbar />
      <div className="disease-content">
        <div className="disease-box">
          <h2>Disease Detection</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <select onChange={(e) => setPlant(e.target.value)} required>
              <option value="">Select Plant</option>
              {plants.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="file-upload-wrapper">
              <label className="file-upload-label" htmlFor="imageUpload">
                📷 Choose Plant Image
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            {image && <p className="file-name">Selected: {image.name}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Analyzing..." : "Detect Disease"}
            </button>
          </form>
        </div>

        {result && (
          <div className="result-card">
            <h3>Detection Result</h3>
            <div className="result-row">
              <span>Plant:</span> {result.plant_name}
            </div>
            <div className="result-row">
              <span>Disease:</span> {result.disease_name}
            </div>
            <div className="result-row">
              <span>Description:</span> {result.description}
            </div>
            <div className="result-row">
              <span>Symptoms:</span> {result.symptoms}
            </div>
            <div className="result-row">
              <span>Treatment:</span> {result.treatment}
            </div>
            <div className="result-row">
              <span>Chemical:</span> {result.chemical_name} —{" "}
              {result.chemical_type}
            </div>
            <div className="result-row">
              <span>Dosage:</span> {result.dosage}
            </div>
            <div className="result-row">
              <span>Urgency:</span>{" "}
              <span className={getUrgencyClass(result.urgency)}>
                {result.urgency}
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Disease;

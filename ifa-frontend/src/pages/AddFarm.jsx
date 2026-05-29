import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/AddFarm.css";

function AddFarm() {
  const [formData, setFormData] = useState({
    region: "",
    soil_type: "",
    farm_size: "",
    water_availability: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/farm/get").then((res) => {
      if (res.data.Status === "Success" && res.data.farm) {
        setFormData(res.data.farm);
        setIsEdit(true);
      }
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = isEdit
        ? await api.put("/farm/update", formData)
        : await api.post("/farm/add", formData);

      if (res.data.Status === "Success") {
        window.location.href = "/dashboard";
      } else {
        setError(res.data.Error);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your farm profile?")) {
      try {
        const res = await api.delete("/farm/delete");
        if (res.data.Status === "Success") {
          window.location.href = "/dashboard";
        }
      } catch (err) {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="addfarm-container">
      <div className="addfarm-box">
        <h2>{isEdit ? " Edit Farm Profile" : " Add Farm Profile"}</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            required
          >
            <option value="">Select Region</option>
            <option value="Beqaa">Beqaa</option>
            <option value="South">South</option>
            <option value="North">North</option>
            <option value="Mount Lebanon">Mount Lebanon</option>
            <option value="Coast">Coast</option>
          </select>
          <select
            name="soil_type"
            value={formData.soil_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Soil Type</option>
            <option value="Loamy">Loamy</option>
            <option value="Clay">Clay</option>
            <option value="Sandy">Sandy</option>
          </select>
          <select
            name="farm_size"
            value={formData.farm_size}
            onChange={handleChange}
            required
          >
            <option value="">Select Farm Size</option>
            <option value="Small">Small (less than 5 dunums)</option>
            <option value="Medium">Medium (5 to 20 dunums)</option>
            <option value="Large">Large (20 to 50 dunums)</option>
            <option value="Very Large">Very Large (more than 50 dunums)</option>
          </select>
          <select
            name="water_availability"
            value={formData.water_availability}
            onChange={handleChange}
            required
          >
            <option value="">Select Water Availability</option>
            <option value="Low">Low (less than 500 L/day)</option>
            <option value="Moderate">Moderate (500 to 2,000 L/day)</option>
            <option value="High">High (2,000 to 5,000 L/day)</option>
            <option value="Very High">Very High (more than 5,000 L/day)</option>
          </select>
          <button type="submit">{isEdit ? "Update Farm" : "Save Farm"}</button>
          {isEdit && (
            <button type="button" onClick={handleDelete} className="delete-btn">
              Delete Farm Profile
            </button>
          )}
        </form>
        <a href="/dashboard" className="back-link">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default AddFarm;

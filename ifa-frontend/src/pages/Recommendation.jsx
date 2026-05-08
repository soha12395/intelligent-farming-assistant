import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Recommendation.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Recommendation() {
  const [season, setSeason] = useState('');
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/crop/recommend', { season });
      if (res.data.Status === 'Success') {
        setCrops(res.data.crops);
      } else {
        setError(res.data.Error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="recommendation-container">
      <Navbar />
      <div className="recommendation-content">
   
        <div className="recommendation-box">
          <h2>🌾 Crop Recommendation</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <select onChange={e => setSeason(e.target.value)} required>
              <option value="">Select Season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </select>
            <button type="submit">Get Recommendations</button>
          </form>
        </div>

        {crops.length > 0 && (
          <div>
            <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>Recommended Crops</h3>
            <div className="crops-grid">
              {crops.map(crop => (
                <div key={crop.crop_id} className="crop-card">
                  <h4>{crop.crop_name}</h4>
                  <p>{crop.description}</p>
                  <p><span className="crop-label">Season:</span> {crop.suitable_season}</p>
                  <p><span className="crop-label">Soil:</span> {crop.suitable_soil}</p>
                  <p><span className="crop-label">Water:</span> {crop.suitable_water}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Recommendation;
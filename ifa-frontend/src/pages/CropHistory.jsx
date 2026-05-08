import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/History.css';

function CropHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/crop/history').then(res => {
      if (res.data.Status === 'Success') setHistory(res.data.history);
      else setError(res.data.Error);
    });
  }, []);

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-content">
        <h2>🌾 Crop Recommendation History</h2>
        {error && <p className="error">{error}</p>}
        {history.length === 0 ? (
          <div className="empty-card">
            <p>No recommendations yet. <a href="/recommendation">Get a recommendation</a></p>
          </div>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-card">
              <div className="history-header">
                <h4>{item.crop_name}</h4>
                <span className="season-tag">🗓 {item.season}</span>
              </div>
              <p>{item.description}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                <span className="crop-tag">🪨 {item.suitable_soil}</span>
                <span className="crop-tag">💧 {item.suitable_water}</span>
              </div>
              <p className="history-date">Recommended: {new Date(item.recommended_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CropHistory;
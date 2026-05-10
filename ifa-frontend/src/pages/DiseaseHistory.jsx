import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/History.css';

function DiseaseHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/disease/history').then(res => {
      if (res.data.Status === 'Success') setHistory(res.data.history);
      else setError(res.data.Error);
    });
  }, []);

  const getUrgencyClass = (urgency) => {
    if (urgency === 'High') return 'urgency-high';
    if (urgency === 'Medium') return 'urgency-medium';
    return 'urgency-low';
  };

  return (
    <div className="history-container">
      <Navbar />
      <div className="history-content">
        <h2> Disease Detection History</h2>
        {error && <p className="error">{error}</p>}
        {history.length === 0 ? (
          <div className="empty-card">
            <p>No detections yet. <a href="/disease">Detect a disease</a></p>
          </div>
        ) : (
          history.map(item => (
            <div key={item.detection_id} className="history-card">
              <div className="history-header">
                <h4>{item.plant_name} — {item.disease_name}</h4>
                <span className={getUrgencyClass(item.urgency)}>{item.urgency} Urgency</span>
              </div>
              <p><span>Treatment:</span> {item.treatment}</p>
              <p className="history-date">Detected: {new Date(item.detected_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default DiseaseHistory;
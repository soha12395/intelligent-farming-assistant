import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Dashboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Dashboard() {
  const [farm, setFarm] = useState(null);
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    api.get('/farm/get').then(res => {
      if (res.data.Status === 'Success') setFarm(res.data.farm);
    });
    api.get('/auth/me').then(res => {
      if (res.data.Status === 'Success') setFarmer(res.data.farmer);
    });
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   window.location.href = '/login';
  // };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome back, {farmer ? farmer.full_name : '...'} 👋</h2>
          <p>Manage your farm and get AI-powered recommendations</p>
        </div>

        <div className="farm-card">
          <h3>🌾 My Farm Profile</h3>
          {farm ? (
            <div className="farm-info">
              <p><span>Region:</span> {farm.region}</p>
              <p><span>Soil Type:</span> {farm.soil_type}</p>
              <p><span>Farm Size:</span> {farm.farm_size}</p>
              <p><span>Water Availability:</span> {farm.water_availability}</p>
            </div>
          ) : (
            <div className="no-farm">
              <p>No farm profile found. <a href="/farm/add">Add your farm</a></p>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <a href="/disease" className="action-card">🔬 Detect Disease</a>
          <a href="/recommendation" className="action-card">🌾 Get Crop Recommendation</a>
          <a href="/farm/add" className="action-card">✏️ Edit Farm Profile</a>
          <a href="/disease/history" className="action-card">📋 Detection History</a>
          <a href="/crop/history" className="action-card">📋 Recommendation History</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
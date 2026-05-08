import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div>
      <div className="hero">
        <h1>🌱 Intelligent Farming Assistant</h1>
        <p>AI-powered tools to help Lebanese farmers detect plant diseases and get crop recommendations</p>
        <div className="hero-buttons">
          <a href="/register" className="btn-primary">Get Started</a>
          <a href="/login" className="btn-secondary">Login</a>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🔬 Disease Detection</h3>
          <p>Upload a photo of your plant and our AI will identify the disease and suggest treatment.</p>
        </div>
        <div className="feature-card">
          <h3>🌾 Crop Recommendation</h3>
          <p>Get the best crop suggestions based on your region, soil type, and season.</p>
        </div>
        <div className="feature-card">
          <h3>🧪 Chemical Advice</h3>
          <p>Receive guidance on the right fertilizers and pesticides with proper dosage.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
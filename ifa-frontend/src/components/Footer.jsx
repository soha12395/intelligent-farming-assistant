import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4> Intelligent Farming Assistant</h4>
          <p>AI-powered tools to help Lebanese farmers make better agricultural decisions.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="/dashboard">Dashboard</a>
          <a href="/disease">Disease Detection</a>
          <a href="/recommendation">Crop Recommendation</a>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p> soha.halawi@liu.edu.lb</p>
          <p> adib.hasbany@liu.edu.lb</p>
          <p> Lebanese International University</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Intelligent Farming Assistant — Developed by Soha Halawi & Adib Hasbany</p>
      </div>
    </div>
  );
}

export default Footer;
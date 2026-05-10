import React, { useState } from "react";
import "../styles/Navbar.css";
import logo from "../assets/logo.svg";

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <>
      <div className="navbar">
        <a
          href="/dashboard"
          className="navbar-brand"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img src={logo} alt="IFA Logo" height="65" />
        </a>{" "}
        <button className="hamburger" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="navbar-links desktop-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/farm/add">Farm Profile</a>
          <a href="/recommendation">Recommendations</a>
          <a href="/crop/history">Crop History</a>
          <a href="/disease">Disease Detection</a>
          <a href="/disease/history">Disease History</a>
        </div>
        <button className="logout-btn desktop-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Side drawer for mobile */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>
        <a href="/dashboard" onClick={() => setOpen(false)}>
          Dashboard
        </a>
        <a href="/farm/add" onClick={() => setOpen(false)}>
          Farm Profile
        </a>
        <a href="/recommendation" onClick={() => setOpen(false)}>
          Recommendations
        </a>
        <a href="/crop/history" onClick={() => setOpen(false)}>
          Crop History
        </a>
        <a href="/disease" onClick={() => setOpen(false)}>
          Disease Detection
        </a>
        <a href="/disease/history" onClick={() => setOpen(false)}>
          Disease History
        </a>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
    </>
  );
}

export default Navbar;

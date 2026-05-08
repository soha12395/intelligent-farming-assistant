import React, { useState } from "react";
import api from "../services/api";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.Status === "Success") {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        setError(res.data.Error);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back 🌱</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <p style={{ marginTop: "10px" }}>
          <a href="/forgot-password">Forgot password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

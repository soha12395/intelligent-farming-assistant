import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post('/auth/register', formData);
    if (res.data.Status === 'Verify') {
      localStorage.setItem('pendingEmail', res.data.email);
      window.location.href = '/verify';
    } else {
      setError(res.data.Error);
    }
  } catch (err) {
    setError('Something went wrong');
  }
};

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account 🌱</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}

export default Register;
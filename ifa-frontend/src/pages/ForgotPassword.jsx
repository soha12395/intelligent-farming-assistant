import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Verify.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.Status === 'Success') {
        localStorage.setItem('resetEmail', email);
        window.location.href = '/reset-password';
      } else {
        setError(res.data.Error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <h2>🔑 Forgot Password</h2>
        <p>Enter your email and we will send you a reset code</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            style={{ letterSpacing: 'normal', fontSize: '15px' }}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Code</button>
        </form>
        <p style={{ marginTop: '15px' }}>Remember your password? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}

export default ForgotPassword;
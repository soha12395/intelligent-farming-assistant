import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Verify.css';

function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const email = localStorage.getItem('pendingEmail');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify', { email, code });
      if (res.data.Status === 'Success') {
        localStorage.removeItem('pendingEmail');
        window.location.href = '/login';
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
        <h2>📧 Verify Your Email</h2>
        <p>We sent a 6-digit code to <strong>{email}</strong></p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength="6"
            onChange={e => setCode(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
        <p>Didn't receive the code? <a href="/register">Register again</a></p>
      </div>
    </div>
  );
}

export default Verify;
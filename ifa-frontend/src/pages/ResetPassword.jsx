import React, { useState } from 'react';
import api from '../services/api';
import '../styles/Verify.css';

function ResetPassword() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const email = localStorage.getItem('resetEmail');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');

    try {
      const res = await api.post('/auth/reset-password', { email, code, password });
      if (res.data.Status === 'Success') {
        localStorage.removeItem('resetEmail');
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
        <h2>🔑 Reset Password</h2>
        <p>Enter the code sent to <strong>{email}</strong> and your new password</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength="6"
            onChange={e => setCode(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            style={{ letterSpacing: 'normal', fontSize: '15px' }}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            style={{ letterSpacing: 'normal', fontSize: '15px' }}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
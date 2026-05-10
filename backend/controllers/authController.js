const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationCode } = require('../utils/email');

const register = (req, res) => {
  const { full_name, email, phone, password } = req.body;

  User.findByEmail(email, (err, data) => {
    if (err) return res.json({ Error: 'Server error' });  // ← ADD THIS
    if (data && data.length > 0) return res.json({ Error: 'Email already exists' });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.json({ Error: 'Error hashing password' });

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const userData = {
        full_name,
        email,
        phone,
        password_hash: hash,
        verification_code: code,
        is_verified: 1
      };

      User.create(userData, (err, result) => {
        if (err) return res.json({ Error: 'Error creating account' });

        sendVerificationCode(email, code)
          .then(() => res.json({ Status: 'Verify', email }))
          .catch((e) => {                                  // ← CHANGE THIS
            console.error('Email error:', e.message);
            User.deleteByEmail(email, () => {});
            res.json({ Error: 'Error sending verification email' });
          });
      });
    });
  });
};

const login = (req, res) => {
  User.findByEmail(req.body.email, (err, data) => {
    if (err) return res.json({ Error: 'Login error' });
    if (data.length === 0) return res.json({ Error: 'Account not found' });
    if (data[0].is_verified === 0) return res.json({ Error: 'Please verify your email first' });

    bcrypt.compare(req.body.password, data[0].password_hash, (err, match) => {
      if (err) return res.json({ Error: 'Error comparing password' });
      if (!match) return res.json({ Error: 'Wrong password' });

      const token = jwt.sign(
        { id: data[0].farmer_id, email: data[0].email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ Status: 'Success', token });
    });
  });
};

const verifyCode = (req, res) => {
  const { email, code } = req.body;

  User.findByEmail(email, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Account not found' });
    if (data[0].verification_code !== code) return res.json({ Error: 'Invalid verification code' });

    User.verifyUser(email, (err) => {
      if (err) return res.json({ Error: 'Error verifying account' });
      return res.json({ Status: 'Success' });
    });
  });
};

const getMe = (req, res) => {
  const db = require('../config/db');
  db.query('SELECT farmer_id, full_name, email, phone FROM farmer WHERE farmer_id = ?', [req.farmer_id], (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'User not found' });
    return res.json({ Status: 'Success', farmer: data[0] });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Email not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    User.saveResetCode(email, code, (err) => {
      if (err) return res.json({ Error: 'Error saving reset code' });

      sendVerificationCode(email, code)
        .then(() => res.json({ Status: 'Success', email }))
        .catch(() => res.json({ Error: 'Error sending email' }));
    });
  });
};

const resetPassword = (req, res) => {
  const { email, code, password } = req.body;

  User.findByEmail(email, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Account not found' });
    if (data[0].verification_code !== code) return res.json({ Error: 'Invalid code' });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.json({ Error: 'Error hashing password' });

      User.updatePassword(email, hash, (err) => {
        if (err) return res.json({ Error: 'Error updating password' });
        return res.json({ Status: 'Success' });
      });
    });
  });
};

module.exports = { register, login, verifyCode, getMe, forgotPassword, resetPassword };

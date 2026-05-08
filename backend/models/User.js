const db = require('../config/db');

const User = {
  create: (data, cb) => {
    db.query('INSERT INTO farmer SET ?', data, (err, result) => {
      if (err) console.log('DB Error:', err);
      cb(err, result);
    });
  },

  findByEmail: (email, cb) => {
    db.query('SELECT * FROM farmer WHERE email = ?', [email], cb);
  },

  verifyUser: (email, cb) => {
    db.query('UPDATE farmer SET is_verified = 1 WHERE email = ?', [email], cb);
  },

  updatePassword: (email, password_hash, cb) => {
  db.query('UPDATE farmer SET password_hash = ?, verification_code = NULL WHERE email = ?', [password_hash, email], cb);
},

saveResetCode: (email, code, cb) => {
  db.query('UPDATE farmer SET verification_code = ? WHERE email = ?', [code, email], cb);
}
};


module.exports = User;
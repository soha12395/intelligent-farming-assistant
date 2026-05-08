const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.json({ Error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({ Error: 'Invalid token' });
    req.farmer_id = decoded.id;
    next();
  });
};

module.exports = verifyToken;
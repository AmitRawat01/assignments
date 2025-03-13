const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

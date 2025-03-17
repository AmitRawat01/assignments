import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/keys';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

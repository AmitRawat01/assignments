import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { jwtSecret } from '../config/keys';

export const forgotPassword = (req, res) => {
  const email = req.body.email;
  const resetToken = jwt.sign({ email }, jwtSecret, { expiresIn: '15m' });
  // Send reset token via email
  res.status(200).json({ message: 'Password reset token sent' });
};

export const verifyResetPassword = (req, res) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    // Encrypt the new password and update it in the database
    res.status(200).json({ message: 'Password reset successful' });
  });
};

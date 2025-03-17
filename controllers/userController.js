import User from '../models/userModel.js';

import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/keys.js';


export const deleteAddress = (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Logic to delete addresses from the database
    res.status(200).json({ message: 'Addresses deleted' });
  });
};

export const uploadProfileImage = (req, res) => {
  const file = req.file;
  const storageOption = req.query.storage;

  if (storageOption === 'online') {
    // Logic to upload to online storage
  } else {
    // Logic to save to folder
    res.status(200).json({ message: 'Profile image uploaded' });
  }
};

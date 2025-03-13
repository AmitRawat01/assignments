const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/keys');

exports.deleteAddress = (req, res) => {
  const token = req.headers['authorization'];
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Logic to delete addresses from the database
    res.status(200).json({ message: 'Addresses deleted' });
  });
};

exports.uploadProfileImage = (req, res) => {
  const file = req.file;
  const storageOption = req.query.storage;

  if (storageOption === 'online') {
    // Logic to upload to online storage
  } else {
    // Logic to save to folder
    res.status(200).json({ message: 'Profile image uploaded' });
  }
};

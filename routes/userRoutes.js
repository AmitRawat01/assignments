const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.delete('/address', authMiddleware.verifyToken, userController.deleteAddress);
router.put('/profile-image', authMiddleware.verifyToken, userController.uploadProfileImage);

module.exports = router;

import express from 'express';
import userController from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.delete('/address', authMiddleware.verifyToken, userController.deleteAddress);
router.put('/profile-image', authMiddleware.verifyToken, userController.uploadProfileImage);

export default router;

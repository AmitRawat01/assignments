import express from 'express';
import { deleteAddress, uploadProfileImage } from '../controllers/userController.js';


const router = express.Router();

router.delete('/address', deleteAddress);
router.put('/profile-image', uploadProfileImage);

export default router;

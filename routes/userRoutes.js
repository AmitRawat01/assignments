import express from 'express';
import { registerUser, loginUser, createUserAddress, getUserData, deleteUserData, listUsers } from '../controllers/userControllers.js';
import { validateUser, validateAccessToken } from '../middlewares/validateUsers.js';

const router = express.Router();

router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.post('/address', validateAccessToken, createUserAddress);
router.get('/get/:id', validateAccessToken, getUserData);
router.put('/delete', validateAccessToken, deleteUserData);
router.get('/list/:page', listUsers);

export default router;
